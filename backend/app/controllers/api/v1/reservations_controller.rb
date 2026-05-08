module Api
  module V1
    class ReservationsController < BaseController
      before_action -> { authorize_roles!(:admin, :manager, :front_desk) }

      def index
        reservations = Reservation.includes(:room, :room_category, :guests).order(check_in_date: :asc)
        reservations = reservations.where(status: params[:status]) if params[:status].present?
        reservations = reservations.where("check_in_date >= ?", params[:from]) if params[:from].present?
        reservations = reservations.where("check_out_date <= ?", params[:to]) if params[:to].present?
        render_success(paginate(reservations).as_json(include: %i[room room_category guests]), meta: pagination_meta(reservations))
      end

      def calendar
        start_date = parse_calendar_date(params[:from]) || Date.current
        days = params.fetch(:days, 30).to_i.clamp(7, 90)
        end_date = start_date + days

        reservations = Reservation.includes(:room, :room_category, :guests)
                                  .overlapping(start_date, end_date)
                                  .order(:check_in_date, :check_out_date)
        reservations = reservations.where(status: params[:status]) if params[:status].present?
        reservations = reservations.where(room_category_id: params[:room_category_id]) if params[:room_category_id].present?

        rooms = Room.includes(:room_category).order(:floor, :number)
        rooms = rooms.where(room_category_id: params[:room_category_id]) if params[:room_category_id].present?

        render_success(
          {
            from: start_date,
            to: end_date - 1,
            days: days,
            rooms: rooms.as_json(include: :room_category),
            reservations: reservations.as_json(include: %i[room room_category guests]),
            summary: calendar_summary(reservations, start_date, end_date)
          }
        )
      end

      def show
        reservation = Reservation.includes(:room, :room_category, :guests, :invoice).find(params[:id])
        render_success(reservation.as_json(include: %i[room room_category guests invoice]))
      end

      def create
        reservation = Reservations::CreateReservation.new(params: reservation_params.to_h.symbolize_keys, actor: current_user).call
        render_success(reservation.as_json(include: %i[room room_category guests]), status: :created)
      end

      def update
        reservation = Reservation.find(params[:id])
        reservation.update!(reservation_params.except(:guest_ids))
        render_success(reservation.reload.as_json(include: %i[room room_category guests]))
      end

      def cancel
        reservation = Reservations::CancelReservation.new(
          reservation: Reservation.find(params[:id]),
          actor: current_user,
          reason: params[:reason]
        ).call
        render_success(reservation)
      end

      def destroy
        cancel
      end

      private

      def parse_calendar_date(value)
        Date.iso8601(value.to_s)
      rescue ArgumentError
        nil
      end

      def calendar_summary(reservations, start_date, end_date)
        {
          total_bookings: reservations.size,
          arrivals: reservations.count { |reservation| reservation.check_in_date >= start_date && reservation.check_in_date < end_date },
          departures: reservations.count { |reservation| reservation.check_out_date > start_date && reservation.check_out_date <= end_date },
          unassigned: reservations.count { |reservation| reservation.room_id.blank? }
        }
      end

      def reservation_params
        params.require(:reservation).permit(:room_category_id, :room_id, :check_in_date, :check_out_date, :adults, :children, :source, :special_requests, guest_ids: [])
      end
    end
  end
end

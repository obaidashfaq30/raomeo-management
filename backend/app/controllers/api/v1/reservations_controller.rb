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

      def reservation_params
        params.require(:reservation).permit(:room_category_id, :room_id, :check_in_date, :check_out_date, :adults, :children, :source, :special_requests, guest_ids: [])
      end
    end
  end
end

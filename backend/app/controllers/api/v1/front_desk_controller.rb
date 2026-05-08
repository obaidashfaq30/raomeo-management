module Api
  module V1
    class FrontDeskController < BaseController
      before_action -> { authorize_roles!(:admin, :manager, :front_desk) }

      def live_status
        render_success({
          rooms_by_status: Room.group(:status).count,
          arriving_today: Reservation.confirmed.where(check_in_date: Date.current).count,
          departing_today: Reservation.checked_in.where(check_out_date: Date.current).count,
          open_maintenance: MaintenanceTicket.where.not(status: %i[resolved closed]).count,
          pending_housekeeping: HousekeepingTask.pending.count
        })
      end

      def walk_in
        guest = Guest.create!(guest_params)
        reservation = Reservations::CreateReservation.new(
          params: reservation_params.to_h.merge(guest_ids: [guest.id]).symbolize_keys,
          actor: current_user
        ).call
        render_success(reservation.as_json(include: %i[room room_category guests]), status: :created)
      end

      private

      def guest_params
        params.require(:guest).permit(:first_name, :last_name, :email, :phone, :document_type, :document_number)
      end

      def reservation_params
        params.require(:reservation).permit(:room_category_id, :room_id, :check_in_date, :check_out_date, :adults, :children, :source, :special_requests)
      end
    end
  end
end

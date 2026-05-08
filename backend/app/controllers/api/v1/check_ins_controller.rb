module Api
  module V1
    class CheckInsController < BaseController
      before_action -> { authorize_roles!(:admin, :manager, :front_desk) }

      def create
        stay = CheckIns::CheckInGuest.new(
          reservation: Reservation.find(params.require(:reservation_id)),
          actor: current_user,
          room_id: params[:room_id]
        ).call
        render_success(stay.as_json(include: %i[reservation room guest]), status: :created)
      end
    end
  end
end

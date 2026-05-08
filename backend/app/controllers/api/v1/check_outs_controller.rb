module Api
  module V1
    class CheckOutsController < BaseController
      before_action -> { authorize_roles!(:admin, :manager, :front_desk, :accountant) }

      def create
        result = CheckOuts::CheckOutGuest.new(
          reservation: Reservation.find(params.require(:reservation_id)),
          actor: current_user,
          late_checkout: ActiveModel::Type::Boolean.new.cast(params[:late_checkout]),
          notes: params[:notes]
        ).call
        render_success({
          stay: result[:stay].as_json(include: %i[room guest]),
          invoice: result[:invoice]
        })
      end
    end
  end
end

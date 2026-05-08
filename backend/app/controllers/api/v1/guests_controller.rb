module Api
  module V1
    class GuestsController < BaseController
      before_action -> { authorize_roles!(:admin, :manager, :front_desk) }

      def index
        guests = Guest.order(updated_at: :desc)
        guests = guests.where("first_name ILIKE :q OR last_name ILIKE :q OR email ILIKE :q OR phone ILIKE :q", q: "%#{params[:q]}%") if params[:q].present?
        render_success(paginate(guests), meta: pagination_meta(guests))
      end

      def show
        render_success(Guest.find(params[:id]).as_json(include: :reservations))
      end

      def create
        render_success(Guest.create!(guest_params), status: :created)
      end

      def update
        guest = Guest.find(params[:id])
        guest.update!(guest_params)
        render_success(guest)
      end

      def destroy
        Guest.find(params[:id]).destroy!
        render_success({ deleted: true })
      end

      private

      def guest_params
        params.require(:guest).permit(:first_name, :last_name, :email, :phone, :document_type, :document_number, :preferences, :notes, :loyalty_points)
      end
    end
  end
end

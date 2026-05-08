module Api
  module V1
    class AmenitiesController < BaseController
      before_action -> { authorize_roles!(:admin, :manager) }, except: :index

      def index
        render_success(Amenity.order(:name))
      end

      def create
        render_success(Amenity.create!(amenity_params), status: :created)
      end

      def update
        amenity = Amenity.find(params[:id])
        amenity.update!(amenity_params)
        render_success(amenity)
      end

      def destroy
        Amenity.find(params[:id]).destroy!
        render_success({ deleted: true })
      end

      private

      def amenity_params
        params.require(:amenity).permit(:name, :icon)
      end
    end
  end
end

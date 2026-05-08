module Api
  module V1
    class RoomCategoriesController < BaseController
      before_action -> { authorize_roles!(:admin, :manager) }, except: %i[index show]
      before_action :set_room_category, only: %i[show update destroy]

      def index
        categories = RoomCategory.includes(:amenities).order(:name)
        render_success(categories.as_json(include: :amenities))
      end

      def show
        render_success(@room_category.as_json(include: :amenities))
      end

      def create
        category = RoomCategory.create!(room_category_params)
        sync_amenities(category)
        render_success(category.reload.as_json(include: :amenities), status: :created)
      end

      def update
        @room_category.update!(room_category_params)
        sync_amenities(@room_category)
        render_success(@room_category.reload.as_json(include: :amenities))
      end

      def destroy
        @room_category.update!(active: false)
        render_success(@room_category)
      end

      private

      def set_room_category
        @room_category = RoomCategory.find(params[:id])
      end

      def room_category_params
        params.require(:room_category).permit(:name, :description, :base_rate_cents, :max_occupancy, :active)
      end

      def sync_amenities(category)
        return unless params[:room_category]&.key?(:amenity_ids)

        category.amenity_ids = Array(params[:room_category][:amenity_ids])
      end
    end
  end
end

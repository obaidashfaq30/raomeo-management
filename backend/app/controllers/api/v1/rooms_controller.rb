module Api
  module V1
    class RoomsController < BaseController
      before_action -> { authorize_roles!(:admin, :manager, :front_desk, :housekeeping) }
      before_action :set_room, only: %i[show update destroy status]

      def index
        rooms = Room.includes(:room_category).order(:floor, :number)
        rooms = rooms.where(status: params[:status]) if params[:status].present?
        rooms = rooms.where(room_category_id: params[:room_category_id]) if params[:room_category_id].present?
        render_success(paginate(rooms).as_json(include: :room_category), meta: pagination_meta(rooms))
      end

      def show
        render_success(@room.as_json(include: :room_category))
      end

      def create
        authorize_roles!(:admin, :manager)
        render_success(Room.create!(room_params), status: :created)
      end

      def update
        authorize_roles!(:admin, :manager)
        @room.update!(room_params)
        render_success(@room)
      end

      def status
        @room.update!(status: params.require(:status))
        Audit::Recorder.call(actor: current_user, action: "room.status_changed", auditable: @room, request: request)
        render_success(@room)
      end

      def destroy
        authorize_roles!(:admin)
        @room.update!(status: :out_of_service)
        render_success(@room)
      end

      private

      def set_room
        @room = Room.find(params[:id])
      end

      def room_params
        params.require(:room).permit(:room_category_id, :number, :floor, :status, :rate_override_cents, metadata: {})
      end
    end
  end
end

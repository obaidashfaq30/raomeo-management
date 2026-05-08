module Api
  module V1
    class HousekeepingTasksController < BaseController
      before_action -> { authorize_roles!(:admin, :manager, :housekeeping, :front_desk) }

      def index
        tasks = HousekeepingTask.includes(:room, :assigned_to).order(scheduled_for: :asc, created_at: :desc)
        tasks = tasks.where(status: params[:status]) if params[:status].present?
        tasks = tasks.where(assigned_to_id: params[:assigned_to_id]) if params[:assigned_to_id].present?
        render_success(paginate(tasks).as_json(include: %i[room assigned_to]), meta: pagination_meta(tasks))
      end

      def show
        render_success(HousekeepingTask.find(params[:id]).as_json(include: %i[room assigned_to]))
      end

      def create
        render_success(HousekeepingTask.create!(task_params), status: :created)
      end

      def update
        task = HousekeepingTask.find(params[:id])
        task.update!(task_params)
        task.room.available! if task.completed? && task.room.cleaning?
        render_success(task.as_json(include: %i[room assigned_to]))
      end

      def destroy
        HousekeepingTask.find(params[:id]).destroy!
        render_success({ deleted: true })
      end

      private

      def task_params
        params.require(:housekeeping_task).permit(:room_id, :assigned_to_id, :scheduled_for, :status, :task_type, :notes, :completed_at)
      end
    end
  end
end

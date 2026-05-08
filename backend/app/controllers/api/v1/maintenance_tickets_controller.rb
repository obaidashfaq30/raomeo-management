module Api
  module V1
    class MaintenanceTicketsController < BaseController
      before_action -> { authorize_roles!(:admin, :manager, :front_desk, :housekeeping) }

      def index
        tickets = MaintenanceTicket.includes(:room, :reported_by, :assigned_to).order(priority: :desc, created_at: :desc)
        tickets = tickets.where(status: params[:status]) if params[:status].present?
        render_success(paginate(tickets).as_json(include: %i[room reported_by assigned_to]), meta: pagination_meta(tickets))
      end

      def show
        render_success(MaintenanceTicket.find(params[:id]).as_json(include: %i[room reported_by assigned_to]))
      end

      def create
        ticket = MaintenanceTicket.create!(ticket_params.merge(reported_by: current_user))
        ticket.room.maintenance!
        render_success(ticket, status: :created)
      end

      def update
        ticket = MaintenanceTicket.find(params[:id])
        ticket.update!(ticket_params)
        ticket.update!(resolved_at: Time.current) if ticket.resolved? && ticket.resolved_at.blank?
        render_success(ticket.as_json(include: %i[room assigned_to]))
      end

      def destroy
        MaintenanceTicket.find(params[:id]).closed!
        render_success({ closed: true })
      end

      private

      def ticket_params
        params.require(:maintenance_ticket).permit(:room_id, :assigned_to_id, :title, :description, :priority, :status)
      end
    end
  end
end

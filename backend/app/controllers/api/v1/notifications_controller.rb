module Api
  module V1
    class NotificationsController < BaseController
      def index
        notifications = Notification.where(user: [current_user, nil]).order(created_at: :desc).limit(50)
        render_success(notifications)
      end

      def update
        notification = Notification.find(params[:id])
        notification.update!(read_at: Time.current)
        render_success(notification)
      end
    end
  end
end

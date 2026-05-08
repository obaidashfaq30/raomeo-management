module Api
  module V1
    class UsersController < BaseController
      before_action -> { authorize_roles!(:admin, :manager) }

      def index
        users = User.order(:role, :name)
        users = users.where(role: params[:role]) if params[:role].present?
        render_success(paginate(users).as_json(only: %i[id name email role active last_login_at]), meta: pagination_meta(users))
      end

      def show
        render_success(User.find(params[:id]).as_json(only: %i[id name email role active last_login_at]))
      end

      def create
        render_success(User.create!(user_params), status: :created)
      end

      def update
        user = User.find(params[:id])
        attrs = user_params.to_h.compact_blank
        user.update!(attrs)
        render_success(user.as_json(only: %i[id name email role active last_login_at]))
      end

      def destroy
        User.find(params[:id]).update!(active: false)
        render_success({ deactivated: true })
      end

      private

      def user_params
        params.require(:user).permit(:name, :email, :password, :role, :active)
      end
    end
  end
end

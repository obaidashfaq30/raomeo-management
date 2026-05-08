module Api
  module V1
    class AuthController < BaseController
      skip_before_action :authenticate_user!, only: :login

      def login
        user = User.active.find_by(email: params.require(:email).to_s.downcase)
        if user&.authenticate(params.require(:password))
          user.update!(last_login_at: Time.current)
          render_success({ token: Auth::JsonWebToken.encode({ sub: user.id, role: user.role }), user: user_payload(user) })
        else
          render_error("Invalid email or password", :unauthorized)
        end
      end

      def me
        render_success(user_payload(current_user))
      end

      private

      def user_payload(user)
        user.slice(:id, :name, :email, :role, :active)
      end
    end
  end
end

module Authorizable
  extend ActiveSupport::Concern

  def authorize_roles!(*roles)
    return true if current_user&.allowed_role?(*roles)

    render json: { error: "Forbidden" }, status: :forbidden
    false
  end
end

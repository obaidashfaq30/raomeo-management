class ApplicationController < ActionController::API
  rescue_from ActionController::ParameterMissing do |error|
    render json: { error: error.message }, status: :unprocessable_entity
  end
end

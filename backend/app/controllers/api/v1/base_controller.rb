module Api
  module V1
    class BaseController < ApplicationController
      include Authorizable

      before_action :authenticate_user!

      rescue_from ActiveRecord::RecordNotFound do |error|
        render_error(error.message.presence || "Record not found", :not_found)
      end

      rescue_from ActiveRecord::RecordInvalid do |error|
        render_error(error.record.errors.full_messages, :unprocessable_entity)
      end

      private

      attr_reader :current_user

      def authenticate_user!
        token = request.headers["Authorization"].to_s.match(/\ABearer (.+)\z/)&.captures&.first
        payload = Auth::JsonWebToken.decode(token)
        @current_user = User.active.find(payload.fetch(:sub))
      rescue JWT::DecodeError, JWT::ExpiredSignature, KeyError, ActiveRecord::RecordNotFound
        render_error("Unauthorized", :unauthorized)
      end

      def render_success(data = {}, status: :ok, meta: {})
        body = { data: data }
        body[:meta] = meta if meta.present?
        render json: body, status: status
      end

      def render_error(message, status)
        render json: { error: message }, status: status
      end

      def pagination_meta(scope)
        { total: scope.count, page: params.fetch(:page, 1).to_i, per_page: params.fetch(:per_page, 25).to_i }
      end

      def paginate(scope)
        page = params.fetch(:page, 1).to_i.clamp(1, 10_000)
        per_page = params.fetch(:per_page, 25).to_i.clamp(1, 100)
        scope.limit(per_page).offset((page - 1) * per_page)
      end
    end
  end
end

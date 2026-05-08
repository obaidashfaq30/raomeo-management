module Api
  module V1
    class HealthController < ApplicationController
      def show
        render json: { status: "ok", service: "raomeo-management-api" }
      end
    end
  end
end

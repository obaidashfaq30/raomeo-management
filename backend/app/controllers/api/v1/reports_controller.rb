module Api
  module V1
    class ReportsController < BaseController
      before_action -> { authorize_roles!(:admin, :manager, :accountant) }

      def occupancy
        total_rooms = Room.count
        occupied = Room.occupied.count
        reserved = Room.reserved.count
        render_success({
          total_rooms: total_rooms,
          occupied_rooms: occupied,
          reserved_rooms: reserved,
          available_rooms: Room.available.count,
          occupancy_rate: total_rooms.zero? ? 0 : ((occupied.to_f / total_rooms) * 100).round(2)
        })
      end

      def revenue
        render_success(analytics.revenue)
      end

      def booking_trends
        render_success(analytics.booking_trends)
      end

      private

      def analytics
        Reports::RevenueAnalytics.new(start_date: params.fetch(:start_date, 30.days.ago.to_date), end_date: params.fetch(:end_date, Date.current))
      end
    end
  end
end

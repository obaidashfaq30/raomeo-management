module Api
  module V1
    class FoodBeverageOrdersController < BaseController
      before_action -> { authorize_roles!(:admin, :manager, :front_desk, :accountant) }

      def index
        orders = FoodBeverageOrder.includes(:room, :guest, :reservation).order(ordered_at: :desc)
        orders = orders.where(status: params[:status]) if params[:status].present?
        render_success(paginate(orders).as_json(include: %i[room guest reservation food_beverage_order_items]), meta: pagination_meta(orders))
      end

      def show
        render_success(FoodBeverageOrder.find(params[:id]).as_json(include: %i[room guest reservation food_beverage_order_items]))
      end

      def create
        order = FoodBeverageOrder.create!(order_params.merge(ordered_at: Time.current))
        render_success(order.as_json(include: :food_beverage_order_items), status: :created)
      end

      def update
        order = FoodBeverageOrder.find(params[:id])
        order.update!(order_params)
        render_success(order.as_json(include: :food_beverage_order_items))
      end

      def destroy
        FoodBeverageOrder.find(params[:id]).cancelled!
        render_success({ cancelled: true })
      end

      private

      def order_params
        params.require(:food_beverage_order).permit(
          :room_id, :guest_id, :reservation_id, :invoice_id, :status, :source,
          food_beverage_order_items_attributes: %i[id name quantity unit_price_cents _destroy]
        )
      end
    end
  end
end

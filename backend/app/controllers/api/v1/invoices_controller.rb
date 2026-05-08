module Api
  module V1
    class InvoicesController < BaseController
      before_action -> { authorize_roles!(:admin, :manager, :accountant, :front_desk) }

      def index
        invoices = Invoice.includes(:guest, :reservation).order(issued_on: :desc)
        invoices = invoices.where(status: params[:status]) if params[:status].present?
        render_success(paginate(invoices).as_json(include: %i[guest reservation]), meta: pagination_meta(invoices))
      end

      def show
        render_success(Invoice.find(params[:id]).as_json(include: %i[guest reservation payments refunds food_beverage_orders]))
      end

      def create
        invoice = Billing::GenerateInvoice.new(
          reservation: Reservation.find(params.require(:reservation_id)),
          actor: current_user,
          discount_cents: params[:discount_cents]
        ).call
        render_success(invoice, status: :created)
      end

      def refund
        authorize_roles!(:admin, :manager, :accountant)
        invoice = Invoice.find(params[:id])
        Refund.create!(
          invoice: invoice,
          processed_by: current_user,
          amount_cents: params.require(:amount_cents),
          reason: params.require(:reason),
          refunded_at: Time.current
        )
        invoice.refunded! if invoice.balance_cents <= 0
        render_success(invoice.reload.as_json(include: :refunds))
      end
    end
  end
end

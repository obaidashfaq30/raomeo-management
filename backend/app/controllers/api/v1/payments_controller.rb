module Api
  module V1
    class PaymentsController < BaseController
      before_action -> { authorize_roles!(:admin, :manager, :accountant, :front_desk) }

      def create
        invoice = Invoice.find(params[:invoice_id])
        payment = invoice.payments.create!(payment_params.merge(received_by: current_user, paid_at: Time.current))
        invoice.update!(status: invoice.balance_cents <= 0 ? :paid : :partially_paid)
        render_success(payment, status: :created)
      end

      private

      def payment_params
        params.require(:payment).permit(:amount_cents, :method, :reference)
      end
    end
  end
end

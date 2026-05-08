module Reports
  class RevenueAnalytics
    def initialize(start_date: 30.days.ago.to_date, end_date: Date.current)
      @start_date = Date.parse(start_date.to_s)
      @end_date = Date.parse(end_date.to_s)
    end

    def revenue
      invoices = Invoice.where(issued_on: start_date..end_date)
      {
        subtotal_cents: invoices.sum(:subtotal_cents),
        tax_cents: invoices.sum(:tax_cents),
        discount_cents: invoices.sum(:discount_cents),
        total_cents: invoices.sum(:total_cents),
        paid_cents: Payment.where(paid_at: start_date.beginning_of_day..end_date.end_of_day).sum(:amount_cents)
      }
    end

    def booking_trends
      Reservation.where(created_at: start_date.beginning_of_day..end_date.end_of_day)
                 .group("DATE(created_at)")
                 .order("DATE(created_at)")
                 .count
                 .map { |date, count| { date: date, bookings: count } }
    end

    private

    attr_reader :start_date, :end_date
  end
end

module Billing
  class GenerateInvoice
    TAX_RATE = BigDecimal("0.12")

    def initialize(reservation:, actor:, discount_cents: 0)
      @reservation = reservation
      @actor = actor
      @discount_cents = discount_cents.to_i
    end

    def call
      return reservation.invoice if reservation.invoice.present?

      guest = reservation.primary_guest || reservation.guests.first
      room_charge = reservation.rate_cents
      fb_total = reservation.food_beverage_orders.where.not(status: :cancelled).sum(:total_cents)
      subtotal = room_charge + fb_total
      tax = ((subtotal - discount_cents) * TAX_RATE).round
      total = subtotal - discount_cents + tax

      invoice = Invoice.create!(
        reservation: reservation,
        guest: guest,
        subtotal_cents: subtotal,
        discount_cents: discount_cents,
        tax_cents: tax,
        total_cents: total,
        status: :issued,
        issued_on: Date.current,
        due_on: Date.current + 7.days,
        line_items: [
          { label: "Room charges", amount_cents: room_charge },
          { label: "Food and beverage", amount_cents: fb_total },
          { label: "Tax", amount_cents: tax },
          { label: "Discount", amount_cents: -discount_cents }
        ]
      )
      reservation.food_beverage_orders.update_all(invoice_id: invoice.id, status: FoodBeverageOrder.statuses[:charged])
      Audit::Recorder.call(actor: actor, action: "invoice.generated", auditable: invoice)
      invoice
    end

    private

    attr_reader :reservation, :actor, :discount_cents
  end
end

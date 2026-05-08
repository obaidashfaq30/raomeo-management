module CheckOuts
  class CheckOutGuest
    def initialize(reservation:, actor:, late_checkout: false, notes: nil)
      @reservation = reservation
      @actor = actor
      @late_checkout = late_checkout
      @notes = notes
    end

    def call
      Reservation.transaction do
        stay = reservation.stay || raise(ActiveRecord::RecordNotFound, "Stay not found")
        stay.update!(
          checked_out_at: Time.current,
          checked_out_by: actor,
          late_checkout: late_checkout,
          checkout_notes: notes
        )
        reservation.checked_out!
        reservation.room&.cleaning!
        invoice = Billing::GenerateInvoice.new(reservation: reservation, actor: actor).call
        Audit::Recorder.call(actor: actor, action: "stay.checked_out", auditable: stay)
        { stay: stay, invoice: invoice }
      end
    end

    private

    attr_reader :reservation, :actor, :late_checkout, :notes
  end
end

module Reservations
  class CancelReservation
    def initialize(reservation:, actor:, reason: nil)
      @reservation = reservation
      @actor = actor
      @reason = reason
    end

    def call
      Reservation.transaction do
        reservation.update!(status: :cancelled, cancelled_at: Time.current)
        reservation.room&.available! if reservation.room&.reserved?
        Audit::Recorder.call(actor: actor, action: "reservation.cancelled", auditable: reservation, metadata: { reason: reason })
        reservation
      end
    end

    private

    attr_reader :reservation, :actor, :reason
  end
end

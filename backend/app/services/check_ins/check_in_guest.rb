module CheckIns
  class CheckInGuest
    def initialize(reservation:, actor:, room_id: nil)
      @reservation = reservation
      @actor = actor
      @room_id = room_id
    end

    def call
      Reservation.transaction do
        room = resolve_room
        guest = reservation.primary_guest || raise(ActiveRecord::RecordNotFound, "Reservation requires a primary guest")

        reservation.update!(room: room, status: :checked_in)
        room.occupied!
        stay = Stay.create!(
          reservation: reservation,
          room: room,
          guest: guest,
          checked_in_at: Time.current,
          checked_in_by: actor
        )
        Audit::Recorder.call(actor: actor, action: "stay.checked_in", auditable: stay)
        stay
      end
    end

    private

    attr_reader :reservation, :actor, :room_id

    def resolve_room
      return Room.find(room_id) if room_id.present?
      return reservation.room if reservation.room.present?

      Room.available_for_dates(
        category_id: reservation.room_category_id,
        check_in_date: reservation.check_in_date,
        check_out_date: reservation.check_out_date
      ).order(:floor, :number).first || raise(ActiveRecord::RecordNotFound, "No available room")
    end
  end
end

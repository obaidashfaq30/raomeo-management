module Reservations
  class CreateReservation
    def initialize(params:, actor:)
      @params = params
      @actor = actor
    end

    def call
      Reservation.transaction do
        category = RoomCategory.find(params.fetch(:room_category_id))
        room = select_room(category)
        reservation = Reservation.create!(
          room_category: category,
          room: room,
          check_in_date: params.fetch(:check_in_date),
          check_out_date: params.fetch(:check_out_date),
          adults: params.fetch(:adults, 1),
          children: params.fetch(:children, 0),
          source: params.fetch(:source, "direct"),
          special_requests: params[:special_requests],
          rate_cents: (room&.sell_rate_cents || category.base_rate_cents) * nights,
          status: :confirmed,
          created_by: actor
        )
        attach_guests(reservation)
        room&.reserved!
        Audit::Recorder.call(actor: actor, action: "reservation.created", auditable: reservation)
        reservation
      end
    end

    private

    attr_reader :params, :actor

    def nights
      [(Date.parse(params.fetch(:check_out_date).to_s) - Date.parse(params.fetch(:check_in_date).to_s)).to_i, 1].max
    end

    def select_room(category)
      return Room.find(params[:room_id]) if params[:room_id].present?

      Room.available_for_dates(
        category_id: category.id,
        check_in_date: params.fetch(:check_in_date),
        check_out_date: params.fetch(:check_out_date)
      ).order(:floor, :number).first
    end

    def attach_guests(reservation)
      guest_ids = Array(params[:guest_ids]).compact_blank
      guest_ids.each_with_index do |guest_id, index|
        reservation.reservation_guests.create!(guest_id: guest_id, primary_guest: index.zero?)
      end
    end
  end
end

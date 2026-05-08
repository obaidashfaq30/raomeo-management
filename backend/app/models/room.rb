class Room < ApplicationRecord
  include SearchIndexable

  belongs_to :room_category
  has_many :reservations, dependent: :nullify
  has_many :stays, dependent: :restrict_with_exception
  has_many :housekeeping_tasks, dependent: :destroy
  has_many :maintenance_tickets, dependent: :destroy

  enum :status, {
    available: 0,
    reserved: 1,
    occupied: 2,
    cleaning: 3,
    maintenance: 4,
    out_of_service: 5
  }

  validates :number, presence: true, uniqueness: true
  validates :floor, numericality: { only_integer: true, greater_than_or_equal_to: 0 }

  scope :serviceable, -> { where.not(status: %i[maintenance out_of_service]) }

  def self.available_for_dates(category_id:, check_in_date:, check_out_date:)
    blocked_room_ids = Reservation.blocking
                                  .overlapping(check_in_date, check_out_date)
                                  .where.not(room_id: nil)
                                  .select(:room_id)

    serviceable.where(room_category_id: category_id).where.not(id: blocked_room_ids)
  end

  def sell_rate_cents
    rate_override_cents || room_category.base_rate_cents
  end
end

class RoomCategory < ApplicationRecord
  include SearchIndexable

  has_many :rooms, dependent: :restrict_with_exception
  has_many :room_category_amenities, dependent: :destroy
  has_many :amenities, through: :room_category_amenities

  validates :name, presence: true, uniqueness: true
  validates :base_rate_cents, numericality: { greater_than_or_equal_to: 0 }
  validates :max_occupancy, numericality: { greater_than: 0 }
end

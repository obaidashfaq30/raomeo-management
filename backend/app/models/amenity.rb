class Amenity < ApplicationRecord
  has_many :room_category_amenities, dependent: :destroy
  has_many :room_categories, through: :room_category_amenities

  validates :name, presence: true, uniqueness: true
end

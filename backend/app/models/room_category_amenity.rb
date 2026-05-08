class RoomCategoryAmenity < ApplicationRecord
  belongs_to :room_category
  belongs_to :amenity
end

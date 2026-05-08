class Stay < ApplicationRecord
  belongs_to :reservation
  belongs_to :room
  belongs_to :guest
  belongs_to :checked_in_by, class_name: "User", optional: true
  belongs_to :checked_out_by, class_name: "User", optional: true

  validates :checked_in_at, presence: true
end

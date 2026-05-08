class Guest < ApplicationRecord
  include SearchIndexable

  has_many :reservation_guests, dependent: :destroy
  has_many :reservations, through: :reservation_guests
  has_many :stays, dependent: :restrict_with_exception
  has_many :invoices, dependent: :restrict_with_exception
  has_many :food_beverage_orders, dependent: :nullify

  validates :first_name, :last_name, presence: true

  def full_name
    "#{first_name} #{last_name}"
  end
end

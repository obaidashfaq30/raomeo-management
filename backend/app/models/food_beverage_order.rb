class FoodBeverageOrder < ApplicationRecord
  belongs_to :room, optional: true
  belongs_to :guest, optional: true
  belongs_to :reservation, optional: true
  belongs_to :invoice, optional: true
  has_many :food_beverage_order_items, dependent: :destroy

  enum :status, { pending: 0, preparing: 1, delivered: 2, charged: 3, cancelled: 4 }

  accepts_nested_attributes_for :food_beverage_order_items, allow_destroy: true

  before_validation :calculate_total

  validates :ordered_at, presence: true

  private

  def calculate_total
    food_beverage_order_items.each(&:valid?)
    self.total_cents = food_beverage_order_items.sum { |item| item.total_cents.to_i }
  end
end

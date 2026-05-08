class FoodBeverageOrderItem < ApplicationRecord
  belongs_to :food_beverage_order

  before_validation :calculate_total

  validates :name, presence: true
  validates :quantity, numericality: { greater_than: 0 }
  validates :unit_price_cents, numericality: { greater_than_or_equal_to: 0 }

  private

  def calculate_total
    self.total_cents = quantity.to_i * unit_price_cents.to_i
  end
end

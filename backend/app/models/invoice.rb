class Invoice < ApplicationRecord
  include SearchIndexable

  belongs_to :reservation
  belongs_to :guest
  has_many :payments, dependent: :destroy
  has_many :refunds, dependent: :destroy
  has_many :food_beverage_orders, dependent: :nullify

  enum :status, { draft: 0, issued: 1, partially_paid: 2, paid: 3, refunded: 4, void: 5 }

  validates :number, presence: true, uniqueness: true
  validates :issued_on, presence: true

  before_validation :assign_number, on: :create

  def paid_cents
    payments.sum(:amount_cents) - refunds.sum(:amount_cents)
  end

  def balance_cents
    total_cents - paid_cents
  end

  private

  def assign_number
    self.number ||= "INV-#{Time.current.strftime("%Y%m%d")}-#{SecureRandom.hex(3).upcase}"
  end
end

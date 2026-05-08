class Payment < ApplicationRecord
  belongs_to :invoice
  belongs_to :received_by, class_name: "User", optional: true

  validates :amount_cents, numericality: { greater_than: 0 }
  validates :method, :paid_at, presence: true
end

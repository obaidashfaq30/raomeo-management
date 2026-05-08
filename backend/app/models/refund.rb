class Refund < ApplicationRecord
  belongs_to :invoice
  belongs_to :processed_by, class_name: "User", optional: true

  validates :amount_cents, numericality: { greater_than: 0 }
  validates :reason, :refunded_at, presence: true
end

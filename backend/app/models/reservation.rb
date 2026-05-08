class Reservation < ApplicationRecord
  include SearchIndexable

  belongs_to :room_category
  belongs_to :room, optional: true
  belongs_to :created_by, class_name: "User", optional: true
  has_many :reservation_guests, dependent: :destroy
  has_many :guests, through: :reservation_guests
  has_one :stay, dependent: :destroy
  has_one :invoice, dependent: :restrict_with_exception
  has_many :food_beverage_orders, dependent: :nullify

  enum :status, {
    draft: 0,
    confirmed: 1,
    checked_in: 2,
    checked_out: 3,
    cancelled: 4,
    no_show: 5
  }

  validates :code, presence: true, uniqueness: true
  validates :check_in_date, :check_out_date, :status, presence: true
  validate :checkout_after_checkin

  before_validation :assign_code, on: :create

  scope :blocking, -> { where(status: %i[confirmed checked_in]) }
  scope :overlapping, ->(start_date, end_date) { where("check_in_date < ? AND check_out_date > ?", end_date, start_date) }

  def nights
    [(check_out_date - check_in_date).to_i, 1].max
  end

  def primary_guest
    reservation_guests.includes(:guest).find_by(primary_guest: true)&.guest || guests.first
  end

  private

  def assign_code
    self.code ||= "RAO-#{Time.current.strftime("%Y%m%d")}-#{SecureRandom.hex(3).upcase}"
  end

  def checkout_after_checkin
    return if check_in_date.blank? || check_out_date.blank?

    errors.add(:check_out_date, "must be after check-in date") if check_out_date <= check_in_date
  end
end

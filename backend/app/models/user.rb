class User < ApplicationRecord
  has_secure_password

  enum :role, {
    admin: 0,
    front_desk: 1,
    housekeeping: 2,
    accountant: 3,
    manager: 4
  }

  has_many :created_reservations, class_name: "Reservation", foreign_key: :created_by_id, dependent: :nullify
  has_many :notifications, dependent: :nullify

  validates :name, :role, presence: true
  validates :email, presence: true, uniqueness: { case_sensitive: false }

  before_validation :normalize_email

  scope :active, -> { where(active: true) }

  def allowed_role?(*roles)
    admin? || roles.flatten.map(&:to_s).include?(role)
  end

  private

  def normalize_email
    self.email = email.to_s.strip.downcase
  end
end

class Notification < ApplicationRecord
  belongs_to :user, optional: true

  validates :title, :message, :category, presence: true
end

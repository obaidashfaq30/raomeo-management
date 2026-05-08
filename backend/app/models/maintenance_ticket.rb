class MaintenanceTicket < ApplicationRecord
  belongs_to :room
  belongs_to :reported_by, class_name: "User", optional: true
  belongs_to :assigned_to, class_name: "User", optional: true

  enum :priority, { low: 0, medium: 1, high: 2, urgent: 3 }
  enum :status, { open: 0, assigned: 1, in_progress: 2, resolved: 3, closed: 4 }

  validates :title, presence: true
end

class HousekeepingTask < ApplicationRecord
  belongs_to :room
  belongs_to :assigned_to, class_name: "User", optional: true

  enum :status, {
    pending: 0,
    in_progress: 1,
    completed: 2,
    blocked: 3
  }

  validates :scheduled_for, :task_type, presence: true
end

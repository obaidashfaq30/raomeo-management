class ReportGenerationJob < ApplicationJob
  queue_as :reports

  def perform(report_name, requested_by_id, filters = {})
    user = User.find_by(id: requested_by_id)
    Notification.create!(
      user: user,
      title: "#{report_name.to_s.titleize} report is ready",
      message: "Your report was generated with filters: #{filters.compact.to_json}",
      category: "reports"
    )
  end
end

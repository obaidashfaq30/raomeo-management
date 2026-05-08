class SearchIndexJob < ApplicationJob
  queue_as :search

  def perform(record_class, record_id)
    record = record_class.constantize.find_by(id: record_id)
    SearchIndex.upsert_record(record) if record
  end
end

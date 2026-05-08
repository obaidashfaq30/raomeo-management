module SearchIndexable
  extend ActiveSupport::Concern

  included do
    after_commit :enqueue_search_index, on: %i[create update]
  end

  private

  def enqueue_search_index
    SearchIndexJob.perform_later(self.class.name, id)
  end
end

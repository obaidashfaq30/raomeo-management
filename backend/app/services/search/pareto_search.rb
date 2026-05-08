module Search
  class ParetoSearch
    DEFAULT_TYPES = %w[Guest Reservation Room Invoice].freeze

    def initialize(query:, filters: {}, sort: "updated_at_desc", limit: 20)
      @query = query.to_s.strip
      @filters = filters
      @sort = sort
      @limit = limit.to_i.clamp(1, 100)
    end

    def call
      scope = SearchIndex.all
      scope = scope.where(indexed_type: normalized_types) if filters[:types].present?
      scope = scope.where("content ILIKE ?", "%#{ActiveRecord::Base.sanitize_sql_like(query)}%") if query.present?
      scope = apply_sort(scope)
      scope.limit(limit).map { |row| row.metadata.merge(score: score(row.content)) }
    end

    private

    attr_reader :query, :filters, :sort, :limit

    def normalized_types
      Array(filters[:types]).presence&.map { |type| type.to_s.camelize } || DEFAULT_TYPES
    end

    def apply_sort(scope)
      sort == "created_at_asc" ? scope.order(created_at: :asc) : scope.order(updated_at: :desc)
    end

    def score(content)
      return 0 if query.blank?

      content.downcase.include?(query.downcase) ? 1 : 0
    end
  end
end

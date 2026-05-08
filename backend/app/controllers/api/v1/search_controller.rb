module Api
  module V1
    class SearchController < BaseController
      def index
        results = Search::ParetoSearch.new(
          query: params[:q],
          filters: { types: params[:types] },
          sort: params[:sort],
          limit: params.fetch(:limit, 20)
        ).call
        render_success(results)
      end
    end
  end
end

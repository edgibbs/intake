# frozen_string_literal: true

# PersonSearchRepository is a service class responsible for search of a person
# resource via the API
class PersonSearchRepository
  class << self
    def search(security_token, search_term)
      response = DoraAPI.make_api_call(
        security_token,
        Rails.application.routes.url_helpers.dora_people_light_index_path,
        :post,
        PersonSearchQueryBuilder.new(search_term).build
      )
      search_body = response.body
      raise search_body unless response.status == 200
      build_response(search_body)
    end

    def build_response(search_body)
      {
        'hits' => {
          'total' => search_body.dig('hits', 'total'),
          'hits' => search_hits(search_body)
        }
      }
    end

    def search_hits(search_body)
      search_body.dig('hits', 'hits').map do |document|
        PeopleSearchResultsInterpreter.interpret_sensitivity_indicator(document)
        PeopleSearchResultsInterpreter.interpret_addresses(document)
        PeopleSearchResultsInterpreter.interpret_languages(document)
        PeopleSearchResultsInterpreter.interpret_highlights(document)
        PeopleSearchResultsInterpreter.interpret_race_ethnicity(document)
        PeopleSearchResultsInterpreter.interpret_ssn(document)
        PeopleSearchResultsInterpreter.interpret_legacy_id(document)
        document['_source']
      end
    end
  end
end

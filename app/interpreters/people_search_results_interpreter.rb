# frozen_string_literal: true

class PeopleSearchResultsInterpreter # :nodoc:
  class << self
    ALLOWABLE_SSN_CHARS = 4

    def interpret_sensitivity_indicator(document)
      source = document['_source']
      # sensitivity_indicator { S => Sensitive, R => Sealed, otherwise neither }
      if source && source['sensitivity_indicator']
        source['sensitive'] = source['sensitivity_indicator'].casecmp('s').zero?
        source['sealed'] = source['sensitivity_indicator'].casecmp('r').zero?
      else
        source['sensitive'] = false
        source['sealed'] = false
      end
    end

    def interpret_languages(document)
      source = document['_source']
      return unless source['languages'] && source['languages'].any?
      sorted_languages = source['languages'].partition do |language|
        language['primary'] == true
      end.flatten
      source['languages'] = sorted_languages.map { |language| language['name'] }
    end

    def interpret_addresses(document)
      source = document['_source']
      return unless source['addresses'] && source['addresses'].any?
      translated_addresses = source['addresses'].map do |address|
        address['street_address'] = [
          address['street_number'],
          address['street_name']
        ].join(' ')
        address['state'] = address['state_code']
        address.except('state_code', 'street_number', 'street_name')
      end
      source['addresses'] = translated_addresses
    end

    def interpret_highlights(document)
      highlight = {}
      if document['highlight']
        highlight = document['highlight'].each_with_object({}) do |(k, v), memo|
          memo[k] = v.first
          memo
        end
      end
      document['_source'] = document['_source'].merge('highlight' => highlight)
    end

    def interpret_source_ssn(document)
      source = document['_source']
      highlight = source.stringify_keys['highlight']
      source['ssn'] = add_placeholder_to_redacted_ssn(source.stringify_keys['ssn'])
      return unless highlight && highlight['ssn']
      highlight['ssn'] =
        "<em>#{highlight['ssn'][4..-6].gsub(/.(?=.{#{ALLOWABLE_SSN_CHARS}})/, '')}</em>"
    end

    def interpret_race_ethnicity(document)
      source = document['_source']
      race_ethnicity = source.stringify_keys['race_ethnicity']
      return unless race_ethnicity
      races = interpret_races(
        race_ethnicity['race_codes'],
        race_ethnicity['unable_to_determine_code']
      )

      ethnicity = {
        'hispanic_latino_origin' => hispanic_latino_origin_for_code(
          race_ethnicity['hispanic_origin_code']
        ),
        'ethnicity_detail' => interpret_ethnicities(race_ethnicity['hispanic_codes'])
      }
      document['_source'] = source.merge('races' => races).merge('ethnicity' => ethnicity)
    end

    def hispanic_latino_origin_for_code(code)
      case code
      when 'Y'
        'Yes'
      when 'N'
        'No'
      when 'U'
        'Unknown'
      when 'Z'
        'Abandoned'
      when 'D'
        'Declined to answer'
      end
    end

    def interpret_ethnicities(ethnicities)
      return unless ethnicities
      ethnicities.map { |ethnicity| ethnicity['description'] }
    end

    def interpret_races(races, unable_to_determine_code)
      return unless races
      raw_races = races.map { |race| RaceMapping::RACE_MAP_FROM_LEGACY[race['description']] }
      return raw_races unless %w[A I K].include?(unable_to_determine_code)
      return ['Abandoned'] if unable_to_determine_code == 'A'
      ['Unknown']
    end

    private

    def add_placeholder_to_redacted_ssn(ssn)
      redacted_ssn = ssn
      if ssn
        redacted_ssn = ssn.gsub(/.(?=.{#{ALLOWABLE_SSN_CHARS}})/, '_')
        unless redacted_ssn.blank?
          if redacted_ssn.size < ALLOWABLE_SSN_CHARS
            redacted_ssn = "#{'_' * (9 - redacted_ssn.size)}#{redacted_ssn}"
          end
          redacted_ssn = "#{redacted_ssn[0..2]}-#{redacted_ssn[3..4]}-#{redacted_ssn[5..8]}"
        end
      end
      redacted_ssn || ''
    end
  end
end

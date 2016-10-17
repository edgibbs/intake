# frozen_string_literal: true

# Model for storing Intake person information.
class Person
  include Virtus.model

  attribute :date_of_birth
  attribute :first_name
  attribute :gender
  attribute :last_name
  attribute :ssn
end

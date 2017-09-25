# frozen_string_literal: true

require 'rails_helper'
require 'feature/testing'

feature 'api responses' do
  let(:screening) { create :screening, name: 'Little Shop Of Horrors' }
  let(:auth_login_url) { 'http://www.example.com/authn/login?callback=' }

  around do |example|
    with_config(
      base_path: '/',
      authentication_login_url: auth_login_url
    ) do
      example.run
    end
  end

  scenario 'User is redirected to login with full callback path on API 403', accessibility: false do
    stub_empty_relationships_for_screening(screening)
    stub_empty_history_for_screening(screening)
    stub_request(:get, intake_api_url(ExternalRoutes.intake_api_screenings_path)).and_return(
      json_body({ screenings: [] }.to_json, status: 200)
    )

    visit root_path
    redirect_url = CGI.escape("#{page.current_url.chomp('/')}#{screening_path(screening.id)}")
    login_url = "#{auth_login_url}#{redirect_url}"

    stub_request(:get, intake_api_url(ExternalRoutes.intake_api_screening_path(screening.id)))
      .and_return(json_body('I failed', status: 403))
    visit screening_path(id: screening.id, params: { bar: 'foo' })

    # have_current_path waits for the async call to finish, but doesn't verify url params
    # comparing the current_url to login_url compares the full strings
    # though these expectations look identical, we really do need both of them
    expect(page).to have_current_path(login_url, url: true)
    expect(page.current_url).to eq(login_url)
  end

  scenario 'API returns a 500 and errors are shown to user' do
    stub_request(:get, intake_api_url(ExternalRoutes.intake_api_screening_path(screening.id)))
      .and_return(json_body('I failed', status: 500))
    visit screening_path(id: screening.id)
    expect(page).to have_content 'status: 500'
    click_button 'Expand'
    expect(page).to have_content 'body: I failed'
  end

  scenario 'API returns a success' do
    stub_request(:get, intake_api_url(ExternalRoutes.intake_api_screening_path(screening.id)))
      .and_return(json_body(screening.to_json, status: 200))
    visit screening_path(id: screening.id)
    expect(page.current_url).to have_content screening_path(screening.id)
  end
end

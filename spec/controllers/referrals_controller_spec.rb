# frozen_string_literal: true
require 'rails_helper'

describe ReferralsController do
  describe '#create' do
    let(:referral) do
      { id: 1, reference: '123ABC' }.with_indifferent_access
    end

    before do
      allow(ReferralCreator).to receive(:create).and_return(referral)
    end

    it 'assigns referral' do
      post :create
      expect(assigns(:referral)).to eq(referral)
    end

    it 'redirects to show' do
      post :create
      expect(response).to redirect_to(referral_path(id: referral['id']))
    end
  end

  describe '#edit' do
    let(:referral) { double(:referral) }
    before do
      allow(Referral).to receive(:find).with('1').and_return(referral)
    end

    it 'assigns referral' do
      post :edit, params: { id: 1 }
      expect(assigns(:referral)).to eq(referral)
    end

    it 'renders the edit template' do
      post :edit, params: { id: 1 }
      expect(response).to render_template('edit')
    end
  end

  describe '#show' do
    let(:referral) { double(:referral) }
    before do
      allow(Referral).to receive(:find).with('1').and_return(referral)
    end

    it 'assigns referral' do
      get :show, params: { id: 1 }
      expect(assigns(:referral)).to eq(referral)
    end

    it 'renders the show template' do
      get :show, params: { id: 1 }
      expect(response).to render_template('show')
    end
  end
end

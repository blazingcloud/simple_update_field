require "spec_helper"
describe "phrases/_phrase.html.erb" do
  it "displays" do
    a_phrase =Phrase.create!(:text => 'snuggly')
    render "phrases/phrase", :phrase => a_phrase
    rendered.should have_css('.phrase .text', :text => 'snuggly')
  end
end


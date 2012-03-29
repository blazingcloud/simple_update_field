require "spec_helper"
describe "phrases/index.html.erb" do
  it "renders a phrase template for each phrase" do
    my_phrases = [Phrase.create!(:text => 'snuggly'), 
                  Phrase.create!(:text => 'bear')] 
    assign(:phrases, my_phrases) # @phrases = my_phrases in view
    render 
    view.should render_template(:partial => "_phrase", :count => 2)
  end
end

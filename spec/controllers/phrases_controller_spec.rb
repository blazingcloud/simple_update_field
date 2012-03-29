require "spec_helper"
describe PhrasesController do
  context "GET" do
    context "index" do
      it "should be ok" do
        get :index
        response.should be_success
      end
      it "should render template" do
        get :index
        response.should render_template('index')
      end

      it "assigns phrases to @phrases" do
        Phrase.create!(:text => 'Cake')
        Phrase.create!(:text => 'Cake 2')
        get :index
        assigns[:phrases].should == Phrase.limit(2).all # all executes the ActiveRecord::Relation
      end
    end
  end
end

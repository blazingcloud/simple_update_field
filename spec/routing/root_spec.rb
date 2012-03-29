require 'spec_helper'
describe '/' do
  it "routes to phrases index" do
    {:get => "/"}.should(route_to(:controller => 'phrases',
                                  :action     => 'index'))
  end
end

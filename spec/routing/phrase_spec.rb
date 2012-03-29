require 'spec_helper'
describe "/phrases" do
  it "routes to index" do
    { :get => '/phrases'}.should(
      route_to(
        :controller => "phrases",
        :action => "index"
    ))

      
  end
end

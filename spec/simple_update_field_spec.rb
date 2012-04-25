require File.expand_path(File.dirname(__FILE__) + '/spec_helper')

describe "SimpleUpdateField" do
  it "should define an engine" do
    lambda do
   SimpleUpdateField.const_get('Engine')
    end.should_not raise_error NameError
  end
end

require 'spec_helper'

describe Phrase do
  it "can be created with text" do
    p = Phrase.create!(:text => "hello there")
  end
  it "text must not be blank" do
    p = Phrase.new
    p.should_not be_valid
  end
end
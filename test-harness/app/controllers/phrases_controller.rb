class PhrasesController < ApplicationController
  def index
    @phrases = Phrase.limit(5)
  end

  def update
    Phrase.
      find(params[:id]).
      update_attributes(params[:phrase])
    head :ok
  end
end

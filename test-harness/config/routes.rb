EditableList::Application.routes.draw do
  resources :phrases, :only => [:index,:update]
  root :to => "phrases#index"
end

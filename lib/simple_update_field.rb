begin
  Object.const_get('Rails')
rescue
  module Rails
    class Engine
    end
  end
end
module SimpleUpdateField
  class Engine < ::Rails::Engine
    # let rails know to include the javascript
  end
end

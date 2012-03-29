Editable = function(selector) {
  var self = this
  self.selector = selector

  var create_tag_with = function(tag_name,node) {
    var elem = $('<'+tag_name+'/>');
    var attributes = node.get(0).attributes
    for(var i = attributes.length-1; i >=0;i--) {
      elem.attr(attributes[i].nodeName, attributes[i].nodeValue)
    }

    elem.data(node.data())
    elem.data('editable-was',node.get(0).tagName)

    node.replaceWith(function() {
      return elem
    })
    return elem
  }

  var replace_input_from = function(node) {
    var element = create_tag_with('input',node)

    element.data('original-text',node.text())
    element.val(node.text().trim())

    return element

  }

  self.begin_edit_event = function(event) {
      var clicked_node = $(this);
      var new_node = replace_input_from(clicked_node);
      install_edit_complete_notions(new_node)
      new_node.focus();
  }
  var is_rollback_changes  = function() {
    if (self.last_keydown_event) {
      if (self.last_keydown_event.keyCode == Editable.ESC_KEY) {
        return true
      }
    }
    return false
  }
  var is_blur_tab_redirect = function () {
    if (self.last_keydown_event) {
      if (self.last_keydown_event.keyCode == Editable.TAB_KEY) {
        return true
      }
      if (self.last_keydown_event.keyCode == Editable.ENTER_KEY) {
        return true
      }
    }
    return false
  }
  var move_to_next_sibling = function(element) {
    if(element.attr('editable-index')) {
      var next_position = parseInt(element.attr('editable-index')) +1
      var next_editable = $(selector).filter('[editable-index='+next_position+']')
      if (next_editable.size() == 0) {
        next_editable = $(selector).filter('[editable-index=1]')
      }
      next_editable.trigger('click.editable')
    }else {
      throw 'Expected to be able to assign custom attribute editable-index'
    }
  }
  self.rollback_edit_event = function(event) {
    var finished_node = $(this)
    var element = create_tag_with(finished_node.data('editable-was'),finished_node)
    element.text(element.data('original-text'))
    install_edit_notions(element)
  }
  self.commit_to_remote_resource = function(node) {
    uri        = node.attr('editable-resource-uri')
    name       = node.attr('editable-resource-model')
    attribute  = node.attr('editable-resource-attribute')
    id         = node.attr('editable-resource-id')
    data       = {}
    data['id'] = id
    data[name] = {}
    data[name][attribute] = node.val().trim()
    $.ajax({url:uri,data:data,type:'PUT'})
  }
  self.complete_edit_event = function(event) {
    
    var finished_node = $(this)
    commit_to_remote_resource(finished_node)
    var element = create_tag_with(finished_node.data('editable-was'),finished_node)
    element.text(finished_node.val())
    install_edit_notions(element)
    
    // If tab key was hit during the edit phase
    // we want to redirect this blur to be a click on the next
    // sibling
    if(is_blur_tab_redirect()) {
      move_to_next_sibling(element)
    }

    // Cleanup - cross event state
    // there was no last keydown event
    self.last_keydown_event = undefined;
  }
  
  var install_edit_notions = function(selector) {

    $(selector).bind('click.editable',begin_edit_event)
    $(selector).bind('mouseover.editable',function() {
      $(this).addClass('editable-hover')
    })

    $(selector).bind('mouseout.editable',function() {
      $(this).removeClass('editable-hover')
    })
  }

  var install_edit_complete_notions = function (selector) {

    $(selector).bind('keydown.editable',function(e) {
      self.last_keydown_event = e
      if(is_blur_tab_redirect()) {
        $(this).trigger('blur.editable')
        return false; // manually handle tab - no event propigation
      }
      if(is_rollback_changes()) {
       $(this).trigger('rollback.editable')
       return false;
      }
      return true // allow default propigation
    })

    $(selector).bind('blur.editable',self.complete_edit_event)
    $(selector).bind('rollback.editable',self.rollback_edit_event)
  }
  var annotate_editable_with_position = function(selector) {
    $(selector).each(function(i,el) {
      $(el).attr('editable-index',i+1)
    })
  }
  
  var annotate_with_resource_errors = function(selector) {
    $(selector).each(function(i,el){
      if (!($(el).attr('editable-resource-uri')) ||
            $(el).attr('editable-resource-uri') == "") {
        $(el).parent().append('<div class="editable-errors">expected editable-resource-uri attribute in form http://server/resource/id</div>')
       }
      if (!($(el).attr('editable-resource-model')) ||
            $(el).attr('editable-resource-model') == "") {
        $(el).parent().append('<div class="editable-errors">expected editable-resource-model attribute in underscorized-rails form</div>')
       }
      if (!($(el).attr('editable-resource-attribute')) ||
            $(el).attr('editable-resource-attribute') == "") {
        $(el).parent().append('<div class="editable-errors">expected editable-resource-attribute attribute in underscorized-rails form </div>')
       }
    })
  }

  var install = function() {
    install_edit_notions(selector)
    annotate_editable_with_position(selector)
    annotate_with_resource_errors(selector)
    $(selector).data('editable','installed')
  }()
  return self;
}
Editable.TAB_KEY   = 9   // tab is   #9
Editable.ENTER_KEY = 13  // enter is #13
Editable.ESC_KEY   = 27  // enter is #13

var Chat;

Chat = new (Backbone.View.extend({
  el: '#chat',
  template: _.template($('#template-Message').html()),
  max_messages: 100,
  num_messages: 0,
  initialize: function() {
    this.$messages = this.$('#messages');
    this.$messages.perfectScrollbar({
      suppressScrollX: true
    });
    return this.sendMessage('Welcome to Bomberking!');
  },
  events: {
    'keyup .input input': function(e) {
      var $input, text;
      $input = $('.input input');
      text = $input.val();
      if (e.keyCode === 13 && text) {
        this.makeMessage({
          name: Me.name,
          text: text
        });
        Network.send({
          evt: 'msg',
          data: text
        });
        return $input.val('');
      }
    }
  },
  makeMessage: function(data) {
    var $message;
    data.time = sprintf('[%s]', moment().format('h:mm:ss'));
    $message = this.template(data);
    return this.addMessage($message);
  },
  sendMessage: function(string, warning) {
    var $message;
    if (warning == null) {
      warning = false;
    }
    $message = $('<div/>', {
      "class": 'message ' + (warning ? 'warning' : 'system'),
      text: string
    });
    return this.addMessage($message);
  },
  addMessage: function($message) {
    this.$messages.append($message);
    this.num_messages++;
    if (this.num_messages > this.max_messages) {
      this.$messages.children('.messages')[0].remove();
    }
    return this.$messages.scrollTop(this.$messages[0].scrollHeight);
  }
}));

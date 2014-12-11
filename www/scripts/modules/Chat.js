(function() {
  define(['jquery', 'backbone', 'sprintf', 'modules/Me', 'modules/Network', 'text!../../templates/message.html', 'perfect-scrollbar'], function($, Backbone, sprintf, Me, Network, template) {
    return new (Backbone.View.extend({
      el: '#chat',
      template: _.template(template),
      max_messages: 100,
      num_messages: 0,
      initialize: function() {
        this.$input = this.$('.input input');
        this.$messages = this.$('#messages');
        this.$messages.perfectScrollbar({
          suppressScrollX: true
        });
        return this.sendSysMessage('Welcome to Bomberking!');
      },
      events: {
        'keyup .input input': function(e) {
          var text;
          text = this.$input.val();
          if (e.keyCode === 13 && text) {
            this.makeMessage({
              name: Me.name,
              text: text
            });
            Network.send({
              evt: 'msg',
              data: text
            });
            return this.$input.val('');
          }
        }
      },
      makeMessage: function(data) {
        var $message;
        data.time = sprintf('[%s]', moment().format('h:mm:ss'));
        $message = this.template(data);
        return this.addMessage($message);
      },
      sendSysMessage: function(string) {
        var $message;
        $message = $('<div/>', {
          "class": 'message system',
          text: string
        });
        return this.addMessage($message);
      },
      sendSysWarning: function(string) {
        var $message;
        $message = $('<div/>', {
          "class": 'message warning',
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
  });

}).call(this);

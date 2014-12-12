(function() {
  define(function(require, exports) {
    var $, Backbone, Me, Network, moment, sprintf, template;
    $ = require('jquery');
    require('perfect-scrollbar');
    Backbone = require('backbone');
    sprintf = require('sprintf');
    moment = require('moment');
    Me = require('modules/Me');
    Network = require('modules/Network');
    template = require('text!../../templates/message.html');
    return exports = new (Backbone.View.extend({
      el: '#chat',
      template: _.template(template),
      max_messages: 100,
      num_messages: 0,
      initialize: function() {
        this.$messages = this.$('#messages');
        return this.$messages.perfectScrollbar({
          suppressScrollX: true
        });
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
        data.time = sprintf.sprintf('[%s]', moment().format('h:mm:ss'));
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
  });

}).call(this);

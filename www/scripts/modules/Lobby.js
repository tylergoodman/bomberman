(function() {
  define(['jquery', 'backbone', 'modules/Logger', 'modules/Chat', 'modules/Network', 'modules/Me', 'text!../../templates/person.html', 'perfect-scrollbar'], function($, Backbone, Logger, Chat, Network, template) {
    var Lobby, Person, PersonView;
    Person = Backbone.Model.extend({
      defaults: {
        name: null,
        id: null,
        editable: false
      },
      sync: $.noop
    });
    PersonView = Backbone.View.extend({
      template: _.template(template),
      initialize: function() {
        this.listenTo(this.model, 'change', this.update);
        this.listenTo(this.model, 'destroy', this.remove);
        this.render();
        this.$header = this.$('.person-name');
        this.$name = this.$('.name');
        return this.$id = this.$('.id');
      },
      events: {
        'keyup .name': function(e) {
          var name;
          if (e.keyCode === 13) {
            name = this.$name.val();
            this.$model.set('name', name);
            Logger.log('Changed name to %s.', name);
            return Network.send({
              evt: 'nc',
              data: name
            });
          }
        },
        'mouseover .id': function(e) {
          return this.$id.select();
        },
        'destroy': function() {
          return this.remove();
        }
      },
      render: function() {
        this.$el = $(this.template(this.model.attributes));
        this.el = this.$el.get(0);
        return this;
      },
      update: function() {
        this.header.text(this.model.get('name' || this.model.get('id')));
        this.name.val(this.model.get('name'));
        return this.id.val(this.model.get('id'));
      }
    });
    return Lobby = new (Backbone.View.extend({
      el: '#lobby',
      initialize: function() {
        this.$toggle = this.$('#lobby-toggle');
        this.$join = this.$('#lobby-join');
        this.$persons = this.$('#persons');
        this.$persons.perfectScrollbar({
          suppressScrollX: true
        });
        return Chat.sendSysMessage('Your lobby is closed.');
      },
      events: {
        'click #lobby-toggle': function() {
          if (Network.isOpen()) {
            this.$toggle.find('i').removeClass('fa-toggle-on').addClass('fa-toggle-off');
            this.$toggle.find('span').text('Open Lobby');
            this.$join.prop('disabled', false);
            Network.setClosed();
            return Chat.sendSysMessage('Your lobby is now closed.');
          } else {
            this.$toggle.find('i').removeClass('fa-toggle-off').addClass('fa-toggle-on');
            this.$toggle.find('span').text('Close Lobby');
            this.$join.prop('disabled', true);
            Network.setOpen();
            return Chat.sendSysMessage('Your lobby is now open');
          }
        },
        'click #lobby-join': function() {
          var $modal;
          $modal = $('#modal-join');
          $modal.addClass('active');
          $('<div/>', {
            id: 'modal-overlay',
            css: {
              display: 'block',
              position: 'fixed',
              width: '100%',
              height: '100%',
              top: 0,
              background: 'black',
              opacity: '0.5'
            },
            click: function() {
              $modal.removeClass('active');
              return $(this).remove();
            }
          }).appendTo('body');
          return $modal.find('input').focus();
        },
        'click #modal-join button': function() {
          var id;
          id = this.$('#modal-join input').val();
          if (id) {
            $('#modal-overlay').trigger('click');
            return Network.connectTo(id);
          }
        },
        'keyup #modal-join input': function(e) {
          if (e.keyCode === 13) {
            return this.$('#modal-join button').trigger('click');
          }
        },
        'click #lobby-disconnect': function() {
          return Network.client.disconnect();
        },
        'click #game-start': function(e) {
          var peers;
          this.$(e.currentTarget).prop('disabled', true);
          peers = Object.keys(Network.getPeers());
          peers.push(Me.peer.id);
          peers = peers.randomize();
          Me.index = peers.indexOf(Me.peer.id);
          console.log('game start');
          return Network.send({
            evt: 'gs',
            data: peers
          });
        }
      },
      addPerson: function(person) {
        var view;
        view = new PersonView({
          model: player
        });
        return this.$persons.append(view.el);
      },
      setConnected: function() {
        this.$('#lobby-disconnect').prop('hidden', false);
        this.$('#lobby-join').prop('hidden', true);
        return this.$('#game-start').prop('disabled', true);
      },
      setDisconnected: function() {
        this.$('#lobby-disconnect').prop('hidden', true);
        this.$('#lobby-join').prop('hidden', false);
        return this.$('#game-start').prop('disabled', false);
      }
    }));
  });

}).call(this);

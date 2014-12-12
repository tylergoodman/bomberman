(function() {
  define(function(require, exports) {
    var $, Backbone, Chat, Logger, Me, Network, Person, PersonView, template;
    $ = require('jquery');
    require('perfect-scrollbar');
    Backbone = require('backbone');
    Logger = require('modules/Logger');
    Chat = require('modules/Chat');
    Network = require('modules/Network');
    Me = require('modules/Me');
    template = require('text!../../templates/person.html');
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
        return this.render();
      },
      events: {
        'keyup .name': function(e) {
          var name;
          name = this.$('.name').val();
          if (e.keyCode === 13 && name !== '') {
            this.model.set('name', name);
            Logger.log('Changed name to %s.', name);
            return Network.send({
              evt: 'nc',
              data: name
            });
          }
        },
        'mouseover .id': function(e) {
          return this.$('.id').select();
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
        this.$('.person-name').text(this.model.get('name'));
        this.$('.name').val(this.model.get('name'));
        return this.$('.id').val(this.model.get('id'));
      }
    });
    return exports = new (Backbone.View.extend({
      el: '#lobby',
      initialize: function() {
        this.$persons = this.$('#persons');
        this.$persons.perfectScrollbar({
          suppressScrollX: true
        });
        return this.persons = {};
      },
      events: {
        'click #lobby-toggle': function() {
          var toggle;
          toggle = this.$('#lobby-toggle');
          if (Network.isOpen()) {
            toggle.find('i').removeClass('fa-toggle-on').addClass('fa-toggle-off');
            toggle.find('span').text('Open Lobby');
            this.$('#lobby-join').prop('disabled', false);
            Network.setClosed();
            return Chat.sendSysMessage('Your lobby is now closed.');
          } else {
            toggle.find('i').removeClass('fa-toggle-off').addClass('fa-toggle-on');
            toggle.find('span').text('Close Lobby');
            this.$('#lobby-join').prop('disabled', true);
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
      addPerson: function(props) {
        var person, view;
        if (!props.name || props.name === Me.default_name) {
          props.name = props.id;
        }
        person = new Person(props);
        view = new PersonView({
          model: person
        });
        this.persons[props.id] = person;
        this.$persons.append(view.el);
        return this;
      },
      removePerson: function(id) {
        this.persons[id].destroy();
        delete this.persons[id];
        return this;
      },
      empty: function() {
        var id;
        for (id in this.persons) {
          this.removePerson(id);
        }
        return this;
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

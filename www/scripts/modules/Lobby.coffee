define [
	'jquery'
	'backbone'
	'modules/Logger'
	'modules/Chat'
	'modules/Network'
	'modules/Me'
	'text!../../templates/person.html'
	'perfect-scrollbar'
], ($, Backbone, Logger, Chat, Network, template) ->
	Person = Backbone.Model.extend
		defaults:
			name: null
			id: null
			editable: false
		sync: $.noop

	PersonView = Backbone.View.extend
		template: _.template template

		initialize: ->
			@listenTo @model, 'change', @update
			@listenTo @model, 'destroy', @remove

			@render()

			@$header = @$ '.person-name'
			@$name = @$ '.name'
			@$id = @$ '.id'

		events:
			'keyup .name': (e) ->
				if e.keyCode is 13
					name = @$name.val()
					@$model.set 'name', name
					Logger.log 'Changed name to %s.', name
					Network.send
						evt: 'nc'
						data: name
			'mouseover .id': (e) ->
				@$id.select()
			'destroy': ->
				@remove();

		render: ->
			@$el = $ @template @model.attributes
			@el = @$el.get 0
			this

		update: ->
			@header.text @model.get 'name' || @model.get 'id'
			@name.val @model.get 'name'
			@id.val @model.get 'id'

	Lobby = new (Backbone.View.extend
		el: '#lobby'

		initialize: ->
			@$toggle = @$ '#lobby-toggle'
			@$join = @$ '#lobby-join'
			@$persons = @$ '#persons'

			@$persons.perfectScrollbar
				suppressScrollX: true

			Chat.sendSysMessage 'Your lobby is closed.'

		events:
			'click #lobby-toggle': ->
				if Network.isOpen()
					@$toggle
						.find 'i'
						.removeClass 'fa-toggle-on'
						.addClass 'fa-toggle-off'
					@$toggle
						.find 'span'
						.text 'Open Lobby'
					@$join.prop 'disabled', false

					Network.setClosed();
					Chat.sendSysMessage 'Your lobby is now closed.'
				else
					@$toggle
						.find 'i'
						.removeClass 'fa-toggle-off'
						.addClass 'fa-toggle-on'
					@$toggle
						.find 'span'
						.text 'Close Lobby'
					@$join.prop 'disabled', true

					Network.setOpen()
					Chat.sendSysMessage 'Your lobby is now open'
			'click #lobby-join': ->
				$modal = $ '#modal-join'
				$modal.addClass 'active'
				$ '<div/>',
					id: 'modal-overlay'
					css:
						display: 'block'
						position: 'fixed'
						width: '100%'
						height: '100%'
						top: 0;
						background: 'black'
						opacity: '0.5'
					click: ->
						$modal.removeClass 'active'
						$(@).remove()
				.appendTo 'body'
				$modal
					.find 'input'
					.focus()
			'click #modal-join button': ->
				id = @$('#modal-join input').val()
				if id
					$('#modal-overlay').trigger 'click'
					Network.connectTo id
			'keyup #modal-join input': (e) ->
				if e.keyCode is 13
					@$('#modal-join button').trigger 'click'
			'click #lobby-disconnect': ->
				Network.client.disconnect()
			'click #game-start': (e) ->
				@$(e.currentTarget).prop 'disabled', true
				peers = Object.keys Network.getPeers()
				peers.push(Me.peer.id)
				peers = peers.randomize()

				Me.index = peers.indexOf Me.peer.id
				#game start...
				console.log 'game start'

				Network.send
					evt: 'gs'
					data: peers

		addPerson: (person) ->
			view = new PersonView
				model: player
			@$persons.append view.el

		setConnected: ->
			@$('#lobby-disconnect').prop 'hidden', false
			@$('#lobby-join').prop 'hidden', true
			@$('#game-start').prop 'disabled', true
		setDisconnected: ->
			@$('#lobby-disconnect').prop 'hidden', true
			@$('#lobby-join').prop 'hidden', false
			@$('#game-start').prop 'disabled', false


	)

Person = Backbone.Model.extend
	defaults:
		name: null
		id: null
		editable: false
	sync: $.noop

PersonView = Backbone.View.extend
	template: _.template $('#template-Person').html()

	initialize: ->
		@listenTo @model, 'change', @update
		@listenTo @model, 'destroy', @remove
		@render()


	events:
		'keyup .name': (e) ->
			name = @$('.name').val()
			if e.keyCode is 13 and name isnt ''
				@model.set 'name', name
				Logger.log 'Changed name to %s.', name
				Network.send
					evt: 'nc'
					data: name
		'mouseover .id': (e) ->
			@$('.id').select()
		'destroy': () ->
			@remove();

	render: () ->
		@$el = $ @template @model.attributes
		@el = @$el.get 0
		# console.log @$el, @$el.children ':last'
		if @model.get('editable') is false
			@$el.children(':last').prop 'hidden', true
		this

	update: () ->
		@$('.person-name').text @model.get 'name'
		@$('.name').val @model.get 'name'
		@$('.id').val @model.get 'id'

Lobby = new (Backbone.View.extend
	el: '#lobby'

	initialize: () ->
		@$persons = @$ '#persons'
		@$persons.perfectScrollbar
			suppressScrollX: true

		@persons = {}

		# Chat.sendSysMessage 'Your lobby is closed.'

	events:
		'click #lobby-toggle': () ->
			toggle = @$ '#lobby-toggle'
			if Network.isOpen()
				toggle
					.find 'i'
					.removeClass 'fa-toggle-on'
					.addClass 'fa-toggle-off'
				toggle
					.find 'span'
					.text 'Open Lobby'
				@$('#lobby-join').prop 'disabled', false

				Network.setClosed();
				Chat.sendMessage 'Your lobby is now closed.'
			else
				toggle
					.find 'i'
					.removeClass 'fa-toggle-off'
					.addClass 'fa-toggle-on'
				toggle
					.find 'span'
					.text 'Close Lobby'
				@$('#lobby-join').prop 'disabled', true

				Network.setOpen()
				Chat.sendMessage 'Your lobby is now open'
		'click #lobby-join': () ->
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
		'click #modal-join button': () ->
			id = @$('#modal-join input').val()
			if id
				$('#modal-overlay').trigger 'click'
				Network.connectTo id
		'keyup #modal-join input': (e) ->
			if e.keyCode is 13
				@$('#modal-join button').trigger 'click'
		'click #lobby-disconnect': () ->
			Network.client.disconnect()
		'click #game-start': (e) ->
			@$(e.currentTarget).prop 'disabled', true

			#game start...
			positions = Bomberman.setPlayerPositions()
			console.log positions

			Network.send
				evt: 'gs'
				data: positions
			Bomberman.start()


	addPerson: (props) ->
		if !props.name or props.name is Me.default_name and not props.editable
			props.name = props.id

		person = new Person props
		view = new PersonView model: person

		@persons[props.id] = person
		@$persons.append view.el
		this


	removePerson: (id) ->
		@persons[id].destroy();
		delete @persons[id]
		this


	empty: () ->
		for id of @persons
			@removePerson id
		this


	setConnected: () ->
		@$('#lobby-disconnect').prop 'hidden', false
		@$('#lobby-join').prop 'hidden', true
		@$('#game-start').prop 'disabled', true
	setDisconnected: () ->
		@$('#lobby-disconnect').prop 'hidden', true
		@$('#lobby-join').prop 'hidden', false
		@$('#game-start').prop 'disabled', false


)

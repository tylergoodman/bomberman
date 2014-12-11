define [
	'jquery'
	'backbone'
	'sprintf'
	'modules/Me'
	'modules/Network'
	'text!../../templates/message.html'
	'perfect-scrollbar'
], ($, Backbone, sprintf, Me, Network, template) ->
	# console.log template
	new (Backbone.View.extend
		el: '#chat'
		template: _.template template

		max_messages: 100
		num_messages: 0

		initialize: ->
			@$input = @$ '.input input'
			@$messages = @$ '#messages'
			@$messages.perfectScrollbar
				suppressScrollX: true

			@sendSysMessage 'Welcome to Bomberking!'

		events:
			'keyup .input input': (e) ->
				text = @$input.val()
				if e.keyCode is 13 and text
					@makeMessage
						name: Me.name
						text: text
					Network.send
						evt: 'msg'
						data: text
					@$input.val ''

		makeMessage: (data) ->
			data.time = sprintf '[%s]', moment().format 'h:mm:ss'
			$message = @template data
			@addMessage $message

		sendSysMessage: (string) ->
			$message = $ '<div/>', 
				class: 'message system'
				text: string
			@addMessage $message

		sendSysWarning: (string) ->
			$message = $ '<div/>', 
				class: 'message warning'
				text: string
			@addMessage $message

		addMessage: ($message) ->
			@$messages.append $message
			@num_messages++
			if @num_messages > @max_messages
				@$messages.children('.messages')[0].remove()
			@$messages.scrollTop @$messages[0].scrollHeight

	)
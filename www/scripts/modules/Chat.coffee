define (require, exports) ->
	# console.log 'chat'

	$ = require 'jquery'
	require 'perfect-scrollbar'
	Backbone = require 'backbone'
	sprintf =  require 'sprintf'
	moment = require 'moment'
	Me = require 'modules/Me'
	Network = require 'modules/Network'
	template = require 'text!../../templates/message.html'

	# console.log '\tMe:', Me
	# console.log '\tNetwork:', Network

	exports = new (Backbone.View.extend
		el: '#chat'
		template: _.template template

		max_messages: 100
		num_messages: 0

		initialize: ->
			@$messages = @$ '#messages'
			@$messages.perfectScrollbar
				suppressScrollX: true


		events:
			'keyup .input input': (e) ->
				$input = $ '.input input'
				text = $input.val()
				if e.keyCode is 13 and text
					@makeMessage
						name: Me.name
						text: text
					Network.send
						evt: 'msg'
						data: text
					$input.val ''

		makeMessage: (data) ->
			data.time = sprintf.sprintf '[%s]', moment().format 'h:mm:ss'
			$message = @template data
			@addMessage $message

		# called by Logger
		sendMessage: (string, warning = false) ->
			$message = $ '<div/>', 
				class: 'message ' + (if warning then 'warning' else 'system')
				text: string
			@addMessage $message

		addMessage: ($message) ->
			@$messages.append $message
			@num_messages++
			if @num_messages > @max_messages
				@$messages.children('.messages')[0].remove()
			@$messages.scrollTop @$messages[0].scrollHeight

	)
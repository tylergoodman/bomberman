Chat = new (Backbone.View.extend
	el: '#chat'
	template: _.template $('#template-Message').html()

	max_messages: 100
	num_messages: 0

	initialize: ->
		@$messages = @$ '#messages'
		@$messages.perfectScrollbar
			suppressScrollX: true
		@sendMessage 'Welcome to Bomberking!'


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
		data.time = sprintf '[%s]', moment().format 'h:mm:ss'
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
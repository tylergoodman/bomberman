class Game
	constructor: () ->
		$el = $ '#game'
		# height = window_height = $el.height()
		# width = window_width = $el.width()
		# desired_aspect_ratio = 5 / 3;

		# if width / height > desired_aspect_ratio
		# 	# limiting resource is height
		# 	width = desired_aspect_ratio * height
		# else
		# 	# limiting resource is width
		# 	height = width / desired_aspect_ratio

		titlescreen = 
			preload: () ->
				@game.load.image 'background', 'images/titlescreenfinal.png'
				@game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
				@game.scale.setScreenSize()


			create: () ->
				background = phaser.add.tileSprite 0, 0, @game.width, @game.height, 'background'
				game = @game

				rescale = (() ->
					left = ($el.width() - game.scale.width) / 2
					top = ($el.height() - game.scale.height) / 2
					# console.log 'rescaling', left, top

					$(game.canvas).css
						'left': left
						'top': top
						'position': 'relative'
				).debounce 100
				rescale()

				$(window).on 'resize', rescale

		@phaser = phaser = new Phaser.Game 1375, 825, Phaser.AUTO, $el[0], titlescreen


Bomberman = new Game
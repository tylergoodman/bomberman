var GameState = function(game) {
	player = null
	layerManager = null
	playerManager = null
	explosionManager = null
	perkManager = null
	preferences = null
	// Array to keep track of players
	Players = []
} 

GameState.prototype = {

  preload: function() 	{ 
							this.game.load.atlasJSONHash('bombermanAnimation', './static/img/Animations/Bomberman/bombermanAnimation.png', './static/img/Animations/Bomberman/bombermanAnimation.json');
							this.game.load.atlasJSONHash('explosionAnimation', './static/img/Animations/Explosion/explosionAnimation.png', './static/img/Animations/Explosion/explosionAnimation.json');
						    this.game.load.image('bomberman', './static/img/bomberman.png')
						    this.game.load.image('background', './static/img/background.png')
						    this.game.load.image('unbreakableWall', './static/img/unbreakableWall.jpg')
						    this.game.load.image('breakableWall', './static/img/breakableWall.png')
						    this.game.load.image('bomb', './static/img/bomb.png')
						    this.game.load.image('explosion', './static/img/explosion.png')
						   	this.game.load.image('normalBombPerk', './static/img/normalBombPerk.png')
						    this.game.load.image('horizontalBombPerk', './static/img/horizontalBombPerk.png')
						    this.game.load.image('verticalBombPerk', './static/img/verticalBombPerk.png')
					  	},
  create:  function()	{	
  							// Preferences
							preferences = new Preferences(this.game, Players)

							// background
							var background = this.game.add.group();
					   		background.z = 1;
					   		var bgSprite = this.game.add.sprite(0,0,'background')
					   		bgSprite.scale.setTo(preferences.BgWidthRatio, preferences.BgHeightRatio)

					   		background.add(bgSprite)

					   		// Managers
					   		layerManager = new LayerManager(preferences)

					   		// Set up the layers for the world
					   		layerManager.SetUpWorld()

					   		// have to setup Perk Manager before Explosion Manager
					   		perkManager = new PerkManager(preferences, layerManager)

					   		// Set up the world before adding it to explosion manager
					   		explosionManager = new ExplosionManager(preferences, layerManager, perkManager)

					   		// Set up player manager to manage all the players
					   		playerManager = new PlayerManager(preferences, layerManager)

							// Player
							player = playerManager.newPlayer()

							// Resize window if window size changes
							$(window).resize(function() {
								// Update scale values
								preferences.updateScaleValues()
								// Update all layers
							  	layerManager.ScaleLayers()
							})
				   		},
  update:  function() 	{
							var curX = player.getPosX()
							var curY = player.getPosY()

							var moveValue = preferences.MoveValue

							if (this.game.input.keyboard.isDown(Phaser.Keyboard.A))
							{
								player.setPosX(player.getPosX() - moveValue, false)
							}
							else if (this.game.input.keyboard.isDown(Phaser.Keyboard.D))
							{
								player.setPosX(player.getPosX() + moveValue, false)
							}
							else if (this.game.input.keyboard.isDown(Phaser.Keyboard.W))
							{
								player.setPosY(player.getPosY() - moveValue, false)
							}
							else if (this.game.input.keyboard.isDown(Phaser.Keyboard.S))
							{
								player.setPosY(player.getPosY() + moveValue, false)
							}
							else
							{
								player.animate("stop")
							}

							// return player to previous position if collides with wall
							if(layerManager.ReturnLayer("Wall").collisionWith(player) && !player.GhostMode)
							{
								player.setPosX(curX, true)
								player.setPosY(curY, true)
							}

							// Player dies if  he/she collides with explosion
							if(layerManager.ReturnLayer("Explosion").collisionWith(player) && !player.GhostMode)
							{
								explosionManager.PlayerDied(player)
							}

							// check if spacebar was pressed / second param is for debouncing
							if(this.game.input.keyboard.justPressed(Phaser.Keyboard.F, 10) && Players[0] != null)
							{
								if(player.getBombCount("Normal") > 0)
								{
									explosionManager.DropBomb(player, "Normal")
								}
							}

							if(this.game.input.keyboard.justPressed(Phaser.Keyboard.C, 10) && Players[0] != null)
							{
								if(player.getBombCount("Vertical") > 0)
								{
									explosionManager.DropBomb(player, "Vertical")
								}
							}

							if(this.game.input.keyboard.justPressed(Phaser.Keyboard.V, 10) && Players[0] != null)
							{
								if(player.getBombCount("Horizontal") > 0)
								{
									explosionManager.DropBomb(player, "Horizontal")
								}
							}

							if(this.game.input.keyboard.justPressed(Phaser.Keyboard.M, 10) && Players[0] != null)
							{
								explosionManager.DropBomb(player, "Super")
							}

							// update player
							player.update()
							layerManager.ReturnLayer("Player").newBoard(Players)

							// update perks
							perkManager.Update()
					  	}
}
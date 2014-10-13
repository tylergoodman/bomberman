var GameState = function(game) {
	player = null
	layerManager = null
	explosionManager = null
	perkManager = null

	// Array to keep track of players
	Players = []
} 

GameState.prototype = {

  preload: function() 	{ 
							this.game.load.atlasJSONHash('bot', 'assets/running_bot.png', 'src/running_bot.json');
						    this.game.load.image('bomberman', 'assets/bomberman.jpg')
						    this.game.load.image('background', 'assets/background.png')
						    this.game.load.image('unbreakableWall', 'assets/unbreakableWall.jpg')
						    this.game.load.image('breakableWall', 'assets/breakableWall.png')
						    this.game.load.image('bomb', 'assets/bomb.png')
						    this.game.load.image('explosion', 'assets/explosion.png')
						   	this.game.load.image('normalBombPerk', 'assets/normalBombPerk.png')
						    this.game.load.image('horizontalBombPerk', 'assets/horizontalBombPerk.png')
						    this.game.load.image('verticalBombPerk', 'assets/verticalBombPerk.png')
					  	},
  create:  function()	{	
							// background
							var background = this.game.add.group();
					   		background.z = 1;
					   		background.add(this.game.add.sprite(0,0,'background'))

							// Preferences
							var preferences = new Preferences(this.game, Players)

					   		// Managers
					   		layerManager = new LayerManager(preferences)

					   		// Set up the layers for the world
					   		layerManager.SetUpWorld()

					   		// have to setup Perk Manager before Explosion Manager
					   		 perkManager = new PerkManager(preferences, layerManager, Players)

					   		// Set up the world before adding it to explosion manager
					   		explosionManager = new ExplosionManager(preferences, layerManager, perkManager)

							// Player
							player = new Player(this.game, "Player 1", 0, 0, 0, 0)

							// Add player to world
							Players.push(player)
							layerManager.ReturnLayer("Player").Add(player)
				   		},
  update:  function() 	{
							var curX = player.getPosX()
							var curY = player.getPosY()

							var moveValue = 5

							if (this.game.input.keyboard.isDown(Phaser.Keyboard.A))
							{
								player.setPosX(player.getPosX() - moveValue)
							}
							else if (this.game.input.keyboard.isDown(Phaser.Keyboard.D))
							{
								player.setPosX(player.getPosX() + moveValue)
							}
							else if (this.game.input.keyboard.isDown(Phaser.Keyboard.W))
							{
								player.setPosY(player.getPosY() - moveValue)
							}
							else if (this.game.input.keyboard.isDown(Phaser.Keyboard.S))
							{
								player.setPosY(player.getPosY() + moveValue)
							}
							else
							{
								player.animate("stop")
							}

							// return player to previous position if collides with wall
							if(layerManager.ReturnLayer("Wall").collisionWith(player) && !player.GhostMode)
							{
								player.setPosX(curX)
								player.setPosY(curY)
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

							// update player
							player.update()
							layerManager.ReturnLayer("Player").newBoard(Players)

							// update perks
							perkManager.Update()
					  	}
}
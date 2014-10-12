
function Game () 
{
	var world = new Phaser.Game(1050, 630, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update })
	var player = null
	var layerManager = null
	var explosionManager = null
	var perkManager = null

	// Array to keep track of players
	var Players = []

	// Preload images needed
	function preload() {
		world.load.atlasJSONHash('bot', 'assets/running_bot.png', 'src/running_bot.json');
	    world.load.image('bomberman', 'assets/bomberman.jpg')
	    world.load.image('background', 'assets/background.png')
	    world.load.image('unbreakableWall', 'assets/unbreakableWall.jpg')
	    world.load.image('breakableWall', 'assets/breakableWall.png')
	    world.load.image('bomb', 'assets/bomb.png')
	    world.load.image('explosion', 'assets/explosion.png')
	   	world.load.image('normalBombPerk', 'assets/normalBombPerk.png')
	    world.load.image('horizontalBombPerk', 'assets/horizontalBombPerk.png')
	    world.load.image('verticalBombPerk', 'assets/verticalBombPerk.png')

	}

	function create() {
		// background
		var background = world.add.group();
   		background.z = 1;
   		background.add(world.add.sprite(0,0,'background'))

		// Preferences
		var preferences = new Preferences(world, Players)

   		// Managers
   		layerManager = new LayerManager(preferences)

   		// Set up the layers for the world
   		layerManager.SetUpWorld()

   		// have to setup Perk Manager before Explosion Manager
   		 perkManager = new PerkManager(preferences, layerManager, Players)

   		// Set up the world before adding it to explosion manager
   		explosionManager = new ExplosionManager(preferences, layerManager, perkManager)

		// Player
		player = new Player(world, "Player 1", 0, 0, 0, 0)

		// Add player to world
		Players.push(player)
		layerManager.ReturnLayer("Player").Add(player)
	}

	function update() {

		var curX = player.getPosX()
		var curY = player.getPosY()

		var moveValue = 5

		if (world.input.keyboard.isDown(Phaser.Keyboard.A))
		{
			player.setPosX(player.getPosX() - moveValue)
		}
		else if (world.input.keyboard.isDown(Phaser.Keyboard.D))
		{
			player.setPosX(player.getPosX() + moveValue)
		}
		else if (world.input.keyboard.isDown(Phaser.Keyboard.W))
		{
			player.setPosY(player.getPosY() - moveValue)
		}
		else if (world.input.keyboard.isDown(Phaser.Keyboard.S))
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
		if(world.input.keyboard.justPressed(Phaser.Keyboard.F, 10) && Players[0] != null)
		{
			if(player.getBombCount("Normal") > 0)
			{
				explosionManager.DropBomb(player, "Normal")
			}
		}

		if(world.input.keyboard.justPressed(Phaser.Keyboard.C, 10) && Players[0] != null)
		{
			if(player.getBombCount("Vertical") > 0)
			{
				explosionManager.DropBomb(player, "Vertical")
			}
		}

		if(world.input.keyboard.justPressed(Phaser.Keyboard.V, 10) && Players[0] != null)
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

	/******************************************************************************
								Private  Methods
	******************************************************************************/

}


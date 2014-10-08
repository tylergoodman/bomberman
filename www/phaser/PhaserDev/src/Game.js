
function Game () 
{
	var world = new Phaser.Game(1050, 630, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update })
	var player = null
	var layerManager = null
	var explosionManager = null

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

   		// Set up the world before adding it to explosion manager
   		explosionManager = new ExplosionManager(preferences, layerManager)

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
			player.animate("left")
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
			if(player.getBombCount() > 0)
			{
				explosionManager.DropBomb(player)
			}
		}

		// update player
		player.update()
		layerManager.ReturnLayer("Player").newBoard(Players)
	}

	/******************************************************************************
								Private  Methods
	******************************************************************************/

}


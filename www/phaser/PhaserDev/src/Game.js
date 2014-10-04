
function Game () 
{
	var world = new Phaser.Game(1050, 630, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update })
	var player = null
	var playerLayer = null
	var wallLayer = null
	var layerManager = null
	var explosionManager = null

	// Array to keep track of players
	var Players = [];

	// Preferences
	var preferences = new Preferences(Players)

	// Preload images needed
	function preload() {

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

   		// Managers
   		layerManager = new LayerManager()
   		explosionManager = new ExplosionManager(world, preferences)

   		// Player Layer
   		playerLayer = layerManager.AddLayer(new Layer(world, "Player", 15, 9, Player, 4))

   		// Wall Layer
   		wallLayer = layerManager.AddLayer(new Layer(world, "Wall", 15, 9, Wall, 3))

   		// Bomb Layer
   		bombLayer = layerManager.AddLayer(new Layer(world, "Bomb", 15, 9, Bomb, 2))

   		// Explosion Layer
   		explosionLayer = layerManager.AddLayer(new Layer(world, "Explosion", 15, 9, Explosion, 1))

		// Player
		player = new Player(world, "Player 1", 0, 0, 0, 0)

		// Add player to world
		Players.push(player)
		playerLayer.Add(player)

		// Add unbreakable walls
		AddUnbreakableWalls()

		// Add breakable walls
		AddBreakableWalls()
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

		// return player to previous position if collides with wall
		if(wallLayer.collisionWith(player) && !player.GhostMode)
		{
			player.setPosX(curX)
			player.setPosY(curY)
		}

		// Player dies if  he/she collides with explosion
		if(explosionLayer.collisionWith(player) && !player.GhostMode)
		{
			explosionManager.PlayerDied(player, layerManager)
		}

		// check if spacebar was pressed / second param is for debouncing
		if(world.input.keyboard.justPressed(Phaser.Keyboard.F, 10) && Players[0] != null)
		{
			if(player.getBombCount() > 0)
			{
				explosionManager.DropBomb(player, layerManager)
			}
		}

		// update player
		player.update()
		playerLayer.newBoard(Players)
	}

	/******************************************************************************
								Private  Methods
	******************************************************************************/

	// Adds unbreakable walls to the right location
	function AddUnbreakableWalls()
	{
		for(var i = 1; i < preferences.BoardColSize; i += 2)
		{
			for(var j = 1; j < preferences.BoardRowSize; j+=2)
			{
				// Create the wall
				var unbreakWall = new Wall(world, false, i, j, 
					i*preferences.ImageSize, j*preferences.ImageSize)

				// Add the wall to board
				wallLayer.Add(unbreakWall, i, j)

			}
		}
	}

	// Adds breakable walls to the right location
	function AddBreakableWalls()
	{
		for(var i = 0; i < preferences.BoardColSize; i++)
		{
			// fill in rows 1-8
			for(var j = 1; j < preferences.BoardRowSize; j++)
			{
				// if col is odd than skip every other row to ignore unbreakable walls
				if(i % 2 == 1)
				{
					// extra increment to skip 1 block
					// on every other row
					j++
				}

				// Create the wall
				var breakWall = new Wall(world, true, i, j, 
					i*preferences.ImageSize, j*preferences.ImageSize)

				// Add the wall to board
				wallLayer.Add(breakWall, i, j)
			}

			// fills in first row with space
			if(i < preferences.BoardColSize && i > 2)
			{
				var breakWall = new Wall(world, true, i, 0, 
					i*preferences.ImageSize, 0)

				wallLayer.Add(breakWall, i, 0)
			}
		}
	}
}


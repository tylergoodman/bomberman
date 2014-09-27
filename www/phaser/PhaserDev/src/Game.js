
function Game () 
{
	var world = new Phaser.Game(1050, 630, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update })
	var boardColSize = 15
	var boardRowSize = 9
	var imageSize = 70
	var player = null
	var wallLayer = null
	var bombLayer = null

	// Preload images needed
	function preload() {

	    world.load.image('bomberman', 'assets/bomberman.jpg')
	    world.load.image('background', 'assets/background.png')
	    world.load.image('unbreakableWall', 'assets/unbreakableWall.jpg')
	    world.load.image('breakableWall', 'assets/breakableWall.png')
	    world.load.image('bomb', 'assets/bomb.png')

	}

	function create() {
		// background
		var background = world.add.group();
   		background.z = 1;
   		background.add(world.add.sprite(0,0,'background'))

   		// Wall Layer
   		wallLayer = new Layer(world, "Wall", 15, 9, Wall, 3)

   		// Bomb Layer
   		bombLayer = new Layer(world, "Bomb", 15, 9, Bomb, 2)

		// Player
		player = new Player(world, "Player 1", 0, 0, 0, 0)


		// Add unbreakable walls
		AddUnbreakableWalls()

		// Add breakable walls
		//AddBreakableWalls()
	}

	function update() {

		var curX = player.getPosX()
		var curY = player.getPosY()

		if (world.input.keyboard.isDown(Phaser.Keyboard.A))
		{
			player.setPosX(player.getPosX() - 10)
		}
		else if (world.input.keyboard.isDown(Phaser.Keyboard.D))
		{
			player.setPosX(player.getPosX() + 10)
		}
		else if (world.input.keyboard.isDown(Phaser.Keyboard.W))
		{
			player.setPosY(player.getPosY() - 10)
		}
		else if (world.input.keyboard.isDown(Phaser.Keyboard.S))
		{
			player.setPosY(player.getPosY() + 10)
		}

		if(wallLayer.collisionWith(player) && !player.GhostMode)
		{
			player.setPosX(curX)
			player.setPosY(curY)
		}

		// check if spacebar was pressed / second param is for debouncing
		if(world.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR, 10))
		{
			if(player.getBombCount() > 0)
			{
				DropBomb(player)
			}
		}

		// update player
		player.update()
	}

	/******************************************************************************
								Private  Methods
	******************************************************************************/

	// Process Bomb dropped
	function DropBomb(player)
	{
		// Create bomb
		var bomb = new Bomb(world, player.getCol(), player.getRow(), 
			player.getCol() * imageSize, player.getRow() * imageSize)

		// Add bomb to layer
		bombLayer.Add(bomb)

		// Add the bomb event - last parm is the callback function's args
		world.time.events.add(Phaser.Timer.SECOND * 1.5, BombExploded, this, bomb);

		player.setBombCount(player.getBombCount() - 1)
	}

	// Bomb exploded Event
	function BombExploded(bomb)
	{
		bombLayer.Remove(bomb)
	}

	// Adds unbreakable walls to the right location
	function AddUnbreakableWalls()
	{
		for(var i = 1; i < boardColSize; i += 2)
		{
			for(var j = 1; j < boardRowSize; j+=2)
			{
				// Create the wall
				var unbreakWall = new Wall(world, false, i, j, i*imageSize, j*imageSize)

				// Add the wall to board
				wallLayer.Add(unbreakWall, i, j)

			}
		}
	}

	// Adds breakable walls to the right location
	function AddBreakableWalls()
	{s
		for(var i = 0; i < boardColSize; i++)
		{
			// fill in rows 1-8
			for(var j = 1; j < boardRowSize; j++)
			{
				// if col is odd than skip every other row to ignore unbreakable walls
				if(i % 2 == 1)
				{
					// extra increment to skip 1 block
					// on every other row
					j++
				}

				// Create the wall
				var breakWall = new Wall(world, true, i, j, i*imageSize, j*imageSize)

				// Add the wall to board
				wallLayer.Add(breakWall, i, j)
			}

			// fills in first row with space
			if(i < boardColSize && i > 2)
			{
				var breakWall = new Wall(world, true, i, 0, i*imageSize, 0)

				wallLayer.Add(breakWall, i, 0)
			}
		}
	}
}



function Game () 
{
	var world = new Phaser.Game(1050, 630, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update })
	var boardColSize = 15
	var boardRowSize = 9
	var imageSize = 70
	var player = null
	var wallLayer = null

	// Preload images needed
	function preload() {

	    world.load.image('bomberman', 'assets/bomberman.jpg')
	    world.load.image('background', 'assets/background.png')
	    world.load.image('unbreakableWall', 'assets/unbreakableWall.jpg')

	}

	function create() {
		// background
		var background = world.add.group();
   		background.z = 1;
   		background.add(world.add.sprite(0,0,'background'))

   		// Wall Layer
   		wallLayer = new Layer(world, "Wall", 15, 9, Wall, 4)

		// Player
		player = new Player(world, "Player 1", 0, 0, 0, 0)


		// Add breakable walls
		AddUnbreakableWalls();
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

		player.update()
	}

	/******************************************************************************
								Events/Event Handlers
	******************************************************************************/

	// Event when a key is hit: converts the key to a string
	function showKey(e) {
		var key
		if (window.event) {
			key = window.event.keyCode
		} 
		else {
			key = e.keyCode
		}

		key = String.fromCharCode(key)
		ProcessKey(key)
	}

	// Processes a key press event
	function ProcessKey(key)
	{
		if (key == "A")
		{
			player.update()
		}
		else if(key == "D")
		{
		}
		else if(key == "W")
		{

		}
		else if(key == "S")
		{
		}
		else if(key == " ")
		{

		}
	}

	// Sets up the keyboard event listener
	window.onload = function() {
		document.onkeydown = showKey
	}

	/******************************************************************************
								Private  Methods
	******************************************************************************/

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
	{
		for(var i = 1; i < 9; i++)
		{
			for(var j = 0; j < 9; j++)
			{
				// Create the wall
				var breakWall = new Wall(true, i, j)

				// Add the wall to board
				wallLayer.Add(breakWall, i, j)

				if(i % 2 == 1)
				{
					// extra increment to skip 1 block
					// on every other row
					j++
				}
			}
			//first row
			if(i < 9 && i > 1)
			{
				var breakWall = new Wall(true, 0, i+1)
				wallLayer.Add(breakWall, 0, i+1)
			}
		}
	}
}


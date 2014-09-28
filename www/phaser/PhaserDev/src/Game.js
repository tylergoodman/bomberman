
function Game () 
{
	var world = new Phaser.Game(1050, 630, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update })
	var boardColSize = 15
	var boardRowSize = 9
	var imageSize = 70
	var player = null
	var playerLayer = null
	var wallLayer = null
	var bombLayer = null

	// Array to keep track of players
	var Players = [];

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

   		// Player Layer
   		playerLayer = new Layer(world, "Player", 15, 9, Player, 4)

   		// Wall Layer
   		wallLayer = new Layer(world, "Wall", 15, 9, Wall, 3)

   		// Bomb Layer
   		bombLayer = new Layer(world, "Bomb", 15, 9, Bomb, 2)

   		// Explosion Layer
   		explosionLayer = new Layer(world, "Explosion", 15, 9, Explosion, 1)

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

		// return player to previous position if collides with wall
		if(wallLayer.collisionWith(player) && !player.GhostMode)
		{
			player.setPosX(curX)
			player.setPosY(curY)
		}

		// Player dies if  he/she collides with explosion
		if(explosionLayer.collisionWith(player) && !player.GhostMode)
		{
			PlayerDied(player)
		}

		// check if spacebar was pressed / second param is for debouncing
		if(world.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR, 10) && Players[0] != null)
		{
			if(player.getBombCount() > 0)
			{
				DropBomb(player)
			}
		}

		// update player
		player.update()
		playerLayer.newBoard(Players)
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
		world.time.events.add(Phaser.Timer.SECOND * bomb.getFuse(), BombExploded, this, bomb)

		player.setBombCount(player.getBombCount() - 1)
	}

	// Bomb exploded Event
	function BombExploded(bomb)
	{
		bombLayer.Remove(bomb)

		var col = bomb.getCol()
		var row = bomb.getRow()

	    for(var i = -1; i <= 1; i += 2)
		{
			var wallOne = wallLayer.getObjectAt(col+i, row)
			var wallTwo = wallLayer.getObjectAt(col, row+i)

			var playerLocOne = playerLayer.getObjectAt(col+i, row)
			var playerLocTwo = playerLayer.getObjectAt(col,row+i)

			if(wallOne instanceof Wall)
			{
				if(wallOne.getCanBreak() == true)
				{
					wallLayer.Remove(wallOne)
				}	
			}
			if(wallTwo instanceof Wall)
			{
				if(wallTwo.getCanBreak() == true)
				{
					wallLayer.Remove(wallTwo)
				}	
			}

			if(playerLocOne instanceof Player)
			{
				PlayerDied(playerLocOne)
			}

			if(playerLocTwo instanceof Player)
			{
				PlayerDied(playerLocTwo)
			}
		}

		// Adds explosions
		AddExplosion(col, row);

		// Special case when player is on the bomb
		var player = playerLayer.getObjectAt(col, row)
		if(player instanceof Player)
		{
			PlayerDied(player)
		}
	}


	// Adds explosion images
	function AddExplosion(col, row)
	{

		// Array to store explosion - fire area
		var explosions = [];

		for(var i = -1; i <= 1; i += 2)
		{
			var explodeOne = explosionLayer.getObjectAt(col+i, row);
			var explodeTwo = explosionLayer.getObjectAt(col, row+i);
			var wallOne = wallLayer.getObjectAt(col+i, row);
			var wallTwo = wallLayer.getObjectAt(col, row+i);

			if(explodeOne == undefined && col+i >= 0 && col+i < boardColSize)
			{
				if(wallOne == undefined)
				{
					var explosion = new Explosion(world, col+i, row, (col+i) * imageSize, row*imageSize);
					explosionLayer.Add(explosion);
					explosions.push(explosion)
				}
				else
				{
					if(wallOne.getCanBreak())
					{
						var explosion = new Explosion(world, col+i, row, (col+i) * imageSize, row*imageSize);
						explosionLayer.Add(explosion);
						explosions.push(explosion)
					}
				}
			}

			if(explodeTwo == undefined && row+i >= 0 && row+i < boardRowSize)
			{
				if(wallTwo == undefined)
				{
					var explosion = new Explosion(world, col, row+i, col * imageSize, (row+i)*imageSize);
					explosionLayer.Add(explosion);
					explosions.push(explosion)
				}
				else
				{
					if(wallTwo.getCanBreak())
					{
						var explosion = new Explosion(world, col, row+i, col * imageSize, (row+i)*imageSize);
						explosionLayer.Add(explosion);
						explosions.push(explosion)
					}
				}
			}
		}
		
		// remove explosions event
		world.time.events.add(Phaser.Timer.SECOND * .5, 
			function(explosions) {
				for(var i = 0; i < explosions.length; i++) 
				{
					// remove breakable wall after explosion / explosions can only spawn on breakable walls / no wall
					var wall = wallLayer.getObjectAt(explosions[i].getCol(), explosions[i].getRow())
					if(wall != undefined)
					{
						wallLayer.remove(wall)
					}

					// remove explosion from explosion layer
					explosionLayer.Remove(explosions[i])}
				}, 
		this, explosions)
	}

	// Removes a dead player
	function PlayerDied(player)
	{
		for(var i = 0; i < Players.length; i++)
		{
			if(player.getName() === Players[i].getName())
			{
				Players.splice(i,1);
				playerLayer.Remove(player);
			}
		}
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
	{
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


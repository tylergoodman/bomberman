
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

		// Player
		player = new Player(world, "Player 1", 0, 0, 0, 0)

		// Add player to world
		Players.push(player)
		playerLayer.Add(player)

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
		world.time.events.add(Phaser.Timer.SECOND * bomb.getFuse(), BombExploded, this, bomb);

		player.setBombCount(player.getBombCount() - 1)
	}

	// Bomb exploded Event
	function BombExploded(bomb)
	{
		bombLayer.Remove(bomb)

		var row = bomb.getRow()
		var col = bomb.getCol()

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
		//this.Explosion(row,col);

		// Special case when player is on the bomb
		var player = playerLayer.getObjectAt(col, row)
		if(player instanceof Player)
		{
			PlayerDied(player)
		}
	}


	// Adds explosion images
	function Explosion(col, row)
	{

		// Array to store explosion - fire area
		var explosions = [];

		for(var i = -1; i <= 1; i += 2)
		{
			var explodeOne = ExplosionLayer.getObjectAt(col+i, row);
			var explodeTwo = ExplosionLayer.getObjectAt(col, row+i);


			if(explodeOne == undefined && col+i >= 0 && col+i < 9)
			{
				var explosion = new Explosion(col+i, row);
				ExplosionLayer.Add(explosion);
				explosions.push(explosion);
			}
			if(explodeTwo == undefined && row+i >= 0 && row+i < 9)
			{
				var explosion = new Explosion(col, row+i);
				ExplosionLayer.Add(explosion);
				explosions.push(explosion);
			}
		}
		
		// Create event to remove explosion image after half a second
		setTimeout(function() {		
			for(var i = 0; i < explosions.length; i++)
			{
				gameBoard.ReturnLayer(Explosion).Remove(explosions[i]);
			}
			gameView.Refresh(this);}, 500);

	}

	// Removes a dead player
	function PlayerDied(player)
	{
		playerLayer.Remove(player)
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


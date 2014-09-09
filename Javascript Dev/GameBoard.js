
/******************************************************************************
						Constructor
******************************************************************************/
	function GameBoard(gameView)
	{	
		// Add the layer to the board
		var GameView = gameView;

		// Array to keep all the layers
		var Layers = [];

		// Create individual layers and add them to array
		var PlayerLayer = new Layer("Player", 9, Player);
		Layers.push(PlayerLayer);
		var BombLayer = new Layer("Bomb", 9, Bomb);
		Layers.push(BombLayer);
		var WallLayer = new Layer("Wall", 9, Wall);
		Layers.push(WallLayer);
		var ExplosionLayer = new Layer("Explosion", 9, Explosion);
		Layers.push(ExplosionLayer);

		// Array to keep track of players
		this.Players = [];

		AddUnbreakableWalls();
		AddBreakableWalls();

/******************************************************************************
							Private  Methods
******************************************************************************/

		// Adds unbreakable walls to the right location
		function AddUnbreakableWalls()
		{
			for(var i = 1; i < 9; i += 2)
			{
				for(var j = 1; j < 9; j+=2)
				{
					// Create the wall
					var unbreakWall = new Wall(false, i, j);

					// Add the wall to board
					WallLayer.Add(unbreakWall, i, j);

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
					var breakWall = new Wall(true, i, j);

					// Add the wall to board
					WallLayer.Add(breakWall, i, j);

					if(i % 2 == 1)
					{
						// extra increment to skip 1 block
						// on every other row
						j++;
					}
				}
				//first row
				if(i < 9 && i > 1)
				{
					var breakWall = new Wall(true, 0, i+1);
					WallLayer.Add(breakWall, 0, i+1);
				}
			}
		}

/******************************************************************************
							Public  Methods
******************************************************************************/
		
		// Adds a player
		this.Add = function(object)
		{
			if(object instanceof Player)
			{
				// Add the player to the Players array
				this.Players.push(object);

				// Add the player to the player layer
				PlayerLayer.Add(object);

				// Return the player so it can be assigned
				return object;
			}
		}

		/*
			Updates the board

			object : the object or if adding, the string name for the new object
			row: row for object's new location
			col: col for object's new location

		*/
		this.Update = function(object, row, col)
		{
			if(object instanceof Player)
			{
				// Remove the player at the object's previous location
				PlayerLayer.Remove(object);

				//Update the player data
				object.setRow(row);
				object.setCol(col);

				// Set the player to the new location
				PlayerLayer.Add(object);

			}
			else if(object instanceof Wall)
			{
				// Update walls
			}
			else if(object instanceof Bomb)
			{
				// bombs are added using this.dropBomb()
			}
		}

		// Checks if the row/col is a valid move
		// Rows are | | | | | | ->
		// Cols are _ _ _ _ _ _  *down*
		this.ValidMove = function(col, row)
		{
			if(WallLayer.getObjectAt(row,col) instanceof Wall)
				return false;
			else
				return true;
		}

		// checks if the user can drop a bomb and drops it if possible
		this.dropBomb = function(playerID)
		{
			// find index
			var index = -1;

			for(var i = 0; i < this.Players.length; i++)
			{
				if(this.Players[i].getName() == playerID)
				{
					index = i;
					// For code readability
					var player = this.Players[i];
				}
			}

			// check if player has enough bombs and drop if possible
			if(index > -1)
			{
				// For code readability
				var playerBombs = player.getBombCount();

				if(playerBombs > 0)
				{
					// Reduce user bomb count by 1
					player.setBombCount(playerBombs - 1);

					// Create the Bomb at player's location
					var bomb = new Bomb(player.getRow(), player.getCol());

					// Add the bomb to the rack
					BombLayer.Add(bomb);

					// Refresh View
					GameView.Refresh(this);
				}
			}
		}


		// All timed-driven events
		this.RunEvents = function()
		{
			this.bombCheckInterval = setInterval(this.CheckBombs, 500);
		}

		// Hopefully returns a copy of bomb board
		this.ReturnBoard = function(type)
		{
			for(var i = 0; i < Layers.length; i++)
			{
				if(Layers[i].getType() == type)
					return Layers[i].returnBoard();
			}
		}

		// Returns the layer of that object type
		this.ReturnLayer = function(type)
		{
			for(var i = 0; i < Layers.length; i++)
			{
				if(Layers[i].getType() == type)
					return Layers[i];
			}
		}

		// remove walls where the bomb exploded
		this.BombExploded = function(row, col)
		{
			for(var i = -1; i <= 1; i += 2)
			{
				var wallOne = WallLayer.getObjectAt(col+i, row);
				var wallTwo = WallLayer.getObjectAt(col, row+i);

				var playerLocOne = PlayerLayer.getObjectAt(col+i, row);
				var playerLocTwo = PlayerLayer.getObjectAt(col,row+i);

				if(wallOne instanceof Wall)
				{
					if(wallOne.getCanBreak() == true)
					{
						WallLayer.Remove(wallOne);
					}	
				}
				if(wallTwo instanceof Wall)
				{
					if(wallTwo.getCanBreak() == true)
					{
						WallLayer.Remove(wallTwo);
					}	
				}

				if(playerLocOne instanceof Player)
				{
					this.PlayerDied(playerLocOne);
				}

				if(playerLocTwo instanceof Player)
				{
					this.PlayerDied(playerLocTwo);
				}
			}

			// Adds explosions
			this.Explosion(row,col);

			// Special case when player is on the bomb
			var player = PlayerLayer.getObjectAt(col, row);
			if(player instanceof Player)
			{
				this.PlayerDied(player);
			}

			// Update the view
			GameView.Refresh(this);
		}

		// Removes the appropriate player from player array
		this.PlayerDied = function(object)
		{
			if(object instanceof Player)
			{
				for(var i = 0; i < this.Players.length; i++)
				{
					if(object.getName() === this.Players[i].getName())
					{
						this.Players.splice(i,1);
						PlayerLayer.Remove(object);
					}
				}
			}
		}

		// Checks if a player is still alive
		// Returns true if player is still in Players array
		this.IsAlive = function(object)
		{
			if(object instanceof Player)
			{
				for(var i = 0; i < this.Players.length; i++)
				{
					if(object.getName() === this.Players[i].getName())
					{
						return true;
					}
				}

				return false;
			}
			console.log("Invalid check");
		}

		// Adds explosion images
		this.Explosion = function(col, row)
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

	}
/******************************************************************************
						End of Constructor
******************************************************************************/
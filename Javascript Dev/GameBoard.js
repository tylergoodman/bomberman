
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

		// Array to keep track of all bombs
		//var BombRack = [];


		// Array to keep track of players
		this.Players = [];

		this.Players[0] = new Player("Player 1", 0, 0);
		
		PlayerLayer.Add(this.Players[0]);

		AddUnbreakableWalls();

/******************************************************************************
							Private  Methods
******************************************************************************/

		// Adds bricks to the right location
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

/******************************************************************************
							Public  Methods
******************************************************************************/

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
				console.log(object.getCol());
			}
			else if(object instanceof Bomb)
			{
				// This method should only be able to add bombs and NOT REMOVE them
				BombLayer.Add(object);

				// Add bomb to bombrack
				//BombRack.push(object);
			}
		}

		// Checks if the row/col is a valid move
		this.ValidMove = function(row, col)
		{
			if(WallLayer.getObjectAt(row,col) instanceof Wall)
				return false;
			else
				return true;
		}

		/*
		// Function to check if bombs are ready to explode
		this.CheckBombs = function()
		{
			// flag to check if something changed
			var bombExploded = false;
			for(var i = 0; i < BombRack.length; i++)
			{
				if(BombRack[i].isExploding())
				{
					BombLayer.Remove(BombRack[i]);
					BombRack.splice(i,1);
					bombExploded = true;
				}
			}

			// Update View
			if(bombExploded)
			{
				GameView.Refresh(gameBoard);
			}
		}
		*/

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

					// Add bomb to bombrack
					//BombRack.push(bomb);

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

	}
/******************************************************************************
						End of Constructor
******************************************************************************/
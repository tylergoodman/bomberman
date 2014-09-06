
/******************************************************************************
						Constructor
******************************************************************************/
	function GameBoard()
	{	
		// Setting up Multidimensional Array
		// Multidimensional arrays are constructed with undef objects
		var Board = new Array(9);
		var BombBoard = new Array(9);
		var BombRack = [];

		// Creates multidimensional array for gameobjects (not bombs)
		for(var i = 0; i < 9; i++)
		{
			Board[i] = new Array(9);
		}

		// Create a separate board for bombs because they can be in same 
		// location as players
		for(var i = 0; i < 9; i++)
		{
			BombBoard[i] = new Array(9);
		}

		// Array to keep track of players
		this.Players = [];

		this.Players[0] = new Player("Player 1", 0, 0);
		Board[0][0] = this.Players[0];
		AddUnbreakableWalls();

/******************************************************************************
							Private  Methods
******************************************************************************/
		// Set object at [row][col]
		function Add (object, isBomb, row, col)
		{
			if(isBomb)
			{
				BombBoard[row][col] = object;
			}
			else if (isBomb == false)
			{
				Board[row][col] = object;
			}
		}

		// Remove object at [row][col]
		function Remove (isBomb, row, col)
		{
			if(isBomb)
				BombBoard[row][col] = undefined;
			else if(isBomb == false)
				Board[row][col] = undefined;
		}

		// Return object at [row][col]
		function GetObjectAt(row, col)
		{
			return Board[row][col];
		}

		// Adds bricks to the right location
		function AddUnbreakableWalls()
		{
			for(var i = 1; i < 9; i += 2)
			{
				for(var j = 1; j < 9; j+=2)
				{
					// Create the wall
					var unbreakWall = new Wall(false, j, i);

					// Add the wall to board
					Add(unbreakWall, false, j, i);

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
				// Set the player to the new location
				Add(object, false, row, col);

				// Remove the player at the object's previous location
				Remove(false, object.getRow(), object.getCol());

				//Update the player data
				object.setRow(row);
				object.setCol(col);

			}
			else if(object instanceof Wall)
			{
				console.log(object.getCol());
			}
			else if(object instanceof Bomb)
			{
				// This method should only be able to add bombs and NOT REMOVE them
				Add(object, true, row, col);

				// Add bomb to bombrack
				BombRack.push(object);
			}
		}

		// Checks if the row/col is a valid move
		this.ValidMove = function(row, col)
		{
			if(Board[row][col] instanceof Wall)
				return false;
			else
				return true;
		}


		// Function to check if bombs are ready to explode
		this.CheckBombs = function()
		{
			// flag to check if something changed
			var bombExploded = false;
			for(var i = 0; i < BombRack.length; i++)
			{
				if(BombRack[i].isExploding())
				{
					Remove(true, BombRack[i].getCol(), BombRack[i].getRow());
					BombRack.splice(i,1);
					bombExploded = true;
				}
			}

			// Update View
			if(bombExploded)
			{
				gameView.Refresh(gameBoard);
			}
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
					Add(bomb, true, bomb.getCol(), bomb.getRow());

					// Add bomb to bombrack
					BombRack.push(bomb);

					// Refresh View
					gameView.Refresh(this);
				}
			}
		}


		// All timed-driven events
		this.RunEvents = function()
		{
			this.bombCheckInterval = setInterval(this.CheckBombs, 500);
		}

		// Hopefully returns a copy of the board
		this.ReturnBoard = function()
		{
			return Board;
		}

		// Hopefully returns a copy of bomb board
		this.ReturnBombBoard = function()
		{
			return BombBoard;
		}

	}
/******************************************************************************
						End of Constructor
******************************************************************************/
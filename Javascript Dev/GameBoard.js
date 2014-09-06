
/******************************************************************************
						Constructor
******************************************************************************/
	function GameBoard()
	{	
		// Setting up Multidimensional Array
		// Multidimensional arrays are constructed with undef objects
		var Board = new Array(9);
		var BombRack = [];
		for(var i = 0; i < 9; i++)
		{
			Board[i] = new Array(9);
		}

		// Array to keep track of players
		this.Players = [];

		this.Players[0] = new Player("Player 1", 0, 0);
		Board[0][0] = this.Players[0];
		AddUnbreakableWalls();
		var Bomb1 =  new Bomb(0,1);
		Board[0][1] = Bomb1
		var Bomb2 = new Bomb(0,2);
		Board[0][2] = Bomb2;
		BombRack.push(Bomb1);
		BombRack.push(Bomb2);

/******************************************************************************
							Private  Methods
******************************************************************************/
		// Set object at [row][col]
		function Add (object, row, col)
		{
			Board[row][col] = object;
		}

		// Remove object at [row][col]
		function Remove (row, col)
		{
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
					Add(unbreakWall, j, i);

				}
			}
		}

/******************************************************************************
							Public  Methods
******************************************************************************/

		// Hopefully returns a copy of the board
		this.ReturnBoard = function()
		{
			return Board;
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
				// Set the player to the new location
				Add(object, row, col);

				// Remove the player at the object's previous location
				Remove(object.getRow(), object.getCol());

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
				// Bombs should only be added to the board with this method
				Add(object, row, col);

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
					Remove(BombRack[i].getCol(), BombRack[i].getRow());
					BombRack.splice(i,1);
					bombExploded = true;
					console.log("Haha");
				}
			}

			// Update View
			if(bombExploded)
			{
				gameView.Refresh(gameBoard);
				bombExploded = false;
			}
		}

		this.RunEvents = function()
		{
			this.bombCheckInterval = setInterval(this.CheckBombs, 500);
		}


	}
/******************************************************************************
						End of Constructor
******************************************************************************/
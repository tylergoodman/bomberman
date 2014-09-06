
/******************************************************************************
						Constructor
******************************************************************************/
	function GameBoard()
	{	
		// Setting up Multidimensional Array
		// Multidimensional arrays are constructed with undef objects
		var Board = new Array(9);
		for(var i = 0; i < 9; i++)
		{
			Board[i] = new Array(9);
		}

		// Array to keep track of players
		this.Players = [];

		this.Players[0] = new Player("Player 1", 0, 0);
		Board[0][0] = this.Players[0];
		AddUnbreakableWalls();

/******************************************************************************
							 Methods
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
				// Set the object to the new location
				Add(object, row, col);

				// Remove the object at the object's previous location
				Remove(object.getRow(), object.getCol());

				//Update the object data
				object.setRow(row);
				object.setCol(col);

			}
			else if(object instanceof Wall)
			{
				console.log(object.getCol());
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

	}
/******************************************************************************
						End of Constructor
******************************************************************************/
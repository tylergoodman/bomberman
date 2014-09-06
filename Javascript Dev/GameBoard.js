
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

		this.Players[0] = new Player("Player 1", 1, 1);
		Board[1][1] = this.Players[0];

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
		this.update = function(object, row, col)
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

	}
/******************************************************************************
						End of Constructor
******************************************************************************/
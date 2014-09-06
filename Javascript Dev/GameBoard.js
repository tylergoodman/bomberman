
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
		this.Add = function(object, row, col)
		{
			Board[row][col] = object;
		}

		// Remove object at [row][col]
		this.Remove = function(row, col)
		{
			Board[row][col] = null;
		}

		// Return object at [row][col]
		this.getObjectAt = function(row, col)
		{
			return Board[row][col];
		}

		/*
			Updates the board

			object : the object or if adding, the string name for the new object
			row: row for object's new location
			col: col for object's new location

		*/
		this.update = function(object, row, col)
		{
			if(typeof(object) === 'Wall')
			{
				console.log("worked");
			}
		}

	}
/******************************************************************************
						End of Constructor
******************************************************************************/
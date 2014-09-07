
/******************************************************************************
						Constructor
******************************************************************************/
/*
	name : name of the layer
	size : size of the board
	type : type of objects that this layer will handle
*/
function Layer (name, size, type) {

	var Name = name;

	var Size = size;

	var Type = type;

	// Setting up Multidimensional Array
	// Multidimensional arrays are constructed with undef objects
	var Board = new Array(size);

	// Creates multidimensional array for objects of this layer
	for(var i = 0; i < size; i++)
	{
		Board[i] = new Array(size);
	}
	
/******************************************************************************
							 Methods
******************************************************************************/

/******************************************************************************
							Public  Methods
******************************************************************************/

	// Return the Layer's name
	this.getName = function()
	{
		return Name;
	}

	// Return the Layer's Size
	this.getSize = function()
	{
		return Size;
	}

	// Returns the type of this class
	this.Type = function()
	{
		return Type;
	}

	// Return object at [row][col]
	this.getObjectAt = function(row, col)
	{
		return Board[row][col];
	}

	// Hopefully returns a copy of the board
	this.returnBoard = function()
	{
		return Board;
	}

	// Set object at [row][col]
	this.Add = function (object, row, col)
	{
		Board[row][col] = object;
	}

	// Remove object at [row][col]
	this.Remove = function(row, col)
	{
		Board[row][col] = undefined;
	}

/******************************************************************************
						End of Methods
******************************************************************************/
}
/******************************************************************************
						End of Constructor
******************************************************************************/
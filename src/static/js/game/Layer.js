
/******************************************************************************
						Constructor
******************************************************************************/
/*
	name : name of the layer
	size : size of the board
	type : type of objects that this layer will handle
*/
function Layer (world, name, sizeOfCol, sizeOfRow, type, level) {

	var World = world

	var Name = name

	var ColSize = sizeOfCol

	var RowSize = sizeOfRow

	var Type = type

	// Setting up Multidimensional Array
	// Multidimensional arrays are constructed with undef objects
	var Board = new Array(ColSize)

	// Creates multidimensional array for objects of this layer
	for(var i = 0; i < ColSize; i++)
	{
		Board[i] = new Array(RowSize)
	}

	// Layer relating to the game
	var Layer = world.add.group()
	Layer.z = level

	
/******************************************************************************
							 Methods
******************************************************************************/

/******************************************************************************
							Public  Methods
******************************************************************************/

	// Return the Layer's name
	this.getName = function()
	{
		return Name
	}

	// Return the Layer's board column Size
	this.getColSize = function()
	{
		return ColSize
	}

	// Return the Layer's board row Size
	this.getRowSize = function()
	{
		return RowSize
	}

	// Returns the type of this class
	this.getType = function()
	{
		return Type
	}

	// Return object at [col][row]
	this.getObjectAt = function(col, row)
	{
		if(col < ColSize && col >=0 && row < RowSize && row >= 0)
		{
			return Board[col][row]
		}
	}

	// Hopefully returns a copy of the board
	this.getBoard = function()
	{
		return Board
	}

	// Set object at [row][col]
	this.Add = function (object)
	{
		if(object instanceof Type)
		{
			Board[object.getCol()][object.getRow()] = object
		}
	}

	// Remove object at [row][col]
	this.Remove = function(object)
	{
		if(object instanceof Type)
		{
			Board[object.getCol()][object.getRow()] = undefined
			object.getSprite().destroy()
		}
	}

	// Override Remove method to take in col and row
	this.RemoveAt = function(col, row)
	{
		if(Board[col][row] instanceof Type)
		{
			this.Remove(Board[col][row])
		}
	}

	// Create a new board with objects from an array
	this.newBoard = function(array)
	{
		this.clearBoard()

		for(var i = 0; i < array.length; i++)
		{
			if(array[i] instanceof Type)
			{
				this.Add(array[i])
			}
		}
	}

	// Clears the board
	this.clearBoard = function()
	{
		Board = new Array(ColSize)
		for(var i = 0; i < ColSize; i++)
		{
			Board[i] = new Array(RowSize)
		}
	}

	// Checks if an object has collided with any object in this layer
	this.collisionWith = function(object)
	{
		for(var i = 0; i < ColSize; i++)
		{
			for(var j = 0; j  < RowSize; j++)
			{
				if(Board[i][j] instanceof Type)
				{
					if(collision(object, Board[i][j]))
						return true
				}
			}
		}

		return false;
	}

	/* INCOMPLETE */
	// Check if player (objectA) is within exception zone
	// if so, player will be forced into square
	this.withinCollisionException = function(objectA)
	{
								console.log("function")
		var exception = 10
		for(var i = 0; i < ColSize; i++)
		{
			for(var j = 0; j  < RowSize; j++)
			{
				var  objectB = Board[i][j];
				if(objectB instanceof Type)
				{
					if(collision(objectA, objectB))
					{
						console.log("worked")
						if(objectA.getRow() < objectB.getRow())
						{
							if(objectA.getCol() > objectB.getCol())
							{
								if(objectB.getPosX() + objectB.getWidth() > objectA.getPosX())
								{
									if(objectB.getPosX() + objectB.getWidth() - objectA.getPosX() <= exception)
										return {newX: objectB.getPosX() + objectB.getWidth() + 1, newY: objectA.getPosY() + 1}
								}
								else if (objectB.getPosX() + objectB.getWidth() < objectA.getPosX())
								{
									if(objectA.getPosY() + objectA.getHeight() - objectB.getPosY() <= exception)
										return {newX: objectA.getPosX() - 1, newY: objectB.getPosY() - 1}
								}
							}
							else if(objectA.getCol() < BobjectB.getCol())
							{
									
							}
						}
						else if(objectA.getRow() > objectB.getRow())
						{
							if(objectA.getCol() > objectB.getCol())
							{

							}
							else if(objectA.getCol() < objectB.getCol())
							{
								
							}
						}
					}
				}
			}
		}
		
		return null

	}


	// Scales each item in the layer by a value
	this.scaleObjects = function(scaleX, scaleY, imageSizeWidth, ImageSizeHeight)
	{
		for(var i = 0; i < ColSize; i++)
		{
			for(var j = 0; j  < RowSize; j++)
			{
				if(Board[i][j] instanceof Type)
				{
					// Rescale the image
					Board[i][j].getSprite().scale.setTo(scaleX, scaleY)
					// Redraw the image
					Board[i][j].setPosX(Board[i][j].getCol()*imageSizeWidth)
					Board[i][j].setPosY(Board[i][j].getRow()*ImageSizeHeight)
				}
			}
		}
	}

/******************************************************************************
							Private  Methods
******************************************************************************/

	// Bounding Box Collision
	function collision(objectA, objectB) 
	{
  		return (objectA.getPosX() < objectB.getPosX() + objectB.getWidth() &&
		   objectA.getPosX() + objectA.getWidth() > objectB.getPosX() &&
		   objectA.getPosY() < objectB.getPosY() + objectB.getHeight() &&
		   objectA.getHeight() + objectA.getPosY() > objectB.getPosY())
	}
/******************************************************************************
						End of Methods
******************************************************************************/
}
/******************************************************************************
						End of Constructor
******************************************************************************/
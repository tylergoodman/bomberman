
/******************************************************************************
						Constructor
******************************************************************************/

function Wall (preferences, breakable, col, row, posX, posY) {

	if(breakable)
	{
		GameObject.call(this, preferences.World, col, row, posX, posY, 'breakableWall');
	}
	else
	{
		GameObject.call(this, preferences.World, col, row, posX, posY, 'unbreakableWall');
	}

	// Set up Object's properties 
	this.CanBreak = breakable || false;

/******************************************************************************
							 Methods
******************************************************************************/

	// Wall's CanBreak Get
	this.getCanBreak = function () {
		return this.CanBreak;
	}

}
/******************************************************************************
						End of Constructor
******************************************************************************/
	
/******************************************************************************
							 Inheritance
******************************************************************************/

	Wall.prototype = Object.create(GameObject.prototype);
	Wall.prototype.constructor = Wall;

/******************************************************************************
							End of Inheritance
******************************************************************************/

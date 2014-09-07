
/******************************************************************************
						Constructor
******************************************************************************/

function Wall (breakable, col, row) {
	if(breakable)
	{
		GameObject.call(this, col, row, "breakablewall.jpg", "wall", '50px', '50px');
	}
	else
	{
		GameObject.call(this, col, row, "unbreakablewall.jpg", "wall", '50px', '50px');
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

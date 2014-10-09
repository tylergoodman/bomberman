
/******************************************************************************
						Constructor
******************************************************************************/

function Bomb (world, col, row, posX, posY, type) {
	GameObject.call(this, world, col, row, posX, posY, 'bomb');

	// fuse time
	this.fuse = 1.5
	this.type  = type
/******************************************************************************
							 Methods
******************************************************************************/

	
	function SetType(type)
	{
		switch(type)
		{
			case "normal":
				this.type = "normal"
				break;
			case "vertical":
				this.type = "vertical"
				break;
			default:
				break;
		}
	}

	// Returns if Bomb should explode
	this.isExploding = function()
	{
		if(fuse == 0)
		{

		}
		else 
			fuse--;
	}

	this.getFuse = function()
	{
		return this.fuse
	}

	this.getType = function()
	{
		return this.type
	}

}
/******************************************************************************
						End of Constructor
******************************************************************************/
	
/******************************************************************************
							 Inheritance
******************************************************************************/

	Bomb.prototype = Object.create(GameObject.prototype);
	Bomb.prototype.constructor = Bomb;

/******************************************************************************
							End of Inheritance
******************************************************************************/

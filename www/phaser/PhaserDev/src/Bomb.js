
/******************************************************************************
						Constructor
******************************************************************************/

function Bomb (preferences, col, row, posX, posY, type) {
	GameObject.call(this, preferences.World, col, row, posX, posY, 'bomb');

	// fuse time
	this.fuse = 1.5
	this.type  = type

	// Scale image
	this.getSprite().scale.setTo(preferences.BombWidthRatio, preferences.BombHeightRatio)
/******************************************************************************
							 Methods
******************************************************************************/

	
	function SetType(type)
	{
		switch(type)
		{
			case "Normal":
				this.type = "Normal"
				break;
			case "Vertical":
				this.type = "Vertical"
				break;
			case "Horizontal":
				this.type = "Horizontal"
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

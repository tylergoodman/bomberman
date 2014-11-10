function Perk (preferences, col, row, posX, posY, type) {

	this.type = type

	var sprite = null
	switch(type)
	{
		case "NormalBombPerk" :
			sprite = 'normalBombPerk'
			break;
		case "HorizontalBombPerk" :
			sprite = 'horizontalBombPerk'
			break;
		case "VerticalBombPerk" :
			sprite = 'verticalBombPerk'
			break;
		default :
			break;
	}

	// Create the object based on the type
	// default will be normalbombperk to avoid any null errors in the future
	if( sprite != null)
	{
		GameObject.call(this, preferences.World, col, row, posX, posY, sprite)
	}
	else
	{
		this.type = "NormalBombPerk"
		GameObject.call(this, preferences.World, col, row, posX, posY, 'normalBombPerk')
	}


/******************************************************************************
							 Methods
******************************************************************************/
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

	Perk.prototype = Object.create(GameObject.prototype)
	Perk.prototype.constructor = Perk

/******************************************************************************
							End of Inheritance
******************************************************************************/

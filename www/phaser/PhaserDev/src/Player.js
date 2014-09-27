
/******************************************************************************
						Constructor
******************************************************************************/

function Player (world, name, col, row, posX, posY) {

	GameObject.call(this, world, col, row, posX, posY, 'bomberman')

	// Set up Object's properties
	this.Name = name
	this.BombCount = 20

/******************************************************************************
							 Methods
******************************************************************************/

	// Player's Name Get
	this.getName = function () {
		return this.Name
	}

	// BombCount Get/Set
	this.getBombCount = function () {
		return this.BombCount
	}

	this.setBombCount = function (value) {
		this.BombCount = value
	}

/******************************************************************************
							 update
******************************************************************************/
	Player.prototype.update = function()
	{
		// Keep player within world
		if(this.getPosX() < 0)
			this.setPosX(0)
		if(this.getPosX() + this.Sprite.width > world.width)
			this.setPosX(world.width - this.Sprite.width)
		if(this.getPosY() < 0)
			this.setPosY(0)
		if(this.getPosY() + this.Sprite.height > world.height)
			this.setPosY(world.height - this.Sprite.height)
	}
	Player.prototype.render = function()
	{

	}
}
/******************************************************************************
						End of Constructor
******************************************************************************/
	
/******************************************************************************
							 Inheritance
******************************************************************************/

	Player.prototype = Object.create(GameObject.prototype)
	Player.prototype.constructor = Player

/******************************************************************************
							End of Inheritance
******************************************************************************/


/******************************************************************************
						Constructor
******************************************************************************/

function Player (world, name, col, row, posX, posY) {

	GameObject.call(this, world, col, row, posX, posY, 'bomberman');

	// Set up Object's properties
	this.Name = name;
	this.BombCount = 20;

/******************************************************************************
							 Methods
******************************************************************************/

	// Player's Name Get
	this.getName = function () {
		return this.Name;
	}

	// BombCount Get/Set
	this.getBombCount = function () {
		return this.BombCount;
	}

	this.setBombCount = function (value) {
		this.BombCount = value;
	}

}
/******************************************************************************
						End of Constructor
******************************************************************************/
	
/******************************************************************************
							 Inheritance
******************************************************************************/

	Player.prototype = Object.create(GameObject.prototype);
	Player.prototype.constructor = Player;

/******************************************************************************
							End of Inheritance
******************************************************************************/

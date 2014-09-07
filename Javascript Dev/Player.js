
/******************************************************************************
						Constructor
******************************************************************************/

function Player (name, col, row) {

	GameObject.call(this, col, row, "bomberman.jpg", "bomberman", '50px', '50px');
	//this.base = GameObject;
	//this.base(col, row, "bomberman.jpg", "bomberman", '40px', '30px');

	// Set up Object's properties
	this.Name = name;
	this.BombCount = 20;


	// This works too but in a different way that would probably be better explained in person.
	// javascript gets a little complex in terms of scope
	// the functions below are public functions that act on public variables

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

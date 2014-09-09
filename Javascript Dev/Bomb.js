
/******************************************************************************
						Constructor
******************************************************************************/

function Bomb (row, col) {
	var self = this;
	GameObject.call(this, col, row, "Bomb.jpg", "bomb", '50px', '50px');

	// fuse time
	var fuse = 3;

/******************************************************************************
							 Methods
******************************************************************************/

	// Returns if Bomb should explode
	this.isExploding = function()
	{
		if(fuse == 0)
		{
			clearInterval(bombCheckInterval);
			// Change image
			self.setImage("Explosion.jpg");

			// Tell GameBoard to destroy surrounding walls
			gameBoard.BombExploded(self.getRow(), self.getCol());

			// Create event to remove bomb
			setTimeout(function() {		
				gameBoard.ReturnLayer(Bomb).Remove(self);
				gameView.Refresh(gameBoard);}, 500);

			// update the bomb's explosion image
			gameView.Refresh(gameBoard);
		}
		else 
			fuse--;
	}

	// Bombs will explode on their own
	var bombCheckInterval = setInterval(this.isExploding, 500);

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

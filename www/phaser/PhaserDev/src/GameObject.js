
/******************************************************************************
						Constructor
******************************************************************************/

	function GameObject (world, col, row, posX, posY, image) {
		// Member variables
		this.Col = col; // x - position
		this.Row = row; // y - position
		this.X = posX;
		this.Y = posY;
		this.Sprite =  world.add.sprite(row * 50, col * 50, image);
	}

/******************************************************************************
						End of Constructor
******************************************************************************/
	
/******************************************************************************
						Inherited Methods
******************************************************************************/

	// Col Get/Set
	GameObject.prototype.getCol = function () {
		return this.Col;
	}

	GameObject.prototype.setCol = function (value) {
		this.Col = value;
	}

	// Row Get/Set
	GameObject.prototype.getRow = function () {
		return this.Row;
	}

	GameObject.prototype.setRow = function (value) {
		this.Row = value;
	}

	// posX Get/Set
	GameObject.prototype.getPosX = function () {
		return this.X;
	}

	GameObject.prototype.setPosX = function (value) {
		this.X = value;
	}

	// posY Get/Set
	GameObject.prototype.getPosY = function () {
		return this.Y;
	}

	GameObject.prototype.setPosY = function (value) {
		this.Y = value;
	}

	GameObject.prototype.getSprite = function()
	{
		return this.Sprite;
	}



/******************************************************************************
						End of Inherited Methods
******************************************************************************/
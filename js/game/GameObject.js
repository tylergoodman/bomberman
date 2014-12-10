
/******************************************************************************
						Constructor
******************************************************************************/

	function GameObject (world, col, row, posX, posY, image) {
		// Member variables
		this.Col = col  // x - position
		this.Row = row // y - position
		this.Sprite =  world.add.sprite(posX, posY, image)
	}

/******************************************************************************
						End of Constructor
******************************************************************************/
	
/******************************************************************************
						Inherited Methods
******************************************************************************/

	// Col Get/Set
	GameObject.prototype.getCol = function () {
		return this.Col
	}

	GameObject.prototype.setCol = function (value) {
		this.Col = value
	}

	// Row Get/Set
	GameObject.prototype.getRow = function () {
		return this.Row
	}

	GameObject.prototype.setRow = function (value) {
		this.Row = value
	}

	// posX Get/Set
	GameObject.prototype.getPosX = function () {
		return this.Sprite.x
	}

	GameObject.prototype.setPosX = function (value) {
		this.Sprite.x = value
	}

	// posY Get/Set
	GameObject.prototype.getPosY = function () {
		return this.Sprite.y
	}

	GameObject.prototype.setPosY = function (value) {
		this.Sprite.y = value
	}

	GameObject.prototype.getSprite = function()
	{
		return this.Sprite
	}

	GameObject.prototype.getWidth = function()
	{
		return this.Sprite.width
	}

	GameObject.prototype.getHeight = function()
	{
		return this.Sprite.height
	}

	GameObject.prototype.update = function()
	{

	}

	GameObject.prototype.render = function()
	{

	}


/******************************************************************************
						End of Inherited Methods
******************************************************************************/
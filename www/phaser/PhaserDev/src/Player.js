
/******************************************************************************
						Constructor
******************************************************************************/

function Player (world, name, col, row, posX, posY) {

	GameObject.call(this, world, col, row, posX, posY, 'bot')

	// Set up Object's properties
	this.Name = name
	this.BombCount = 20
	this.GhostMode = false
	this.CurrentAnimation = null
	this.PreviousAnimation = null
	this.AnimationChanged = false

/******************************************************************************
							 Animations
******************************************************************************/

// animations
this.Sprite.animations.add('run');

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

		// players col/row before updated
		var curCol = this.getCol()
		var curRow = this.getRow()

		// update player col / row
		this.setCol(Math.floor((this.getPosX() + this.getWidth() / 2) / 70))
		this.setRow(Math.floor((this.getPosY() + this.getHeight() / 2) / 70))

		// plays animation
		if(this.AnimationChanged)
		{
			if(this.CurrentAnimation != 'stop')
			{
				this.animate(this.CurrentAnimation)
			}
			this.AnimationChanged = false
		}
	}

	// Decides which animation to play when user moves


	Player.prototype.animate = function(animation)
	{
		switch(animation)
		{
			case "left":
				this.Sprite.animations.play('run', 15, true)			
				break;
			case "right":
				this.Sprite.animations.stop(null, true)
				break;
			case "up" :
				this.Sprite.animations.stop(null, true)
				break;
			case "down" :
				this.Sprite.animations.stop(null, true)
				break;
			case "stop":
				if(this.CurrentAnimation != 'stop')
				{
					this.animationChanged = true
					this.CurrentAnimation = 'stop'
					this.Sprite.animations.stop(null, true)
				}	
				break;
			default:
				break;
		}
	}


	// Override Game object's setPosX
	Player.prototype.setPosX = function (newPosition) {
		var curPosition = this.getPosX()
		var newAnimation = null

		if(curPosition > newPosition)
			newAnimation = 'left'
		else if(curPosition < newPosition)
			newAnimation = 'right'

		if(newAnimation != this.CurrentAnimation && newAnimation != null)
		{
			this.AnimationChanged = true
			this.CurrentAnimation = newAnimation
		}

		// update the sprites x position
		this.Sprite.x = newPosition
	}

	// Override Game object's setPosX
	Player.prototype.setPosY = function (newPosition) {
		var curPosition = this.getPosY()
		var newAnimation = null

		if(curPosition > newPosition)
			newAnimation = 'down'
		else if(curPosition < newPosition)
			newAnimation = 'up'

		if(newAnimation != this.CurrentAnimation && newAnimation != null)
		{
			this.AnimationChanged = true
			this.CurrentAnimation = newAnimation
		}
		
		// update the sprites y position
		this.Sprite.y = newPosition
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

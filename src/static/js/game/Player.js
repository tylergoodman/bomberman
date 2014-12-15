
/******************************************************************************
						Constructor
******************************************************************************/

function Player (preferences, name, col, row, posX, posY) {
	var spriteImage = 'sprite1'

	if(col == preferences.BoardColSize - 1 &&
		row == 0)
	{
		spriteImage = 'sprite2'
	}
	else if(col == 0 && row == preferences.BoardRowSize - 1)
	{
		spriteImage = 'sprite3'
	}
	else if(col == preferences.BoardColSize - 1 &&
	row == preferences.BoardRowSize - 1)
	{
		spriteImage = 'sprite4'
	}

	GameObject.call(this, preferences.World, col, row, posX, posY, spriteImage)
	// Set up Object's properties
	this.Name = name
	this.NormalBombCount = 20
	this.VerticalBombCount = 20
	this.HorizontalBombCount = 20
	this.SuperBombCount = 1
	this.GhostMode = false
	this.CurrentAnimation = null
	this.PreviousAnimation = null
	this.AnimationChanged = false

	// Scale Player
	this.getSprite().scale.setTo(preferences.PlayerWidthRatio, preferences.PlayerHeightRatio)

/******************************************************************************
							 Animations
******************************************************************************/

	// animations
	//this.Sprite.animations.add('left', Phaser.Animation.generateFrameNames('newleft', 1, 8, '.png', 0), 30, true);
	//this.Sprite.animations.add('right', Phaser.Animation.generateFrameNames('newright', 1, 8, '.png', 0), 30, true);
	//this.Sprite.animations.add('front', Phaser.Animation.generateFrameNames('newfront', 1, 8, '.png', 0), 30, true);
	//this.Sprite.animations.add('back', Phaser.Animation.generateFrameNames('newback', 1, 8, '.png', 0), 30, true);
	//this.Sprite.animations.add('explode', Phaser.Animation.generateFrameNames('bomb', 1, 6, '', 0), false, true)
	this.Sprite.animations.add('left', Phaser.Animation.generateFrameNames('left', 1, 8, '', 0), 30, true);
	this.Sprite.animations.add('right', Phaser.Animation.generateFrameNames('right', 1, 8, '', 0), 30, true);
	this.Sprite.animations.add('front', Phaser.Animation.generateFrameNames('front', 1, 8, '', 0), 30, true);
	this.Sprite.animations.add('back', Phaser.Animation.generateFrameNames('back', 1, 8, '', 0), 30, true);

/******************************************************************************
							 Methods
******************************************************************************/

	// Player's Name Get
	this.getName = function () {
		return this.Name
	}

	// BombCount Get/Set
	this.getBombCount = function (type) {
		var count = null
		switch(type)
		{
			case "Normal" :
				count = this.NormalBombCount
				break;
			case "Vertical" :
				count = this.VerticalBombCount
				break;
			case "Horizontal" :
				count = this.HorizontalBombCount
				break;
			case "Super" :
				count = this.SuperBombCount
				break;
			default : 
				console.log("Could not retrieve valid bomb type")
				break;
		}
		if(count != null)
			return count
		else
			return 0
		// Returns 0 to avoid null errors in code
	}

	this.setBombCount = function (type, value) {
		switch(type)
		{
			case "Normal" :
				this.NormalBombCount = value
				break;
			case "Vertical" :
				this.VerticalBombCount = value
				break;
			case "Horizontal" :
				this.HorizontalBombCount = value
				break;
			case "Super" :
				this.SuperBombCount = value
				break;
			default : 
				console.log("Could not set valid bomb type")
				break;
		}
	}

/******************************************************************************
							 update
******************************************************************************/
	Player.prototype.update = function()
	{
		// Keep player within world
		if(this.getPosX() < 0)
			this.setPosX(0, true)
		if(this.getPosX() + this.Sprite.width > preferences.World.width)
			this.setPosX(preferences.World.width - this.Sprite.width, true)
		if(this.getPosY() < 0)
			this.setPosY(0, true)
		if(this.getPosY() + this.Sprite.height > preferences.World.height)
			this.setPosY(preferences.World.height - this.Sprite.height, true)

		// players col/row before updated
		var curCol = this.getCol()
		var curRow = this.getRow()

		// update player col / row
		var newCol = Math.floor((this.getPosX() + this.getWidth() / 2) / preferences.ImageSizeWidth)
		var newRow = Math.floor((this.getPosY() + this.getHeight() / 2) / preferences.ImageSizeHeight)
		if(newCol > 14)
			newCol = 14
		this.setCol(newCol)
		this.setRow(newRow)

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
				this.Sprite.animations.play('left', 15, true)			
				break;
			case "right":
				this.Sprite.animations.play('right', 15, true)	
				break;
			case "up" :
				this.Sprite.animations.play('front', 15, true)	
				break;
			case "down" :
				this.Sprite.animations.play('back', 15, true)	
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
	// systemchanged - if system changed players position
	Player.prototype.setPosX = function (newPosition, systemChanged) {
		var curPosition = this.getPosX()
		var newAnimation = null

		if(curPosition > newPosition)
			newAnimation = 'left'
		else if(curPosition < newPosition)
			newAnimation = 'right'

		if(newAnimation != this.CurrentAnimation && newAnimation != null && !systemChanged)
		{
			this.AnimationChanged = true
			this.CurrentAnimation = newAnimation
		}

		// update the sprites x position
		this.Sprite.x = newPosition
	}

	// Override Game object's setPosX
	Player.prototype.setPosY = function (newPosition, systemChanged) {
		var curPosition = this.getPosY()
		var newAnimation = null

		if(curPosition > newPosition)
			newAnimation = 'down'
		else if(curPosition < newPosition)
			newAnimation = 'up'

		if(newAnimation != this.CurrentAnimation && newAnimation != null && !systemChanged)
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

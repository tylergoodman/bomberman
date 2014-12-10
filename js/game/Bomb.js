
/******************************************************************************
						Constructor
******************************************************************************/

function Bomb (preferences, col, row, posX, posY, type) {
	GameObject.call(this, preferences.World, col, row, posX, posY, 'bombAnimation');

	// fuse time
	this.fuse = 1.5
	this.type  = type

	// Scale image
	this.getSprite().scale.setTo(preferences.BombWidthRatio, preferences.BombHeightRatio)

	// Add animation to sprite
	this.Sprite.animations.add('explode', Phaser.Animation.generateFrameNames('bomb', 1, 6, '', 0), false, true)


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
		// play animation
		this.Sprite.animations.play('explode', 20, false, false)	
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

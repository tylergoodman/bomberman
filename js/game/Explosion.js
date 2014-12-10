
/******************************************************************************
						Constructor
******************************************************************************/

function Explosion (preferences, col, row, posX, posY) {
	GameObject.call(this, preferences.World, col, row, posX, posY, 'explosionAnimation');

	// Scale the image
	this.getSprite().scale.setTo(preferences.ExplosionWidthRatio, 
		preferences.ExplosionHeightRatio)

	// Add animation to sprite
	this.Sprite.animations.add('explode', Phaser.Animation.generateFrameNames('explosion', 1, 5, '.png', 0), false, true)

	// play animation
	this.Sprite.animations.play('explode', 5, false, false)	

/******************************************************************************
							 Methods
******************************************************************************/
}	
/******************************************************************************
						End of Constructor
******************************************************************************/
	
/******************************************************************************
							 Inheritance
******************************************************************************/

	Explosion.prototype = Object.create(GameObject.prototype);
	Explosion.prototype.constructor = Explosion;

/******************************************************************************
							End of Inheritance
******************************************************************************/

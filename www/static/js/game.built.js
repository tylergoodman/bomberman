

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

/******************************************************************************
						Constructor
******************************************************************************/
/*
	name : name of the layer
	size : size of the board
	type : type of objects that this layer will handle
*/
function Layer (world, name, sizeOfCol, sizeOfRow, type, level) {

	var World = world

	var Name = name

	var ColSize = sizeOfCol

	var RowSize = sizeOfRow

	var Type = type

	// Setting up Multidimensional Array
	// Multidimensional arrays are constructed with undef objects
	var Board = new Array(ColSize)

	// Creates multidimensional array for objects of this layer
	for(var i = 0; i < ColSize; i++)
	{
		Board[i] = new Array(RowSize)
	}

	// Layer relating to the game
	var Layer = world.add.group()
	Layer.z = level

	
/******************************************************************************
							 Methods
******************************************************************************/

/******************************************************************************
							Public  Methods
******************************************************************************/

	// Return the Layer's name
	this.getName = function()
	{
		return Name
	}

	// Return the Layer's board column Size
	this.getColSize = function()
	{
		return ColSize
	}

	// Return the Layer's board row Size
	this.getRowSize = function()
	{
		return RowSize
	}

	// Returns the type of this class
	this.getType = function()
	{
		return Type
	}

	// Return object at [col][row]
	this.getObjectAt = function(col, row)
	{
		if(col < ColSize && col >=0 && row < RowSize && row >= 0)
		{
			return Board[col][row]
		}
	}

	// Hopefully returns a copy of the board
	this.getBoard = function()
	{
		return Board
	}

	// Set object at [row][col]
	this.Add = function (object)
	{
		if(object instanceof Type)
		{
			Board[object.getCol()][object.getRow()] = object
		}
	}

	// Remove object at [row][col]
	this.Remove = function(object)
	{
		if(object instanceof Type)
		{
			Board[object.getCol()][object.getRow()] = undefined
			object.getSprite().destroy()
		}
	}

	// Override Remove method to take in col and row
	this.RemoveAt = function(col, row)
	{
		if(Board[col][row] instanceof Type)
		{
			this.Remove(Board[col][row])
		}
	}

	// Create a new board with objects from an array
	this.newBoard = function(array)
	{
		this.clearBoard()

		for(var i = 0; i < array.length; i++)
		{
			if(array[i] instanceof Type)
			{
				this.Add(array[i])
			}
		}
	}

	// Clears the board
	this.clearBoard = function()
	{
		Board = new Array(ColSize)
		for(var i = 0; i < ColSize; i++)
		{
			Board[i] = new Array(RowSize)
		}
	}

	// Checks if an object has collided with any object in this layer
	this.collisionWith = function(object)
	{
		for(var i = 0; i < ColSize; i++)
		{
			for(var j = 0; j  < RowSize; j++)
			{
				if(Board[i][j] instanceof Type)
				{
					if(collision(object, Board[i][j]))
						return true
				}
			}
		}

		return false;
	}

	// Scales each item in the layer by a value
	this.scaleObjects = function(scaleX, scaleY, imageSizeWidth, ImageSizeHeight)
	{
		for(var i = 0; i < ColSize; i++)
		{
			for(var j = 0; j  < RowSize; j++)
			{
				if(Board[i][j] instanceof Type)
				{
					// Rescale the image
					Board[i][j].getSprite().scale.setTo(scaleX, scaleY)
					// Redraw the image
					Board[i][j].setPosX(Board[i][j].getCol()*imageSizeWidth)
					Board[i][j].setPosY(Board[i][j].getRow()*ImageSizeHeight)
				}
			}
		}
	}

/******************************************************************************
							Private  Methods
******************************************************************************/

	// Bounding Box Collision
	function collision(objectA, objectB) 
	{
  		return (objectA.getPosX() < objectB.getPosX() + objectB.getWidth() &&
		   objectA.getPosX() + objectA.getWidth() > objectB.getPosX() &&
		   objectA.getPosY() < objectB.getPosY() + objectB.getHeight() &&
		   objectA.getHeight() + objectA.getPosY() > objectB.getPosY())
	}

/******************************************************************************
						End of Methods
******************************************************************************/
}
/******************************************************************************
						End of Constructor
******************************************************************************/

/******************************************************************************
						Constructor
******************************************************************************/

function Player (preferences, name, col, row, posX, posY) {

	GameObject.call(this, preferences.World, col, row, posX, posY, 'bombermanAnimation')

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
	this.Sprite.animations.add('left', Phaser.Animation.generateFrameNames('newleft', 1, 8, '.png', 0), 30, true);
	this.Sprite.animations.add('right', Phaser.Animation.generateFrameNames('newright', 1, 8, '.png', 0), 30, true);
	this.Sprite.animations.add('front', Phaser.Animation.generateFrameNames('newfront', 1, 8, '.png', 0), 30, true);
	this.Sprite.animations.add('back', Phaser.Animation.generateFrameNames('newback', 1, 8, '.png', 0), 30, true);

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


/******************************************************************************
						Constructor
******************************************************************************/

function Wall (preferences, breakable, col, row, posX, posY) {

	if(breakable)
	{
		GameObject.call(this, preferences.World, col, row, posX, posY, 'breakableWall');
	}
	else
	{
		GameObject.call(this, preferences.World, col, row, posX, posY, 'unbreakableWall');
	}

	// Set up Object's properties 
	this.CanBreak = breakable || false;

/******************************************************************************
							 Methods
******************************************************************************/

	// Wall's CanBreak Get
	this.getCanBreak = function () {
		return this.CanBreak;
	}

}
/******************************************************************************
						End of Constructor
******************************************************************************/
	
/******************************************************************************
							 Inheritance
******************************************************************************/

	Wall.prototype = Object.create(GameObject.prototype);
	Wall.prototype.constructor = Wall;

/******************************************************************************
							End of Inheritance
******************************************************************************/


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

function LayerManager(preferences)
{
	var Layers = []
	var World = preferences.World

	// returns a layer from the list based on name
	this.ReturnLayer = function(name)
	{
		for(var i = 0; i < Layers.length; i++)
			if(Layers[i].getName() === name)
				return Layers[i]
		return null
	}

	// private version on the Return Layer function
	// duplicated to keep private functions from being accessible 
	// since the public ReturnLayer cant be called from private method
	function ReturnLayer(name)
	{
		for(var i = 0; i < Layers.length; i++)
			if(Layers[i].getName() === name)
				return Layers[i]
		return null
	}

	// Sets up the world with specified layers
	// Add walls based on function
	this.SetUpWorld = function()
	{

		// Player Layer
		Layers.push(new Layer(World, "Player", 15, 9, Player, 5))

		// Wall Layer
		Layers.push(new Layer(World, "Wall", 15, 9, Wall, 4))

		// Perk Layer
		Layers.push(new Layer(World, "Perk", 15, 9, Perk, 3))

		// Bomb Layer
		Layers.push(new Layer(World, "Bomb", 15, 9, Bomb, 2))

		// Explosion Layer
		Layers.push(new Layer(World, "Explosion", 15, 9, Explosion, 1))


	/******************************************************************************
								Add Walls / Can Change for new map
	******************************************************************************/

		// add unbreakable walls
		AddUnbreakableWalls()

		// add breakable walls
		AddBreakableWalls()

	}

	// Adds unbreakable walls to the right location
	function AddUnbreakableWalls()
	{
		for(var i = 1; i < preferences.BoardColSize; i += 2)
		{
			for(var j = 1; j < preferences.BoardRowSize; j+=2)
			{
				// Create the wall
				var unbreakWall = new Wall(preferences, false, i, j, 
					i*preferences.ImageSizeWidth, j*preferences.ImageSizeHeight)

				// Scale the wall
				unbreakWall.getSprite().scale.setTo(
					preferences.WallWidthRatio, preferences.WallHeightRatio)

				// Add the wall to board
				ReturnLayer("Wall").Add(unbreakWall, i, j)

			}
		}
	}

	// Adds breakable walls to the right location
	function AddBreakableWalls()
	{
		for(var i = 0; i < preferences.BoardColSize; i++)
		{
			// fill in rows 1-8
			for(var j = 1; j < preferences.BoardRowSize; j++)
			{
				// if col is odd than skip every other row to ignore unbreakable walls
				if(i % 2 == 1)
				{
					// extra increment to skip 1 block
					// on every other row
					j++
				}

				// Dont generate blocks in bottom left and right corner of game
				if(i > 2 && i < 12 || j < preferences.BoardRowSize - 1)
				{
					// Create the wall
					var breakWall = new Wall(preferences, true, i, j, 
						i*preferences.ImageSizeWidth, j*preferences.ImageSizeHeight)

					// Scale the wall
				    breakWall.getSprite().scale.setTo(
				    	preferences.WallWidthRatio, preferences.WallHeightRatio)

					// Add the wall to board
					ReturnLayer("Wall").Add(breakWall, i, j)
				}
			}

			// fills in first row with space
			if(i < preferences.BoardColSize && i > 2 && i < 12)
			{
				var breakWall = new Wall(preferences, true, i, 0, 
					i*preferences.ImageSizeWidth, 0)

				// Scale the wall
				breakWall.getSprite().scale.setTo(
					preferences.WallWidthRatio, preferences.WallHeightRatio)


				ReturnLayer("Wall").Add(breakWall, i, 0)
			}
		}
	}

	/******************************************************************************
								Scale
	******************************************************************************/

	// Scales all the layers if the window size changes
	this.ScaleLayers = function()
	{
		// Update Wall Layer
		var layer = ReturnLayer("Wall")
		layer.scaleObjects(preferences.WallWidthRatio, preferences.WallHeightRatio, preferences.ImageSizeWidth, preferences.ImageSizeHeight)

		// Update Player Layer
		layer = ReturnLayer("Player")
		layer.scaleObjects(preferences.PlayerWidthRatio, preferences.PlayerHeightRatio, preferences.ImageSizeWidth, preferences.ImageSizeHeight)

		// Update Bomb Layer
		layer = ReturnLayer("Bomb")
		layer.scaleObjects(preferences.BombWidthRatio, preferences.BombHeightRatio, preferences.ImageSizeWidth, preferences.ImageSizeHeight)

		// Update Perk Layer
		layer = ReturnLayer("Perk")
		layer.scaleObjects(preferences.PerkWidthRatio, preferences.PerkHeightRatio, preferences.ImageSizeWidth, preferences.ImageSizeHeight)

		// Update Explosion Layer
		layer = ReturnLayer("Explosion")
		layer.scaleObjects(preferences.ExplosionWidthRatio, preferences.ExplosionHeightRatio, preferences.ImageSizeWidth, preferences.ImageSizeHeight)
	}
}
function ExplosionManager(preferences, layerManager, perkManager, explosionAudio)
{
	var World = preferences.World
	var BoardColSize = preferences.BoardColSize
	var BoardRowSize = preferences.BoardRowSize
	var PlayerLayer = layerManager.ReturnLayer("Player")
	var WallLayer = layerManager.ReturnLayer("Wall")
	var BombLayer = layerManager.ReturnLayer("Bomb")
	var ExplosionLayer = layerManager.ReturnLayer("Explosion")
	var ExplosionAudio = explosionAudio

	// Perk Manager to manage perks
	var perkManager = perkManager

	// Process Bomb dropped 
	this.DropBomb = function (playerIndex, type)
	{
		// Verify that player exist
		if(preferences.Players[playerIndex] instanceof Player)
		{
			// Get player from Players array in preference
			var player = preferences.Players[playerIndex]

			// Verify there isnt a bomb already there
			if(!(BombLayer.getObjectAt(player.getCol(), player.getRow()) instanceof Bomb))
			{
				// Create bomb
				var bomb = new Bomb(preferences, player.getCol(), player.getRow(), 
					player.getCol() * preferences.ImageSizeWidth, player.getRow() * preferences.ImageSizeHeight, type)

				// Add bomb to layer
				BombLayer.Add(bomb)

				// Add the bomb event - last parm is the callback function's args
				World.time.events.add(Phaser.Timer.SECOND * bomb.getFuse(), BombExploded, this, bomb)
			}
		}
	}

	// Bomb exploded Event
	function BombExploded(bomb)
	{
		// Remove the bomb 
		//BombLayer.Remove(bomb)
		bomb.isExploding()

		// Play explosion audio
		ExplosionAudio.play()

		// Add explosions based on the bomb type
		switch(bomb.getType())
		{
			case "Normal":
				NormalBombExplosion(bomb)
				break;
			case "Vertical":
				VerticalBombExplosion(bomb)
				break;
			case "Horizontal":
				HorizontalBombExplosion(bomb)
				break;
			case "Super":
				SuperBombExplosion(bomb)
			default:
				break;
		}

		// Remove the bomb after some time for animation to play through
		RemoveBomb(bomb);
	}

	// Adds explosion images
	function AddExplosion(col, row)
	{
		if(WallLayer.getObjectAt(col,row) instanceof Wall)
		{
			if(WallLayer.getObjectAt(col,row).getCanBreak())
			{
				// Create explosion
				var explosion = new Explosion(preferences, col, row, col * preferences.ImageSizeWidth, row * preferences.ImageSizeHeight)
				// Add it to layer
				ExplosionLayer.Add(explosion)

				//Add remove explosion event
				World.time.events.add(Phaser.Timer.SECOND, 
				function(explosion, WallLayer) {
						// remove explosion from explosion layer
						ExplosionLayer.Remove(explosion)
					}, 
				this, explosion, WallLayer)
			}
		}
		// only add explosion if there isnt one there already
		else if(!(ExplosionLayer.getObjectAt(col,row) instanceof Explosion))
		{
			// Create explosion
			var explosion = new Explosion(preferences, col, row, col * preferences.ImageSizeWidth, row * preferences.ImageSizeHeight)
			// Add it to layer
			ExplosionLayer.Add(explosion)
			//Add remove explosion event
			World.time.events.add(Phaser.Timer.SECOND * .5, 
			function(explosion, WallLayer) {
					// remove explosion from explosion layer
					ExplosionLayer.Remove(explosion)
					/*
					// Let explosion animation play before ending the game
					if(preferences.Players.length <= 1)
					{
						if(preferences.Players.length == 1)
						{
							// last player in array is the winner
							Bomberman.Network.send({
								evt: 'gameOver',
								data: {Winner : "haha"},
							});
						}
						else
						{
							Bomberman.Network.send({
								evt: 'gameOver',
								data: {Winner : null},
							});
						}
					}
					*/
				}, 
			this, explosion, WallLayer)
		}
	}

	/******************************************************************************
						Different Types of Bombs
	******************************************************************************/

	function NormalBombExplosion(bomb)
	{
		var col = bomb.getCol()
		var row = bomb.getRow()

		// Remove walls
	    for(var i = -1; i <= 1; i += 2)
		{
			var wallOne = WallLayer.getObjectAt(col+i, row)
			var wallTwo = WallLayer.getObjectAt(col, row+i)

			var playerLocOne = PlayerLayer.getObjectAt(col+i, row)
			var playerLocTwo = PlayerLayer.getObjectAt(col,row+i)

			if(wallOne instanceof Wall)
			{
				if(perkManager.RemoveWall(wallOne))
					AddExplosion(col+i, row)	
			}

			// Check if you can add explosion at where wall one is suppose to be
			if(col+i >=0 && col+i < BoardColSize && row >=0 && row < BoardRowSize)
				AddExplosion(col+i, row)

			if(wallTwo instanceof Wall)
			{
				if(perkManager.RemoveWall(wallTwo))
					AddExplosion(col, row+i)
			}

			// Check if you can add explosion at where wall two is suppose to be
			if(col+i >=0 && col+i < BoardColSize && row >=0 && row < BoardRowSize)
				AddExplosion(col, row+i)

			if(playerLocOne instanceof Player)
			{
				PlayerDiedEvent(playerLocOne.getName())
			}

			if(playerLocTwo instanceof Player)
			{
				PlayerDiedEvent(playerLocTwo.getName())
			}
		}

		// Special case when player is on the bomb
		var player = PlayerLayer.getObjectAt(col, row)
		
		if(player instanceof Player)
		{
			PlayerDiedEvent(player.getName())
		}
	}

	// Vertical Bomb
	function VerticalBombExplosion(bomb)
	{
		var col = bomb.getCol()
		var row = bomb.getRow()

		// Check above the bomb
	    for(var i = row; i >= 0; i--)
		{
			var wall = WallLayer.getObjectAt(col, i)
			var player = PlayerLayer.getObjectAt(col, i)

			// Add explosion
			AddExplosion(col,i)

			if(wall instanceof Wall)
			{
				perkManager.RemoveWall(wall)
				// Stop, dont explode pass 1 wall
				break;
			}

			if(player instanceof Player)
			{
				PlayerDiedEvent(player.getName())
			}
		}

		// Check Below the bomb
	    for(var i = row; i < BoardRowSize; i++)
		{
			var wall = WallLayer.getObjectAt(col, i)
			var player = PlayerLayer.getObjectAt(col, i)

			// Add explosion
			AddExplosion(col,i)

			if(wall instanceof Wall)
			{
				perkManager.RemoveWall(wall)	
				// Stop, dont explode pass 1 wall
				break;
			}

			if(player instanceof Player)
			{
				PlayerDiedEvent(player.getName())
			}
		}

		// Special case when player is on the bomb
		var player = PlayerLayer.getObjectAt(col, row)
		
		if(player instanceof Player)
		{
			PlayerDiedEvent(player.getName())
		}

	}

	// Super Bomb that destroys all breakable walls
	function SuperBombExplosion(bomb)
	{
		for(var i = 0; i < BoardColSize; i++)
		{
			for(var j = 0; j < BoardRowSize; j++)
			{
				var wall = WallLayer.getObjectAt(i, j)
				if(wall instanceof Wall)
				{
					perkManager.RemoveWall(wall)

					// Add explosion
					AddExplosion(i,j)
				}
			}
		}
	}


	// Vertical Bomb
	function HorizontalBombExplosion(bomb)
	{
		var col = bomb.getCol()
		var row = bomb.getRow()

		// Check left side of the bomb
	    for(var i = col; i >= 0; i--)
		{
			var wall = WallLayer.getObjectAt(i, row)
			var player = PlayerLayer.getObjectAt(i, row)

			// Add explosion
			AddExplosion(i,row)

			if(wall instanceof Wall)
			{
				perkManager.RemoveWall(wall)
				// Stop, dont explode pass 1 wall
				break;
			}

			if(player instanceof Player)
			{
				PlayerDiedEvent(player.getName())
			}
		}

		// Check Below the bomb
	    for(var i = col; i < BoardColSize; i++)
		{
			var wall = WallLayer.getObjectAt(i, row)
			var player = PlayerLayer.getObjectAt(i, row)

			// Add explosion
			AddExplosion(i,row)

			if(wall instanceof Wall)
			{
				perkManager.RemoveWall(wall)
				// Stop, dont explode pass 1 wall
				break;
			}

			if(player instanceof Player)
			{
				PlayerDiedEvent(player.getName())
			}
		}

		// Special case when player is on the bomb
		var player = PlayerLayer.getObjectAt(col, row)
		
		if(player instanceof Player)
		{
			PlayerDiedEvent(player.getName())
		}

	}

	// Removes bomb after animation is done
	function RemoveBomb(bomb)
	{
		if(bomb instanceof Bomb)
		{
			World.time.events.add(Phaser.Timer.SECOND * .5, 
			function(bomb, BombLayer) {
					// remove explosion from explosion layer
					BombLayer.Remove(bomb)
					ExplosionAudio.stop()
				}, 
			this, bomb, BombLayer)
		}
	}


/******************************************************************************
					Player's Died Logic
******************************************************************************/
	function PlayerDiedEvent (playerId)
	{
		// send player died event
		Bomberman.Network.send({
			evt: 'playerDied',
			data: {playerId : playerId},
		});
	}

	// Removes a dead player
	this.PlayerDied = function (playerId)
	{
		World.time.events.add(Phaser.Timer.SECOND * 1, 
			function() {
				for(var i = 0; i < preferences.Players.length; i++)
				{
					if(playerId === preferences.Players[i].getName())
					{
						PlayerLayer.Remove(preferences.Players[i]);
						preferences.Players.splice(i,1);
					}
				}
			}, 
		this)
	}

	// Removes a dead player - private duplicate function to maintain
	// code structure
	function PlayerDied(playerId)
	{
		World.time.events.add(Phaser.Timer.SECOND * 1, 
			function() {
				for(var i = 0; i < preferences.Players.length; i++)
				{
					if(playerId === preferences.Players[i].getName())
					{
						PlayerLayer.Remove(preferences.Players[i]);
						preferences.Players.splice(i,1);
					}
				}
			}, 
		this)
	}
}
function PlayerManager(preferences, layerManager, explosionManager)
{
	var playerID = ["Player 1", "Player 2", "Player 3", "Player 4"]

	// Stops a player's animation
	this.stopAnimation = function(id)
	{
		(id <= 3 && id >= 0)
		{
			// Get player from preference
			var player = preferences.Players[id]
			
			if(player instanceof Player)
			{	
				player.animate("stop")
			}
		}
	}

	// returns the index that the player referenced by id is currently at
	this.getIndexFromId = function(id)
	{
		var Players = preferences.Players;
		 // Associate Id to player - indexof didnt work
  		for(var i = 0; i < Players.length; i++)
  		{
  			if(Players[i].getName() === id)
  				return i;
  		}
	}

	// Checks to see if a player still exists
	this.PlayerExists = function(id)
	{
		var Players = preferences.Players;
		for(var i = 0; i < Players.length; i++)
		{
			if (Players[i].getName() === id)
				return true
		}
		return false
	}

	/* Moves a player to the new location
	 	id : 0 - Player 1
			 1 - Player 2
			 2 - Player 3
			 3 - Player 4
		direction: 	0 - Up
					1 - Down
					2 - Left
					3 - Right
	*/
	this.MovePlayer = function(id, direction)
	{
		if(direction <= 3 && direction >= 0)
		{
			// Get data from preference
			var player = preferences.Players[this.getIndexFromId(id)]
			var moveValue = preferences.MoveValue
			
			if(player instanceof Player)
			{	
				// Get current position to revert player if needed			
				var curX = player.getPosX()
				var curY = player.getPosY()
				
				switch(direction)
				{
					case 0:
						player.setPosY(player.getPosY() - moveValue, false)
						break;
					case 1:
						player.setPosY(player.getPosY() + moveValue, false)
						break;	
					case 2:
						player.setPosX(player.getPosX() - moveValue, false)
						break;
					case 3:
						player.setPosX(player.getPosX() + moveValue, false)
						break;
					default : 
						console.log("invalid move command")
						break;
				}

				// return player to previous position if collides with wall
				if(layerManager.ReturnLayer("Wall").collisionWith(player) && !player.GhostMode)
				{
					player.setPosX(curX, true)
					player.setPosY(curY, true)
				}

				//host only
				if(Bomberman.Network.host.open)
				{ 
					// Checks to see if any players died 
					explosionCheck()
				}

				// Update player data and layermanager
				player.update()
				layerManager.ReturnLayer("Player").newBoard(preferences.Players)
			}
		}
	}

	// Checks if any players died from an explosion
	function explosionCheck()
	{
		var playerLayer = layerManager.ReturnLayer("Player");
		var explosionLayer = layerManager.ReturnLayer("Explosion");
		for(var i = 0; i < preferences.BoardColSize; i++)
		{
			for(var j = 0; j < preferences.BoardRowSize; j++)
			{
				if((playerLayer.getObjectAt(i,j) instanceof Player) &&
					(explosionLayer.getObjectAt(i,j) instanceof Explosion))
				{
					Bomberman.Network.send({
						evt: 'playerDied',
						data: {playerId: playerLayer.getObjectAt(i,j).Name},
					});
				}
			}
		}
	}

	this.gameOverCheck = function()
	{
		// Only the host can decide if game is over
		if(preferences.Players.length <= 1)
		{
			if(preferences.Players.length == 1)
			{
				// last player in array is the winner
				Bomberman.Network.send({
					evt: 'gameOver',
					data: {Winner : preferences.Players[0].Name},
				});
			}
			else
			{
				Bomberman.Network.send({
					evt: 'gameOver',
					data: {Winner : null},
				});
			}
		}
	}

	// Creates a new player if possible
	this.newPlayer = function(id)
	{
		if(preferences.Players.length < 4)
		{
			var col = 0
			var row = 0

			// Decide where the player goes
			switch(preferences.Players.length+1)
			{
				case 1:
					col = 0
					row = 0
					break;
				case 2:
					col = preferences.BoardColSize - 1
					row = 0
					break;
				case 3:
					col = 0
					row = preferences.BoardRowSize - 1
					break;
				case 4:
					col = preferences.BoardColSize - 1
					row = preferences.BoardRowSize - 1
					break;
				default:
					console.log("Could not generate player. Size is: "+preferences.Players.length)
					return;
			}

			// Create the player with the right location data
			var player = new Player(preferences, id, col, row, col*preferences.ImageSizeWidth+10, row*preferences.ImageSizeHeight+10)

			// Add player to world
			preferences.Players.push(player)
			layerManager.ReturnLayer("Player").Add(player)

			// Return the index value that the player belongs to in the Players array
			return preferences.Players.length-1

		}
	}
}
function Preferences(world, players)
{
	this.World = world
	this.BoardColSize = 15
	this.BoardRowSize =  9
	this.Players = players

	// Window Data
	this.WindowWidth = document.getElementById('game').offsetWidth 
	this.WindowHeight = document.getElementById('game').offsetHeight

	// Image size for bombs/walls
	this.ImageSizeWidth = this.WindowWidth / this.BoardColSize
	this.ImageSizeHeight = this.WindowHeight / this.BoardRowSize

	// Background Data
	this.BgWidth = game.cache.getImage('background').width
	this.BgHeight = game.cache.getImage('background').height
	this.BgWidthRatio = this.WindowWidth / this.BgWidth
	this.BgHeightRatio = this.WindowHeight / this.BgHeight

	// Player Data
	this.PlayerWidth = game.cache.getImage('bomberman').width
	this.PlayerHeight = game.cache.getImage('bomberman').height
	this.PlayerWidthRatio = this.ImageSizeWidth / this.PlayerWidth * .8
	this.PlayerHeightRatio = this.ImageSizeHeight / this.PlayerHeight * .8

	// Wall Data
	this.WallWidth = game.cache.getImage('breakableWall').width
	this.WallHeight = game.cache.getImage('breakableWall').height
	this.WallWidthRatio = this.ImageSizeWidth  / this.WallWidth
	this.WallHeightRatio = this.ImageSizeHeight / this.WallHeight

	// Perk Data
	this.PerkWidth = game.cache.getImage('normalBombPerk').width
	this.PerkHeight = game.cache.getImage('normalBombPerk').height
	this.PerkWidthRatio = this.ImageSizeWidth  / this.PerkWidth
	this.PerkHeightRatio = this.ImageSizeHeight / this.PerkHeight

	// Bomb Data
	this.BombWidth = game.cache.getImage('bomb').width
	this.BombHeight = game.cache.getImage('bomb').height
	this.BombWidthRatio = this.ImageSizeWidth  / this.BombWidth
	this.BombHeightRatio = this.ImageSizeHeight / this.BombHeight

	// Explosion Data
	this.ExplosionWidth = game.cache.getImage('explosion').width
	this.ExplosionHeight = game.cache.getImage('explosion').height
	this.ExplosionWidthRatio = this.ImageSizeWidth  / this.ExplosionWidth
	this.ExplosionHeightRatio = this.ImageSizeHeight / this.ExplosionHeight

	// Calculate move value
	this.MoveValue = this.WindowWidth / (this.BoardColSize * 15)

	// public function to update all scale values
	this.updateScaleValues = function()
	{

		world.width = document.getElementById('game').offsetWidth
   		world.height = document.getElementById('game').offsetHeight

   		world.scale.refresh()

		// Window Data
		this.WindowWidth = document.getElementById('game').offsetWidth 
		this.WindowHeight = document.getElementById('game').offsetHeight

		// Image size for bombs/walls
		this.ImageSizeWidth = this.WindowWidth / this.BoardColSize
		this.ImageSizeHeight = this.WindowHeight / this.BoardRowSize

		// Background Data
		this.BgWidthRatio = this.WindowWidth / this.BgWidth
		this.BgHeightRatio = this.WindowHeight / this.BgHeight

		// Player Data
		this.PlayerWidthRatio = this.ImageSizeWidth / this.PlayerWidth * .8
		this.PlayerHeightRatio = this.ImageSizeHeight / this.PlayerHeight * .8

		// Wall Data
		this.WallWidthRatio = this.ImageSizeWidth  / this.WallWidth
		this.WallHeightRatio = this.ImageSizeHeight / this.WallHeight

		// Perk Data
		this.PerkWidthRatio = this.ImageSizeWidth  / this.PerkWidth
		this.PerkHeightRatio = this.ImageSizeHeight / this.PerkHeight

		// Bomb Data
		this.BombWidthRatio = this.ImageSizeWidth  / this.BombWidth
		this.BombHeightRatio = this.ImageSizeHeight / this.BombHeight

		// Explosion Data
		this.ExplosionWidthRatio = this.ImageSizeWidth  / this.ExplosionWidth
		this.ExplosionHeightRatio = this.ImageSizeHeight / this.ExplosionHeight


		// Calculate move value
		this.MoveValue = this.WindowWidth / (this.BoardColSize * 15)
	}

}
function PerkManager(preferences, layerManager, perkAudio)
{
	// World
	var World = preferences.World

	// Layers 
	var PerkLayer = layerManager.ReturnLayer("Perk")
	var WallLayer = layerManager.ReturnLayer("Wall")

	// Audio
	var PerkAudio = perkAudio

	// Array containing all the types of perks
	// This should match whats in the Perk Class's constructor
	var PerkTypes = ["NormalBombPerk",
					 "HorizontalBombPerk",
					 "VerticalBombPerk"
					]

	// Returns true if a wall was removed
	// Adds perk if lucky
	this.RemoveWall = function(wall)
	{
		if(wall.getCanBreak() == true)
		{
			var col = wall.getCol(), row = wall.getRow()
			WallLayer.Remove(wall)
			if( Math.floor((Math.random() * 100) + 1) <= 15)
				PerkLayer.Add(this.RandomPerk(col, row))
			return true
		}	
	}

	// Returns a random perk
	this.RandomPerk = function(col, row)
	{
		var randomType = PerkTypes[Math.floor((Math.random() * PerkTypes.length))]
		return new Perk(preferences, col, row, col*preferences.ImageSizeWidth, row*preferences.ImageSizeHeight, randomType)
	}

	// Check if a player is on a perk
	this.Update = function()
	{
		if(preferences.Players.length > 0)
		{
			for(var i = 0; i < preferences.Players.length; i++)
			{
				var col = preferences.Players[i].getCol(), row = preferences.Players[i].getRow()
				if(PerkLayer.getObjectAt(col, row) instanceof Perk)
				{
					// Apply perk if user is on a perk
					this.ApplyPerk(preferences.Players[i], PerkLayer.getObjectAt(col, row))

					// Play Music
					PerkAudio.play();

					//Add stop PerkAudio event
					World.time.events.add(Phaser.Timer.SECOND * .5, 
					function(perkAudio) {
							// stop audio
							perkAudio.stop();
						}, 
					this, PerkAudio);
				}
			}
		}
	}

	// Apply Perks to Players that are on top of it
	this.ApplyPerk = function(player, perk)
	{

		// remove perk
		PerkLayer.Remove(perk)

		// Apply perk to player
		switch(perk.getType())
		{
			case "NormalBombPerk" :
				player.setBombCount("Normal", player.getBombCount("Normal") + 3)
				break;
			case "HorizontalBombPerk" :
				player.setBombCount("Horizontal", player.getBombCount("Horizontal") + 3)
				break;
			case "VerticalBombPerk" :
				player.setBombCount("Vertical", player.getBombCount("Vertical") + 3)
				break;
			default:
				console.log("Invalid perk type to add")
				break;
		}
	}
}
function Perk (preferences, col, row, posX, posY, type) {

	this.type = type

	var sprite = null

	// Decode perk type
	switch(type)
	{
		case "NormalBombPerk" :
			sprite = 'normalBombPerk'
			break;
		case "HorizontalBombPerk" :
			sprite = 'horizontalBombPerk'
			break;
		case "VerticalBombPerk" :
			sprite = 'verticalBombPerk'
			break;
		default :
			break;
	}

	// Create the object based on the type
	// default will be normalbombperk to avoid any null errors in the future
	if( sprite != null)
	{
		GameObject.call(this, preferences.World, col, row, posX, posY, sprite)
	}
	else
	{
		this.type = "NormalBombPerk"
		GameObject.call(this, preferences.World, col, row, posX, posY, 'normalBombPerk')
	}

	// Scale the perks image properly
	this.getSprite().scale.setTo(preferences.PerkWidthRatio, preferences.PerkHeightRatio)


/******************************************************************************
							 Methods
******************************************************************************/
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

	Perk.prototype = Object.create(GameObject.prototype)
	Perk.prototype.constructor = Perk

/******************************************************************************
							End of Inheritance
******************************************************************************/

var MainMenu = function(game) {} 

MainMenu.prototype = {
  preload: function() { this.load.image('background', './static/img/titlescreen.jpg')},
  create:  function() {	// background
						var background = this.game.add.group();
				   		background.z = 1;
				   		background.add(this.game.add.sprite(0,0,'background'))},
  update:  function() {

		if(this.game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR, 10))
			this.game.state.start('Game');
  }
}

var Preloader = function(game) {
	var bg = null
	var image = null
	var scaleWidth = null
	var scaleHeight = null
	var ratio = 1;
} 

Preloader.prototype = {
  preload: function() { this.load.image('background', './static/img/titlescreen.jpg')
  						game.load.audio('intro', ['./static/audio/intro.mp3', './static/audio/intro.mp3']);
					  },
  create:  function() {	
  						// background
						var background = this.game.add.group();
				   		background.z = 1;
				   		bg = this.game.add.sprite(0,0,'background')

				   		// intro music
				   		this.introMusic = game.add.audio('intro', 1, true);
				   		this.introMusic.play();

				   		// Scales background image
				   		image = game.cache.getImage('background')

				   		scaleWidth = document.getElementById('game').offsetWidth / image.width 
				   	    scaleHeight = document.getElementById('game').offsetHeight / image.height 

				   		background.add(bg)
				   		
				   	    if(scaleWidth > scaleHeight)
				   	    {
				   	    	ratio = scaleWidth;
				   			bg.scale.setTo(ratio, ratio);
				   	    }
				   	    else 
				   	    {
				   	    	ratio = scaleHeight;
				   			bg.scale.setTo(ratio, ratio);
				   	    }

				   	    // fix out of focus
				   	     game.stage.disableVisibilityChange = true;
				   	  },
  update:  function() {

   		image = game.cache.getImage('background')

   		this.game.width = document.getElementById('game').offsetWidth
   		this.game.height = document.getElementById('game').offsetHeight

   		this.game.scale.refresh()

   		scaleWidth = document.getElementById('game').offsetWidth / image.width 
   	    scaleHeight = document.getElementById('game').offsetHeight / image.height 

/*
   	    console.log( "window: " + document.getElementById('game').offsetWidth )
   	    console.log( "window: " + document.getElementById('game').offsetHeight )
   	    console.log( "image: " +bg.width )

   	    console.log( "image: " + bg.height )
*/
   			
   		bg.scale.setTo(scaleWidth, scaleHeight);

    	game.scale.setScreenSize();

		//if(this.game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR, 10))
		//	this.game.state.start('Game');
  },

  shutdown: function() {
  		
  		// stop playing music
  		this.introMusic.stop();
  }
}
var Lobby = function(game) {} 

Lobby.prototype = {
  preload: function() { this.load.image('lobby', './static/img/lobby.jpg')},
  create:  function() {	// background
						var background = this.game.add.group();
				   		background.z = 1;
				   		background.add(this.game.add.sprite(0,0,'lobby'))},
  update:  function() {

		if(this.game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR, 10))
			this.game.state.start('Game');
  }
}   
var GameState = function(game) {
	this.player = null
	this.peers = null
	this.layerManager = null
	this.playerManager = null
	this.explosionManager = null
	this.perkManager = null
	this.preferences = null
	// Array to keep track of players
	this.Players = []
} 

GameState.prototype = {

  preload: function() 	{ 
							this.game.load.atlasJSONHash('bombermanAnimation', './static/img/Animations/Bomberman/sprite1Animation.png', './static/img/Animations/Bomberman/sprite1Animation.json');
							this.game.load.atlasJSONHash('explosionAnimation', './static/img/Animations/Explosion/explosionAnimation.png', './static/img/Animations/Explosion/explosionAnimation.json');
							this.game.load.atlasJSONHash('bombAnimation', './static/img/Animations/Bomb/bombAnimation.png', './static/img/Animations/Bomb/bombAnimation.json');
						    this.game.load.image('bomberman', './static/img/bomberman.png')
						    this.game.load.image('bomb', './static/img/bomb.png')
						    this.game.load.image('background', './static/img/background.png')
						    this.game.load.image('unbreakableWall', './static/img/unbreakableWall.jpg')
						    this.game.load.image('breakableWall', './static/img/breakableWall.png')
						    this.game.load.image('explosion', './static/img/explosion.png')
						   	this.game.load.image('normalBombPerk', './static/img/normalBombPerk.png')
						    this.game.load.image('horizontalBombPerk', './static/img/horizontalBombPerk.png')
						    this.game.load.image('verticalBombPerk', './static/img/verticalBombPerk.png')
						    game.load.audio('loop', ['./static/audio/bgMusic.mp3', './static/audio/bgMusic.mp3']);
						    game.load.audio('explosion', ['./static/audio/explosion.wav', './static/audio/explosion.wav']);
						    game.load.audio('powerup', ['./static/audio/powerup.wav', './static/audio/powerup.wav']);
					  	},
  create:  function()	{	
  							// Play Background music
  							this.bgMusic = game.add.audio('loop', 1, true);
				   			this.bgMusic.play();

				   			// Explosion Sound Sprite
				   			this.explosionMusic = game.add.audio('explosion', 1, true);

				   			// Powerup Sound Sprite
				   			this.powerUpMusic = game.add.audio('powerup', 1, true);

  							// Preferences
							this.preferences = new Preferences(this.game, this.Players)

							// background
							var background = this.game.add.group();
					   		background.z = 1;
					   		var bgSprite = this.game.add.sprite(0,0,'background')
					   		bgSprite.scale.setTo(this.preferences.BgWidthRatio, this.preferences.BgHeightRatio)

					   		background.add(bgSprite)

					   		// Managers
					   		this.layerManager = new LayerManager(this.preferences)

					   		// Set up the layers for the world
					   		this.layerManager.SetUpWorld()

					   		// have to setup Perk Manager before Explosion Manager
					   		this.perkManager = new PerkManager(this.preferences, this.layerManager, this.powerUpMusic)

					   		// Set up the world before adding it to explosion manager
					   		this.explosionManager = new ExplosionManager(this.preferences, this.layerManager, this.perkManager, this.explosionMusic)

					   		// Set up player manager to manage all the players
					   		this.playerManager = new PlayerManager(this.preferences, this.layerManager, this.explosionManager)

							//this.player = game.state.states.Game.playerManager.newPlayer(Me.index)
							for(var i = 0; i < this.peers.length; i++)
							{
								this.playerManager.newPlayer(this.peers[i])
							}

							// Reference to this object
							var self = this

							// Resize window if window size changes
							$(window).resize(function() {
								// Update scale values
								self.preferences.updateScaleValues()
								// Update all layers
							  	self.layerManager.ScaleLayers()
							})
				   		},
  update:  function() 	{
  						if(this.playerManager.PlayerExists(this.playerID))
  						{
  							//this.player = this.playerManager.(this.playerID, this.peers)
							if (this.game.input.keyboard.isDown(Phaser.Keyboard.A))
							{
								//this.playerManager.movePlayer(this.player, 2)
								Bomberman.Network.send({
									evt: 'playerMoved',
									data: {PlayerID: this.playerID, Dir: 2},
								});
							}
							else if (this.game.input.keyboard.isDown(Phaser.Keyboard.D))
							{
								//this.playerManager.movePlayer(this.player, 3)
								Bomberman.Network.send({
									evt: 'playerMoved',
									data: {PlayerID: this.playerID, Dir: 3},
								});
							}
							else if (this.game.input.keyboard.isDown(Phaser.Keyboard.W))
							{
								//this.playerManager.movePlayer(this.player, 0)
								Bomberman.Network.send({
									evt: 'playerMoved',
									data: {PlayerID: this.playerID, Dir: 0},
								});
							}
							else if (this.game.input.keyboard.isDown(Phaser.Keyboard.S))
							{
								//this.playerManager.movePlayer(this.player, 1)
								Bomberman.Network.send({
									evt: 'playerMoved',
									data: {PlayerID: this.playerID, Dir: 1},
								});
							}
							else
							{
								this.playerManager.stopAnimation(this.player)
							}
							
							// check if spacebar was pressed / second param is for debouncing
							if(this.game.input.keyboard.justPressed(Phaser.Keyboard.F, 10))
							{
								//this.explosionManager.DropBomb(this.player, "Normal")
								Bomberman.Network.send({
									evt: 'bombDropped',
									data: {PlayerID: this.playerID, Type : "Normal"},
								});
							}

							if(this.game.input.keyboard.justPressed(Phaser.Keyboard.C, 10))
							{
								//this.explosionManager.DropBomb(this.player, "Vertical")
								Bomberman.Network.send({
									evt: 'bombDropped',
									data: {PlayerID: this.playerID, Type : "Vertical"},
								});
							}

							if(this.game.input.keyboard.justPressed(Phaser.Keyboard.V, 10))
							{
								//this.explosionManager.DropBomb(this.player, "Horizontal")
								Bomberman.Network.send({
									evt: 'bombDropped',
									data: {PlayerID: this.playerID, Type : "Horizontal"},
								});
							}

							if(this.game.input.keyboard.justPressed(Phaser.Keyboard.M, 10))
							{
								//this.explosionManager.DropBomb(this.player, "Super")
								Bomberman.Network.send({
									evt: 'bombDropped',
									data: {PlayerID: this.playerID, Type : "Super"},
								});
							}

							// update perks
							this.perkManager.Update()

							// Check to see if game is over
							this.playerManager.gameOverCheck()
						}
					  	},
	init: function(myId, peersID) 
						{
					  		this.playerID = myId;
					  		this.peers = peersID
					  	},
	shutdown: function() 
						{
					  		// stop playing music
					  		this.bgMusic.stop();
  						}
}
var GameOver = function(game) {
								this.winner = null
								var image = null
								var gameOverSprite = null
							  } 

GameOver.prototype = {
  preload: function() { 
  						this.load.image('gameover', './static/img/GameOver/gameover.png')
						this.load.image('gameover1', './static/img/GameOver/player1.png')
						this.load.image('gameover2', './static/img/GameOver/player2.png')
						this.load.image('gameover3', './static/img/GameOver/player3.png')
						this.load.image('gameover4', './static/img/GameOver/player4.png')
  						game.load.audio('credits', ['./static/audio/credits.mp3', './static/audio/credits.mp3']);
					  },
  create:  function() {	
  						// background
						var background = this.game.add.group();
				   		background.z = 1;
				   		var gameOverSpriteName = 'gameover';
				   		switch(this.winner)
				   		{
				   			case 0:
				   				gameOverSpriteName = 'gameover1';
				   				break;
				   			case 1:
				   				gameOverSpriteName = 'gameover2';
				   				break;
				   			case 2:
				   				gameOverSpriteName = 'gameover3';
				   				break;
				   			case 3: 
				   				gameOverSpriteName = 'gameover4';
				   				break;
				   			default:
				   				gameOverSpriteName = 'gameover';
				   				break;
				   		}
				   		gameOverSprite = this.game.add.sprite(0,0, gameOverSpriteName)
				   		background.add(gameOverSprite)

				   		image = game.cache.getImage('gameover')

				   		var scaleWidth = document.getElementById('game').offsetWidth / image.width 
				   	    var scaleHeight = document.getElementById('game').offsetHeight / image.height 

				   		gameOverSprite.scale.setTo(scaleWidth, scaleHeight)

				   		// Play Credits music
						this.creditsMusic = game.add.audio('credits', 1, true);
			   			this.creditsMusic.play();

			   			// renable start game button
						$('#game-start').prop('disabled', false)

				   	  },
  update:  function() {

		if(this.game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR, 10))	
			this.game.state.start('Preloader');

		image = game.cache.getImage('gameover')

   		this.game.width = document.getElementById('game').offsetWidth
   		this.game.height = document.getElementById('game').offsetHeight

   		this.game.scale.refresh()

   		scaleWidth = document.getElementById('game').offsetWidth / image.width 
   	    scaleHeight = document.getElementById('game').offsetHeight / image.height 
	
   		gameOverSprite.scale.setTo(scaleWidth, scaleHeight);

    	game.scale.setScreenSize();
  },

  init: function(winner) 
					{
				  		this.winner = winner;
				  	},

  shutdown: function() {
  		
  		// stop playing music
  		if(this.creditsMusic != null)
  			this.creditsMusic.stop();
  }
}
var game = new Phaser.Game("100", "100", Phaser.AUTO, 'game')
game.state.add('Preloader', Preloader)
game.state.add('Game', GameState)
game.state.add('GameOver', GameOver)
game.state.start('Preloader')


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

				// Create the wall
				var breakWall = new Wall(preferences, true, i, j, 
					i*preferences.ImageSizeWidth, j*preferences.ImageSizeHeight)

				// Scale the wall
			    breakWall.getSprite().scale.setTo(
			    	preferences.WallWidthRatio, preferences.WallHeightRatio)

				// Add the wall to board
				ReturnLayer("Wall").Add(breakWall, i, j)
			}

			// fills in first row with space
			if(i < preferences.BoardColSize && i > 2)
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
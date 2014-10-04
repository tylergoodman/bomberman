function LayerManager(preferences)
{
	var Layers = []
	var Preferences = preferences
	var World = preferences.World

	this.AddLayer = function(layer)
	{
		// Add layer to Layers array
		Layers.push(layer)

		// return layer so it can be assigned
		return layer
	}

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

	// Sets up the world based on the functions called in this method
	this.SetUpWorld = function()
	{
		// add unbreakable walls
		AddUnbreakableWalls()

		// add breakable walls
		AddBreakableWalls()

	}

	// Adds unbreakable walls to the right location
	function AddUnbreakableWalls()
	{
		for(var i = 1; i < Preferences.BoardColSize; i += 2)
		{
			for(var j = 1; j < Preferences.BoardRowSize; j+=2)
			{
				// Create the wall
				var unbreakWall = new Wall(World, false, i, j, 
					i*Preferences.ImageSize, j*Preferences.ImageSize)

				// Add the wall to board
				ReturnLayer("Wall").Add(unbreakWall, i, j)

			}
		}
	}

	// Adds breakable walls to the right location
	function AddBreakableWalls()
	{
		for(var i = 0; i < Preferences.BoardColSize; i++)
		{
			// fill in rows 1-8
			for(var j = 1; j < Preferences.BoardRowSize; j++)
			{
				// if col is odd than skip every other row to ignore unbreakable walls
				if(i % 2 == 1)
				{
					// extra increment to skip 1 block
					// on every other row
					j++
				}

				// Create the wall
				var breakWall = new Wall(World, true, i, j, 
					i*Preferences.ImageSize, j*Preferences.ImageSize)

				// Add the wall to board
				ReturnLayer("Wall").Add(breakWall, i, j)
			}

			// fills in first row with space
			if(i < Preferences.BoardColSize && i > 2)
			{
				var breakWall = new Wall(World, true, i, 0, 
					i*Preferences.ImageSize, 0)

				ReturnLayer("Wall").Add(breakWall, i, 0)
			}
		}
	}
}
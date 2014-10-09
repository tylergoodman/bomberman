function ExplosionManager(preferences, layerManager)
{
	var World = preferences.World
	var Players = preferences.Players
	var BoardColSize = preferences.BoardColSize
	var BoardRowSize = preferences.BoardRowSize
	var ImageSize = preferences.ImageSize
	var PlayerLayer = layerManager.ReturnLayer("Player")
	var WallLayer = layerManager.ReturnLayer("Wall")
	var BombLayer = layerManager.ReturnLayer("Bomb")
	var ExplosionLayer = layerManager.ReturnLayer("Explosion")

	// Process Bomb dropped 
	this.DropBomb = function (player, type)
	{
		// Create bomb
		var bomb = new Bomb(World, player.getCol(), player.getRow(), 
			player.getCol() * ImageSize, player.getRow() * ImageSize, type)

		// Add bomb to layer
		BombLayer.Add(bomb)

		// Add the bomb event - last parm is the callback function's args
		World.time.events.add(Phaser.Timer.SECOND * bomb.getFuse(), BombExploded, this, bomb)

		player.setBombCount(player.getBombCount() - 1)
	}

	// Bomb exploded Event
	function BombExploded(bomb)
	{
		// Remove the bomb 
		BombLayer.Remove(bomb)

		// Add explosions based on the bomb type
		switch(bomb.getType())
		{
			case "normal":
				NormalBombExplosion(bomb)
				break;
			case "vertical":
				VerticalBombExplosion(bomb)
				break;
			case "horizontal":
				HorizontalBombExplosion(bomb)
				break;
			default:
				break;
		}
	}

	// Adds explosion images
	function AddExplosion(col, row)
	{
		// only add explosion if there isnt one there already
		if(!(ExplosionLayer.getObjectAt(col,row) instanceof Explosion))
		{
			// Create explosion
			var explosion = new Explosion(World, col, row, col * ImageSize, row * ImageSize)
			// Add it to layer
			ExplosionLayer.Add(explosion)
			//Add remove explosion event
			World.time.events.add(Phaser.Timer.SECOND * .5, 
			function(explosion, WallLayer) {
					// remove explosion from explosion layer
					ExplosionLayer.Remove(explosion)
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
				if(wallOne.getCanBreak() == true)
				{
					WallLayer.Remove(wallOne)
				}	
			}

			// Check if you can add explosion at where wall one is suppose to be
			if(col+i >=0 && col+i < BoardColSize && row >=0 && row < BoardRowSize)
				AddExplosion(col+i, row)

			if(wallTwo instanceof Wall)
			{
				if(wallTwo.getCanBreak() == true)
				{
					WallLayer.Remove(wallTwo)
					AddExplosion(col, row+i)
				}	
			}

			// Check if you can add explosion at where wall two is suppose to be
			if(col+i >=0 && col+i < BoardColSize && row >=0 && row < BoardRowSize)
				AddExplosion(col, row+i)

			if(playerLocOne instanceof Player)
			{
				PlayerDied(playerLocOne)
			}

			if(playerLocTwo instanceof Player)
			{
				PlayerDied(playerLocTwo)
			}
		}

		// Add explosion
		AddExplosion(col,row)

		// Special case when player is on the bomb
		var player = PlayerLayer.getObjectAt(col, row)
		
		if(player instanceof Player)
		{
			PlayerDied(player)
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


			if(wall instanceof Wall)
			{
				if(wall.getCanBreak() == true)
				{
					WallLayer.Remove(wall)
				}	
				// Stop, dont explode pass 1 wall
				break;
			}

			if(player instanceof Player)
			{
				PlayerDied(player)
			}

			// Add explosion
			AddExplosion(col,i)
		}

		// Check Below the bomb
	    for(var i = row; i < BoardRowSize; i++)
		{
			var wall = WallLayer.getObjectAt(col, i)
			var player = PlayerLayer.getObjectAt(col, i)


			if(wall instanceof Wall)
			{
				if(wall.getCanBreak() == true)
				{
					WallLayer.Remove(wall)
				}	
				// Stop, dont explode pass 1 wall
				break;
			}

			if(player instanceof Player)
			{
				PlayerDied(player)
			}

			// Add explosion
			AddExplosion(col,i)
		}

		// Special case when player is on the bomb
		var player = PlayerLayer.getObjectAt(col, row)
		
		if(player instanceof Player)
		{
			PlayerDied(player)
		}

		// Add explosion
		AddExplosion(col,row)
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


			if(wall instanceof Wall)
			{
				if(wall.getCanBreak() == true)
				{
					WallLayer.Remove(wall)
				}	
				// Stop, dont explode pass 1 wall
				break;
			}

			if(player instanceof Player)
			{
				PlayerDied(player)
			}

			// Add explosion
			AddExplosion(i,row)
		}

		// Check Below the bomb
	    for(var i = col; i < BoardColSize; i++)
		{
			var wall = WallLayer.getObjectAt(i, row)
			var player = PlayerLayer.getObjectAt(i, row)


			if(wall instanceof Wall)
			{
				if(wall.getCanBreak() == true)
				{
					WallLayer.Remove(wall)
				}	
				// Stop, dont explode pass 1 wall
				break;
			}

			if(player instanceof Player)
			{
				PlayerDied(player)
			}

			// Add explosion
			AddExplosion(i,row)
		}

		// Special case when player is on the bomb
		var player = PlayerLayer.getObjectAt(col, row)
		
		if(player instanceof Player)
		{
			PlayerDied(player)
		}

		// Add explosion
		AddExplosion(col,row)
	}


/******************************************************************************
					Player's Died Logic
******************************************************************************/
	// Removes a dead player
	this.PlayerDied = function(player)
	{
		for(var i = 0; i < Players.length; i++)
		{
			if(player.getName() === Players[i].getName())
			{
				Players.splice(i,1);
				PlayerLayer.Remove(player);
			}
		}
	}

	// Removes a dead player - private duplicate function to maintain
	// code structure
	function PlayerDied(player)
	{
		for(var i = 0; i < Players.length; i++)
		{
			if(player.getName() === Players[i].getName())
			{
				Players.splice(i,1);
				PlayerLayer.Remove(player);
			}
		}
	}
}
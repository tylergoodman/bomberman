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

	// Process Bomb dropped 
	this.DropBomb = function (playerIndex, typeOfBomb)
	{
		// Verify that player exist
		if(preferences.Players[playerIndex] instanceof Player)
		{
			// Get player from Players array in preference
			var player = preferences.Players[playerIndex]

			// Verify there isnt a bomb already there
			if(!(BombLayer.getObjectAt(player.getCol(), player.getRow()) instanceof Bomb))
			{
				var type = typeOfBomb == "Normal" ? "Normal" : 
				(player.SpecialBombType != null ? player.SpecialBombType : null)

				if(typeOfBomb == "Super")
				{
					type = "Super"
				}
				if(type != null)
				{
					// Create bomb
					var bomb = new Bomb(preferences, player.getCol(), player.getRow(), 
						player.getCol() * preferences.ImageSizeWidth, player.getRow() * preferences.ImageSizeHeight, type)

					// Add bomb to layer
					BombLayer.Add(bomb)

					// Add the bomb event - last parm is the callback function's args
					World.time.events.add(Phaser.Timer.SECOND * bomb.getFuse(), BombExploded, this, bomb, player.BombRadius)
				}
			}
		}
	}

	// Bomb exploded Event
	function BombExploded(bomb, bombRadius)
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
				NormalBombExplosion(bomb, bombRadius)
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
				}, 
			this, explosion, WallLayer)
		}
	}

	/******************************************************************************
						Different Types of Bombs
	******************************************************************************/

	function NormalBombExplosion(bomb, bombRadius)
	{
		var col = bomb.getCol()
		var row = bomb.getRow()

		// right side of the horizontal explosion 
		for(var i = 0; i <= bombRadius; i++)
		{
			var wallOne = WallLayer.getObjectAt(col+i, row)
			var playerLocOne = PlayerLayer.getObjectAt(col+i, row)

			// remove wall if breakable and stop there
			// else if wall isnt breakable, stop there
			if(wallOne instanceof Wall)
			{
				if(perkManager.RemoveWall(wallOne))
					AddExplosion(col+i, row)	
				break;
			}

			// Check if you can add explosion at where wall one is suppose to be
			// This is to add an explosion even though the wall is gone
			if(col+i >=0 && col+i < BoardColSize && row >=0 && row < BoardRowSize)
				AddExplosion(col+i, row)

			if(playerLocOne instanceof Player)
			{
				PlayerDiedEvent(playerLocOne.getName())
			}
		}

		//left side of the horizontal explosion 
		for(var i = 0; i >= bombRadius * -1; i--)
		{
			var wallOne = WallLayer.getObjectAt(col+i, row)
			var playerLocOne = PlayerLayer.getObjectAt(col+i, row)

			// remove wall if breakable and stop there
			// else if wall isnt breakable, stop there
			if(wallOne instanceof Wall)
			{
				if(perkManager.RemoveWall(wallOne))
					AddExplosion(col+i, row)
				break;	
			}

			// Check if you can add explosion at where wall one is suppose to be
			// This is to add an explosion even though the wall is gone
			if(col+i >=0 && col+i < BoardColSize && row >=0 && row < BoardRowSize)
				AddExplosion(col+i, row)

			if(playerLocOne instanceof Player)
			{
				PlayerDiedEvent(playerLocOne.getName())
			}
		}

		// top side of the vertrical explosion 
		for(var i = 0; i <= bombRadius; i++)
		{
			var wallTwo = WallLayer.getObjectAt(col, row+i)
			var playerLocTwo = PlayerLayer.getObjectAt(col,row+i)


			// remove wall if breakable and stop there
			// else if wall isnt breakable, stop there
			if(wallTwo instanceof Wall)
			{
				if(perkManager.RemoveWall(wallTwo))
					AddExplosion(col, row+i)
				break;
			}

			// Check if you can add explosion at where wall two is suppose to be
			// This is to add an explosion even though the wall is gone
			if(col+i >=0 && col+i < BoardColSize && row >=0 && row < BoardRowSize)
				AddExplosion(col, row+i)

			if(playerLocTwo instanceof Player)
			{
				PlayerDiedEvent(playerLocTwo.getName())
			}

		}

		// bottom side of the vertrical explosion 
		for(var i = 0; i >= bombRadius * -1; i--)
		{
			var wallTwo = WallLayer.getObjectAt(col, row+i)
			var playerLocTwo = PlayerLayer.getObjectAt(col,row+i)


			// remove wall if breakable and stop there
			// else if wall isnt breakable, stop there
			if(wallTwo instanceof Wall)
			{
				if(perkManager.RemoveWall(wallTwo))
					AddExplosion(col, row+i)
				break;
			}

			// Check if you can add explosion at where wall two is suppose to be
			// This is to add an explosion even though the wall is gone
			if(col+i >=0 && col+i < BoardColSize && row >=0 && row < BoardRowSize)
				AddExplosion(col, row+i)

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
		if(Bomberman.Network.host.open)
		{ 
			// send player died event
			Bomberman.Network.send({
				evt: 'playerDied',
				data: {playerId : playerId},
			});
		}
	}

	// Removes a dead player
	this.PlayerDied = function (playerId)
	{
		// only host can kill someone
		World.time.events.add(Phaser.Timer.SECOND * 0.5, 
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
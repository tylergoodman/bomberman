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
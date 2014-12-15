function PlayerManager(preferences, layerManager, explosionManager)
{
	var playerID = ["Player 1", "Player 2", "Player 3", "Player 4"]

	// Stops a player's animation
	this.stopAnimation = function(id)
	{
		var playerId = this.getIndexFromId(id);

		(playerId <= 3 && playerId >= 0)
		{
			// Get player from preference
			var player = preferences.Players[playerId]
			
			if(player instanceof Player)
			{	
				player.animate("stop")
			}
		}
	}

	// This will pause animations if a player has not moved in the past .5 second
	this.UpdateAnimations = function()
	{
		for(var i = 0; i < preferences.Players.length; i++)
		{
			if(preferences.Players[i].MovedRecently)
			{
				this.playerManager.stopAnimation(preferences.Players[i].getName());
				preferences.Players[i].MovedRecently = false;
			}
		}
	}


	// This will send peers the location of all players
	// This method sends ratios so that other window sizes can move sync accordingly
	this.BeginSync = function()
	{
		var data = []

		for(var i = 0; i < preferences.Players.length; i++)
		{
			data.add( {
						ID: preferences.Players[i].getName(),
						X: 	(preferences.Players[i].getPosX() % preferences.ImageSizeWidth) / preferences.ImageSizeWidth,
						XFactor: Math.floor(preferences.Players[i].getPosX() / preferences.ImageSizeWidth),
						Y: 	(preferences.Players[i].getPosY() % preferences.ImageSizeHeight) / preferences.ImageSizeHeight,
					  	YFactor: Math.floor(preferences.Players[i].getPosY() / preferences.ImageSizeHeight)
					  }
					)
		}

		// tell all clients to update
		Bomberman.Network.send({
			evt: 'SyncPlayers',
			data: {SyncData: data},
		});


	}


	// This will update all players
	this.SyncPlayers = function(data)
	{
		for(var j = 0; j < data.length; j++)
		{
			for(var i = 0; i < preferences.Players.length; i++)
			{
				if(preferences.Players[i].getName() === data[j].ID)
				{
					// calculate new x and y position
					var newPosX = 
						data[j].XFactor * preferences.ImageSizeWidth + data[j].X * preferences.ImageSizeWidth
					var newPosY = 
						data[j].YFactor * preferences.ImageSizeHeight + data[j].Y * preferences.ImageSizeHeight
					preferences.Players[i].setPosX(newPosX, false)
					preferences.Players[i].setPosY(newPosY, false)
					preferences.Players[i].update()
				}
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
			var moveValue = 0;
			if(direction == 0 || direction == 1)
			{
				moveValue = preferences.MoveValueY
			}
			else
			{
				moveValue = preferences.MoveValueX
			}
			
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

				// Set the moved recently flag
				player.MovedRecently = true

				/* Attempted close collision issue
				var withinException = layerManager.ReturnLayer("Wall").withinCollisionException(player)
				if(withinException != null)
				{
					player.setPosX(withinException.newX, true)
					player.setPosY(withinException.newY, true)	
				}
				*/

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
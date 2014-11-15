function PlayerManager(preferences, layerManager, explosi)
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
	this.movePlayer = function(id, direction)
	{
		if(id <= 3 && id >= 0 && direction <= 3 && direction >= 0)
		{
			// Get data from preference
			var player = preferences.Players[id]
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

				// Player dies if he/she collides with explosion
				if(layerManager.ReturnLayer("Explosion").collisionWith(player) && !player.GhostMode)
				{
					explosionManager.PlayerDied(this.player)
				}

				// Update player data and layermanager
				player.update()
				layerManager.ReturnLayer("Player").newBoard(preferences.Players)
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
			var player = new Player(preferences, id, col, row, col*preferences.ImageSizeWidth, row*preferences.ImageSizeHeight)

			// Add player to world
			preferences.Players.push(player)
			layerManager.ReturnLayer("Player").Add(player)


			console.log("worked")
			// Return the index value that the player belongs to in the Players array
			return preferences.Players.length-1

		}
	}
}
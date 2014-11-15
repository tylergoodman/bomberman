function PlayerManager(preferences, layerManager)
{
	var playerID = ["Player 1", "Player 2", "Player 3", "Player 4"]

	// Creates a new player if possible
	this.newPlayer = function()
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
			var player = new Player(preferences, playerID[preferences.Players.length], col, row, col*preferences.ImageSizeWidth, row*preferences.ImageSizeHeight)

			// Add player to world
			preferences.Players.push(player)
			layerManager.ReturnLayer("Player").Add(player)

			return player
		}
	}
}
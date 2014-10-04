function ExplosionManager(preferences, layerManager)
{
	var World = preferences.World
	var Players = preferences.Players
	var BoardColSize = preferences.BoardColSize
	var BoardRowSize = preferences.BoardRowSize
	var ImageSize = preferences.ImageSize
	var LayerManager = layerManager

	// Process Bomb dropped 
	this.DropBomb = function (player)
	{
		// Create bomb
		var bomb = new Bomb(World, player.getCol(), player.getRow(), 
			player.getCol() * ImageSize, player.getRow() * ImageSize)

		// Add bomb to layer
		LayerManager.ReturnLayer("Bomb").Add(bomb)

		// Add the bomb event - last parm is the callback function's args
		World.time.events.add(Phaser.Timer.SECOND * bomb.getFuse(), this.BombExploded, this, bomb)

		player.setBombCount(player.getBombCount() - 1)
	}

	// Bomb exploded Event
	this.BombExploded = function(bomb)
	{
		// define layers
		var bombLayer = LayerManager.ReturnLayer("Bomb")
		var wallLayer = LayerManager.ReturnLayer("Wall")
		var playerLayer = LayerManager.ReturnLayer("Player")

		bombLayer.Remove(bomb)

		var col = bomb.getCol()
		var row = bomb.getRow()

	    for(var i = -1; i <= 1; i += 2)
		{
			var wallOne = wallLayer.getObjectAt(col+i, row)
			var wallTwo = wallLayer.getObjectAt(col, row+i)

			var playerLocOne = playerLayer.getObjectAt(col+i, row)
			var playerLocTwo = playerLayer.getObjectAt(col,row+i)

			if(wallOne instanceof Wall)
			{
				if(wallOne.getCanBreak() == true)
				{
					wallLayer.Remove(wallOne)
				}	
			}
			if(wallTwo instanceof Wall)
			{
				if(wallTwo.getCanBreak() == true)
				{
					wallLayer.Remove(wallTwo)
				}	
			}

			if(playerLocOne instanceof Player)
			{
				this.PlayerDied(playerLocOne, LayerManager)
			}

			if(playerLocTwo instanceof Player)
			{
				this.PlayerDied(playerLocTwo, LayerManager)
			}
		}

		// Adds explosions
		this.AddExplosion(col, row);

		// Special case when player is on the bomb
		var player = playerLayer.getObjectAt(col, row)
		if(player instanceof Player)
		{
			this.PlayerDied(player.LayerManager)
		}
	}

	// Adds explosion images
	this.AddExplosion = function(col, row)
	{

		// define layers
		var explosionLayer = LayerManager.ReturnLayer("Explosion")
		var wallLayer = LayerManager.ReturnLayer("Wall")

		// Array to store explosion - fire area
		var explosions = [];

		for(var i = -1; i <= 1; i += 2)
		{
			var explodeOne = explosionLayer.getObjectAt(col+i, row);
			var explodeTwo = explosionLayer.getObjectAt(col, row+i);
			var wallOne = wallLayer.getObjectAt(col+i, row);
			var wallTwo = wallLayer.getObjectAt(col, row+i);

			if(explodeOne == undefined && col+i >= 0 && col+i < BoardColSize)
			{
				if(wallOne == undefined)
				{
					var explosion = new Explosion(World, col+i, row, (col+i) * ImageSize, row * ImageSize);
					explosionLayer.Add(explosion);
					explosions.push(explosion)
				}
				else
				{
					if(wallOne.getCanBreak())
					{
						var explosion = new Explosion(World, col+i, row, (col+i) * ImageSize, row * ImageSize);
						explosionLayer.Add(explosion);
						explosions.push(explosion)
					}
				}
			}

			if(explodeTwo == undefined && row+i >= 0 && row+i < BoardRowSize)
			{
				if(wallTwo == undefined)
				{
					var explosion = new Explosion(World, col, row+i, col * ImageSize, (row+i) * ImageSize);
					explosionLayer.Add(explosion);
					explosions.push(explosion)
				}
				else
				{
					if(wallTwo.getCanBreak())
					{
						var explosion = new Explosion(World, col, row+i, col * ImageSize, (row+i) * ImageSize);
						explosionLayer.Add(explosion);
						explosions.push(explosion)
					}
				}
			}
		}
		
		// remove explosions event
		World.time.events.add(Phaser.Timer.SECOND * .5, 
			function(explosions, wallLayer) {
				for(var i = 0; i < explosions.length; i++) 
				{
					// remove breakable wall after explosion / explosions can only spawn on breakable walls / no wall
					var wall = wallLayer.getObjectAt(explosions[i].getCol(), explosions[i].getRow())
					if(wall != undefined)
					{
						wallLayer.remove(wall)
					}

					// remove explosion from explosion layer
					explosionLayer.Remove(explosions[i])}
				}, 
		this, explosions, wallLayer)
	}

	// Removes a dead player
	this.PlayerDied = function(player, layerManager)
	{
		for(var i = 0; i < Players.length; i++)
		{
			if(player.getName() === Players[i].getName())
			{
				Players.splice(i,1);
				layerManager.ReturnLayer("Player").Remove(player);
			}
		}
	}
}
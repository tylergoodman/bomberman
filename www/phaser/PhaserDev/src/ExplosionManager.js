function ExplosionManager(world, players, boardColSize, boardRowSize, imageSize)
{
	var World = world

	this.Players = players
	this.BoardColSize = boardColSize
	this.BoardRowSize = boardRowSize
	this.ImageSize = imageSize

	// Process Bomb dropped 
	this.DropBomb = function (player, layerManager)
	{
		// Create bomb
		var bomb = new Bomb(World, player.getCol(), player.getRow(), 
			player.getCol() * this.ImageSize, player.getRow() * this.ImageSize)

		// Add bomb to layer
		layerManager.ReturnLayer("Bomb").Add(bomb)

		// Add the bomb event - last parm is the callback function's args
		World.time.events.add(Phaser.Timer.SECOND * bomb.getFuse(), this.BombExploded, this, bomb, layerManager)

		player.setBombCount(player.getBombCount() - 1)
	}

	// Bomb exploded Event
	this.BombExploded = function(bomb, layerManager)
	{
		// define layers
		var bombLayer = layerManager.ReturnLayer("Bomb")
		var wallLayer = layerManager.ReturnLayer("Wall")
		var playerLayer = layerManager.ReturnLayer("Player")

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
				this.PlayerDied(playerLocOne, layerManager)
			}

			if(playerLocTwo instanceof Player)
			{
				this.PlayerDied(playerLocTwo, layerManager)
			}
		}

		// Adds explosions
		this.AddExplosion(col, row, layerManager);

		// Special case when player is on the bomb
		var player = playerLayer.getObjectAt(col, row)
		if(player instanceof Player)
		{
			PlayerDied(player)
		}
	}

	// Adds explosion images
	this.AddExplosion = function(col, row, layerManager)
	{

		// define layers
		var explosionLayer = layerManager.ReturnLayer("Explosion")
		var wallLayer = layerManager.ReturnLayer("Wall")

		// Array to store explosion - fire area
		var explosions = [];

		for(var i = -1; i <= 1; i += 2)
		{
			var explodeOne = explosionLayer.getObjectAt(col+i, row);
			var explodeTwo = explosionLayer.getObjectAt(col, row+i);
			var wallOne = wallLayer.getObjectAt(col+i, row);
			var wallTwo = wallLayer.getObjectAt(col, row+i);

			if(explodeOne == undefined && col+i >= 0 && col+i < this.BoardColSize)
			{
				if(wallOne == undefined)
				{
					var explosion = new Explosion(World, col+i, row, (col+i) * this.ImageSize, row * this.ImageSize);
					explosionLayer.Add(explosion);
					explosions.push(explosion)
				}
				else
				{
					if(wallOne.getCanBreak())
					{
						var explosion = new Explosion(World, col+i, row, (col+i) * this.ImageSize, row * this.ImageSize);
						explosionLayer.Add(explosion);
						explosions.push(explosion)
					}
				}
			}

			if(explodeTwo == undefined && row+i >= 0 && row+i < this.BoardRowSize)
			{
				if(wallTwo == undefined)
				{
					var explosion = new Explosion(World, col, row+i, col * this.ImageSize, (row+i) * this.ImageSize);
					explosionLayer.Add(explosion);
					explosions.push(explosion)
				}
				else
				{
					if(wallTwo.getCanBreak())
					{
						var explosion = new Explosion(World, col, row+i, col * this.ImageSize, (row+i) * this.ImageSize);
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
		for(var i = 0; i < this.Players.length; i++)
		{
			if(player.getName() === this.Players[i].getName())
			{
				this.Players.splice(i,1);
				layerManager.ReturnLayer("Player").Remove(player);
			}
		}
	}
}
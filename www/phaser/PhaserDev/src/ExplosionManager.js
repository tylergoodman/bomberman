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
	this.DropBomb = function (player)
	{
		// Create bomb
		var bomb = new Bomb(World, player.getCol(), player.getRow(), 
			player.getCol() * ImageSize, player.getRow() * ImageSize, "normal")

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
			default:
				break;
		}
	}

	// Adds explosion images
	function AddExplosion(col, row)
	{

		// Array to store explosion - fire area
		var explosions = [];

		for(var i = -1; i <= 1; i += 2)
		{
			var explodeOne = ExplosionLayer.getObjectAt(col+i, row);
			var explodeTwo = ExplosionLayer.getObjectAt(col, row+i);
			var wallOne = WallLayer.getObjectAt(col+i, row);
			var wallTwo = WallLayer.getObjectAt(col, row+i);

			if(explodeOne == undefined && col+i >= 0 && col+i < BoardColSize)
			{
				if(wallOne == undefined)
				{
					var explosion = new Explosion(World, col+i, row, (col+i) * ImageSize, row * ImageSize);
					ExplosionLayer.Add(explosion);
					explosions.push(explosion)
				}
				else
				{
					if(wallOne.getCanBreak())
					{
						var explosion = new Explosion(World, col+i, row, (col+i) * ImageSize, row * ImageSize);
						ExplosionLayer.Add(explosion);
						explosions.push(explosion)
					}
				}
			}

			if(explodeTwo == undefined && row+i >= 0 && row+i < BoardRowSize)
			{
				if(wallTwo == undefined)
				{
					var explosion = new Explosion(World, col, row+i, col * ImageSize, (row+i) * ImageSize);
					ExplosionLayer.Add(explosion);
					explosions.push(explosion)
				}
				else
				{
					if(wallTwo.getCanBreak())
					{
						var explosion = new Explosion(World, col, row+i, col * ImageSize, (row+i) * ImageSize);
						ExplosionLayer.Add(explosion);
						explosions.push(explosion)
					}
				}
			}
		}
		
		// remove explosions event
		World.time.events.add(Phaser.Timer.SECOND * .5, 
			function(explosions, WallLayer) {
				for(var i = 0; i < explosions.length; i++) 
				{
					// remove breakable wall after explosion / explosions can only spawn on breakable walls / no wall
					var wall = WallLayer.getObjectAt(explosions[i].getCol(), explosions[i].getRow())
					if(wall != undefined)
					{
						WallLayer.remove(wall)
					}

					// remove explosion from explosion layer
					ExplosionLayer.Remove(explosions[i])}
				}, 
		this, explosions, WallLayer)
	}

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
			if(wallTwo instanceof Wall)
			{
				if(wallTwo.getCanBreak() == true)
				{
					WallLayer.Remove(wallTwo)
				}	
			}

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
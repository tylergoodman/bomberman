function PerkManager(preferences, layerManager, perkAudio)
{
	// World
	var World = preferences.World

	// Layers 
	var PerkLayer = layerManager.ReturnLayer("Perk")
	var WallLayer = layerManager.ReturnLayer("Wall")

	// Audio
	var PerkAudio = perkAudio

	// Array containing all the types of perks
	// This should match whats in the Perk Class's constructor
	var PerkTypes = ["NormalBombPerk",
					 "HorizontalBombPerk",
					 "VerticalBombPerk"
					]

	// Returns true if a wall was removed
	// Adds perk if lucky
	this.RemoveWall = function(wall)
	{
		if(wall.getCanBreak() == true)
		{
			var col = wall.getCol(), row = wall.getRow()
			WallLayer.Remove(wall)
			if( Math.floor((Math.random() * 100) + 1) <= 15)
			{
				if(!(PerkLayer.getObjectAt(col, rol) instanceof Perk))
				{
					var type = this.RandomPerkType()
					Bomberman.Network.send({
						evt: 'perkDropped',
						data: {Col: col, Row: row, Type : type},
					});
				}
			}
			return true
		}	
	}

	// Adds a perk to the perk layer
	this.AddPerk = function (col, row, type)
	{
		var perk = new Perk(preferences, col, row, col*preferences.ImageSizeWidth, row*preferences.ImageSizeHeight, type)
		PerkLayer.Add(perk)
	}

	// Returns a random perk type
	this.RandomPerkType = function()
	{
		return PerkTypes[Math.floor((Math.random() * PerkTypes.length))]
	}

	// Check if a player is on a perk
	this.Update = function()
	{
		if(preferences.Players.length > 0)
		{
			for(var i = 0; i < preferences.Players.length; i++)
			{
				var col = preferences.Players[i].getCol(), row = preferences.Players[i].getRow()
				if(PerkLayer.getObjectAt(col, row) instanceof Perk)
				{
					// Apply perk if user is on a perk
					var playerId = preferences.Players[i].getName()
					Bomberman.Network.send({
						evt: 'applyPerk',
						data: {PlayerID: playerId, Col: col, Row: row},
					});
				}
			}
		}
	}

	// Apply Perks to Players that are on top of it
	this.ApplyPerk = function(playerId, col, row)
	{
		// get player and perk
		var player = preferences.Players[preferences.getIndexFromId(playerId)];
		var perk = PerkLayer.getObjectAt(col, row);

		// Play Music
		PerkAudio.play();

		//Add stop PerkAudio event
		World.time.events.add(Phaser.Timer.SECOND * .5, 
		function(perkAudio) {
				// stop audio
				perkAudio.stop();
			}, 
		this, PerkAudio);

		// remove perk
		PerkLayer.Remove(perk);

		// Apply perk to player
		switch(perk.getType())
		{
			case "NormalBombPerk" :
				player.BombRadius = player.BombRadius + 1;
				if(player.BombRadius > preferences.BoardColSize / 2)
					player.BombRadius = Math.floor(preferences.BoardColSize / 2);
				else if (player.BombRadius > preferences.BoardRowSize / 2)
					player.BombRadius = Math.floor(preferences.BoardRowSize / 2);
				break;
			case "HorizontalBombPerk" :
				player.SpecialBombType = "Horizontal"
				break;
			case "VerticalBombPerk" :
				player.SpecialBombType = "Vertical"
				break;
			default:
				console.log("Invalid perk type to add")
				break;
		}
	}
}
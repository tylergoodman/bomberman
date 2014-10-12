function PerkManager(preferences, layerManager, players)
{
	// Preferences
	var World = preferences.World
	var ImageSize = preferences.ImageSize

	// Layers 
	var PerkLayer = layerManager.ReturnLayer("Perk")
	var WallLayer = layerManager.ReturnLayer("Wall")

	// Players
	var Players = players

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
				PerkLayer.Add(this.RandomPerk(col, row))
			return true
		}	
	}

	// Returns a random perk
	this.RandomPerk = function(col, row)
	{
		var randomType = PerkTypes[Math.floor((Math.random() * PerkTypes.length) + 1)]
		return new Perk(World, col, row, col*ImageSize, row*ImageSize, randomType)
	}

	// Check if a player is on a perk
	this.Update = function()
	{
		if(Players.length > 0)
		{
			for(var i = 0; i < Players.length; i++)
			{
				var col = Players[i].getCol(), row = Players[i].getRow()
				if(PerkLayer.getObjectAt(col, row) instanceof Perk)
				{
					// Apply perk if user is on a perk
					this.ApplyPerk(Player[i], PerkLayer.getObjectAt(col, row))
				}
			}
		}
	}

	// Apply Perks to Players that are on top of it
	this.ApplyPerk = function(player, perk)
	{
		switch(perk.getType())
		{
			case "NormalBombPerk" :
				break;
			case "HorizontalBombPerk" :
				break;
			case "VerticalBombPerk" :
				break;
			default:
				console.log("Invalid perk type")
				break;
		}
	}
}
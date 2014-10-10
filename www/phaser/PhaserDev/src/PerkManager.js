function PerkManager(preferences, layerManager)
{
	var World = preferences.World
	var PerkLayer = layerManager.ReturnLayer("Perk")
	var WallLayer = layerManager.ReturnLayer("Wall")

	// Returns true if a wall was removed
	// Adds perk if lucky
	this.RemoveWall = function(wall)
	{
		if(wall.getCanBreak() == true)
		{
			WallLayer.Remove(wall)
			return true
		}	
	}
}
function Preferences(world, players)
{
	this.World = world
	this.BoardColSize = 15
	this.BoardRowSize =  9
	this.Players = players

	// Window Data
	this.WindowWidth = document.getElementById('game').offsetWidth 
	this.WindowHeight = document.getElementById('game').offsetHeight

	// Image size for bombs/walls
	this.ImageSizeWidth = this.WindowWidth / this.BoardColSize
	this.ImageSizeHeight = this.WindowHeight / this.BoardRowSize

	// Background Data
	this.BgWidth = game.cache.getImage('background').width
	this.BgHeight = game.cache.getImage('background').height
	this.BgWidthRatio = this.WindowWidth / this.BgWidth
	this.BgHeightRatio = this.WindowHeight / this.BgHeight

	// Player Data
	this.PlayerWidth = game.cache.getImage('bomberman').width
	this.PlayerHeight = game.cache.getImage('bomberman').height
	this.PlayerWidthRatio = this.ImageSizeWidth / this.PlayerWidth * .8
	this.PlayerHeightRatio = this.ImageSizeHeight / this.PlayerHeight * .8

	// Wall Data
	this.WallWidth = game.cache.getImage('breakableWall').width
	this.WallHeight = game.cache.getImage('breakableWall').height
	this.WallWidthRatio = this.ImageSizeWidth  / this.WallWidth
	this.WallHeightRatio = this.ImageSizeHeight / this.WallHeight

	// Perk Data
	this.PerkWidth = game.cache.getImage('normalBombPerk').width
	this.PerkHeight = game.cache.getImage('normalBombPerk').height
	this.PerkWidthRatio = this.ImageSizeWidth  / this.PerkWidth
	this.PerkHeightRatio = this.ImageSizeHeight / this.PerkHeight

	// Bomb Data
	this.BombWidth = game.cache.getImage('bomb').width
	this.BombHeight = game.cache.getImage('bomb').height
	this.BombWidthRatio = this.ImageSizeWidth  / this.BombWidth
	this.BombHeightRatio = this.ImageSizeHeight / this.BombHeight

	// Explosion Data
	this.ExplosionWidth = game.cache.getImage('explosion').width
	this.ExplosionHeight = game.cache.getImage('explosion').height
	this.ExplosionWidthRatio = this.ImageSizeWidth  / this.ExplosionWidth
	this.ExplosionHeightRatio = this.ImageSizeHeight / this.ExplosionHeight

	// Calculate move value
	this.MoveValue = this.WindowWidth / (this.BoardColSize * 15)

	// public function to update all scale values
	this.updateScaleValues = function()
	{

		world.width = document.getElementById('game').offsetWidth
   		world.height = document.getElementById('game').offsetHeight

   		world.scale.refresh()

		// Window Data
		this.WindowWidth = document.getElementById('game').offsetWidth 
		this.WindowHeight = document.getElementById('game').offsetHeight

		// Image size for bombs/walls
		this.ImageSizeWidth = this.WindowWidth / this.BoardColSize
		this.ImageSizeHeight = this.WindowHeight / this.BoardRowSize

		// Background Data
		this.BgWidthRatio = this.WindowWidth / this.BgWidth
		this.BgHeightRatio = this.WindowHeight / this.BgHeight

		// Player Data
		this.PlayerWidthRatio = this.ImageSizeWidth / this.PlayerWidth * .8
		this.PlayerHeightRatio = this.ImageSizeHeight / this.PlayerHeight * .8

		// Wall Data
		this.WallWidthRatio = this.ImageSizeWidth  / this.WallWidth
		this.WallHeightRatio = this.ImageSizeHeight / this.WallHeight

		// Perk Data
		this.PerkWidthRatio = this.ImageSizeWidth  / this.PerkWidth
		this.PerkHeightRatio = this.ImageSizeHeight / this.PerkHeight

		// Bomb Data
		this.BombWidthRatio = this.ImageSizeWidth  / this.BombWidth
		this.BombHeightRatio = this.ImageSizeHeight / this.BombHeight

		// Explosion Data
		this.ExplosionWidthRatio = this.ImageSizeWidth  / this.ExplosionWidth
		this.ExplosionHeightRatio = this.ImageSizeHeight / this.ExplosionHeight


		// Calculate move value
		this.MoveValue = this.WindowWidth / (this.BoardColSize * 15)
	}

	// returns the index that the player referenced by id is currently at
	this.getIndexFromId = function(id)
	{
		var Players = this.Players;
		 // Associate Id to player - indexof didnt work
  		for(var i = 0; i < Players.length; i++)
  		{
  			if(Players[i].getName() === id)
  				return i;
  		}
	}

}
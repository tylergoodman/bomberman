function Preferences(world, players)
{
	this.World = world
	this.BoardColSize = 15
	this.BoardRowSize =  9
	this.Players = players

	// Window Data
	this.WindowWidth = document.getElementById('game').offsetWidth 
	this.WindowLength = document.getElementById('game').offsetHeight

	// Image size for bombs/walls
	this.ImageSize = this.WindowWidth / this.BoardColSize


	// Background Data
	this.BgWidth = game.cache.getImage('background').width
	this.BgHeight = game.cache.getImage('background').height
	this.BgWidthRatio = this.WindowWidth / this.BgWidth
	this.BgHeightRatio = this.WindowLength / this.BgHeight

	// Wall Data
	this.WallWidth = game.cache.getImage('breakableWall').width
	this.WallHeight = game.cache.getImage('breakableWall').height
	this.WallWidthRatio = this.ImageSize  / this.WallWidth
	this.WallHeightRatio = this.ImageSize / this.WallHeight

	// Perk Data
	this.PerkWidth = game.cache.getImage('normalBombPerk').width
	this.PerkHeight = game.cache.getImage('normalBombPerk').height
	this.PerkWidthRatio = this.ImageSize  / this.PerkWidth
	this.PerkHeightRatio = this.ImageSize / this.PerkHeight

	// Bomb Data
	this.BombWidth = game.cache.getImage('bomb').width
	this.BombHeight = game.cache.getImage('bomb').height
	this.BombWidthRatio = this.ImageSize  / this.BombWidth
	this.BombHeightRatio = this.ImageSize / this.BombHeight

	// Explosion Data
	this.ExplosionWidth = game.cache.getImage('explosion').width
	this.ExplosionHeight = game.cache.getImage('explosion').height
	this.ExplosionWidthRatio = this.ImageSize  / this.ExplosionWidth
	this.ExplosionHeightRatio = this.ImageSize / this.ExplosionHeight


}
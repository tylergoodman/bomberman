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


}
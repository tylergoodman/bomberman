function Preferences(world, players)
{
	this.World = world
	this.BoardColSize = 15
	this.BoardRowSize =  9
	this.ImageSize = 70
	this.Players = players

	// Window Data
	this.WindowWidth = document.getElementById('game').offsetWidth 
	this.WindowLength = document.getElementById('game').offsetHeight

	// Background Data
	this.BgWidth = game.cache.getImage('background').width
	this.BgHeight = game.cache.getImage('background').height
	this.BgWidthRatio = this.WindowWidth / this.BgWidth
	this.BgHeightRatio = this.WindowLength / this.BgHeight

	// Wall Data
	this.WallWidth = game.cache.getImage('breakableWall').width
	this.WallHeight = game.cache.getImage('breakableWall').height
	this.AdjWallWidth = this.WindowWidth / this.BoardColSize
	this.AdjWallHeight = this.WindowLength / this.BoardRowSize
	this.WallWidthRatio = this.AdjWallWidth  / this.WallWidth
	this.WallHeightRatio = this.AdjWallHeight / this.WallHeight


}
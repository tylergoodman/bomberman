function Map () {
	// Sample of our test map : 9x9
	// 0 : breakable walls
	// 1 : nonbreakable walls
	// 2 : player start
	// 3 : empty
	// * we can follow the principles we did in Terrell's othello game

	// Seems good to me
	this.grid = [
		[2,3,3,0,0,0,3,3,2],
		[0,1,0,1,0,1,0,1,0],
		[0,0,0,0,0,0,0,0,0],
		[0,1,0,1,0,1,0,1,0],
		[0,0,0,0,0,0,0,0,0],
		[0,1,0,1,0,1,0,1,0],
		[0,0,0,0,0,0,0,0,0],
		[0,1,0,1,0,1,0,1,0],
		[2,3,3,0,0,0,3,3,2]
	]; 

}
function Wall (breakable, col, row) {
	// Set up Base's class properties
	this.base = GameObject;
	this.base(col, row);

	// Set up Object's properties 
	this.CanBreak = breakable || false;
	// ^ gotta be careful with these || expressions because they can bite you if you're not paying enough attention
	// (i got bit once)
}


// Wall's CanBreak Get
Wall.prototype.getCanBreak = function () {
	return this.CanBreak;
}

Wall.prototype = new GameObject;
function GameObject (col, row) {
	// Member variables
	this.Col = col; // x - position
	this.Row = row; // y - position
}

// Tou don't exactly need get/sets since all the properties set on "this." in GameObject are public and can be
// manipulated by anything at any time.
// They're alright to have if you need to do other work while getting/setting or if you want to be able to change the name or
// functionality of the variable more easily later on.

// PosX Get/Set
GameObject.prototype.getCol = function () {
	return this.Col;
}

GameObject.prototype.setCol = function (value) {
	this.Col = value;
}

// PosY Get/Set
GameObject.prototype.getRow = function () {
	return this.Row;
}

GameObject.prototype.setRow = function (value) {
	this.Row = value;
}

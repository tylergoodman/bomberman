function Player (name, col, row) {
	// Set up Base's class properties
	this.base = GameObject;
	this.base(col, row);

	// Set up Object's properties
	this.Name = name;
	this.BombCount = 5;



	// This works too but in a different way that would probably be better explained in person.
	// javascript gets a little complex in terms of scope
	// the functions below are public functions that act on public variables

	// Player's Name Get
	this.getName = function () {
		return this.Name;
	}

	// BombCount Get/Set
	this.getBombCount = function () {
		return this.BombCount;
	}

	this.setBombCount = function (value) {
		this.BombCount = value;
	}

	// here's an example of a function that acts on a private variable
	var privateVaribale = 0;

	this.publicVariable = false;

	this.publicFunction = function (val) {
		privateVaribale++;
		this.publicVariable = !this.publicVariable;
	}

	// these two are equivalent
	function privateFunction (val) {
		privateVariable--;
		this.publicVariable++;
	}
	var privaeteFunction = function (val) {
		privateVariable--;
		this.publicVariable++;
	}

	// more on this here: http://phrogz.net/JS/classes/OOPinJS.html
}

// javascript 'classes' are prototypical, which is a little different than 'classical' I think is what c++ and java is. Maybe I mean 'Class-ical'? idk
// I'll find you an article on object inheritance or something later
// the assignment below basically says "give the Player object's prototype a copy of the current GameObject object's prototype"
// through this copying and overwriting we can achieve some semblance of 'classical' design
// it means no super() calls though :(
// there are libraries that fill in this gap in functionality though, a popular one I know of is called 'klass' if you want to look into it
Player.prototype = Object.create(GameObject.prototype);
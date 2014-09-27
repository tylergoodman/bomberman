
function Game () 
{
	var world = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update });

	function preload() {

	    //  You can fill the preloader with as many assets as your game requires

	    //  Here we are loading an image. The first parameter is the unique
	    //  string by which we'll identify the image later in our code.

	    //  The second parameter is the URL of the image (relative)
	    world.load.image('bomberman', 'assets/bomberman.jpg');

	}

	function create() {

	    var player = new Player(world, "Player 1", 0, 0, 0, 0);

	}

	function update() {

	}
}
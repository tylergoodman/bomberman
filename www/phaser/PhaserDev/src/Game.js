
function Game () 
{
	var world = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update })
	var player = null;
	function preload() {

	    //  You can fill the preloader with as many assets as your game requires

	    //  Here we are loading an image. The first parameter is the unique
	    //  string by which we'll identify the image later in our code.

	    //  The second parameter is the URL of the image (relative)
	    world.load.image('bomberman', 'assets/bomberman.jpg')

	}

	function create() {

		player = new Player(world, "Player 1", 0, 0, 0, 0)

	}

	function update() {


		if (world.input.keyboard.isDown(Phaser.Keyboard.A))
		{
			player.setPosX(player.getPosX(0) - 10)
		}
		else if (world.input.keyboard.isDown(Phaser.Keyboard.D))
		{
			player.setPosX(player.getPosX() + 10)
		}
		else if (world.input.keyboard.isDown(Phaser.Keyboard.W))
		{
			player.setPosY(player.getPosY() - 10)
		}
		else if (world.input.keyboard.isDown(Phaser.Keyboard.S))
		{
			player.setPosY(player.getPosY() + 10)
		}

		player.update()
	}

	/******************************************************************************
								Events/Event Handlers
	******************************************************************************/

	// Event when a key is hit: converts the key to a string
	function showKey(e) {
		var key
		if (window.event) {
			key = window.event.keyCode
		} 
		else {
			key = e.keyCode
		}

		key = String.fromCharCode(key)
		ProcessKey(key)
	}

	// Processes a key press event
	function ProcessKey(key)
	{
		if (key == "A")
		{
			player.update()
		}
		else if(key == "D")
		{
		}
		else if(key == "W")
		{

		}
		else if(key == "S")
		{
		}
		else if(key == " ")
		{

		}
	}

	// Sets up the keyboard event listener
	window.onload = function() {
		document.onkeydown = showKey
	}
}


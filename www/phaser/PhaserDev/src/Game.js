
function Game () 
{
	var world = new Phaser.Game(1050, 630, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update })
	var player = null;

	// Preload images needed
	function preload() {

	    world.load.image('bomberman', 'assets/bomberman.jpg')
	    world.load.image('background', 'assets/background.png')
	    world.load.image('breakableWall', 'assets/breakableWall.jpg')

	}

	function create() {
		// background
		var background = world.add.group();
   		background.z = 1;
   		background.add(world.add.sprite(0,0,'background'))
		// player
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


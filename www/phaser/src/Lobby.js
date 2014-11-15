var Lobby = function(game) {} 

Lobby.prototype = {
  preload: function() { this.load.image('lobby', 'assets/lobby.jpg')},
  create:  function() {	// background
						var background = this.game.add.group();
				   		background.z = 1;
				   		background.add(this.game.add.sprite(0,0,'lobby'))},
  update:  function() {

		if(this.game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR, 10))
			this.game.state.start('Game');
  }
}
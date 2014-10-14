var MainMenu = function(game) {} 

MainMenu.prototype = {
  preload: function() { this.load.image('background', 'assets/titlescreen.jpg')},
  create:  function() {	// background
						var background = this.game.add.group();
				   		background.z = 1;
				   		background.add(this.game.add.sprite(0,0,'background'))},
  update:  function() {

		if(this.game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR, 10))
			this.game.state.start('Game');
  }
}
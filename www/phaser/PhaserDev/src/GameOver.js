var GameOver = function(game) {} 

GameOver.prototype = {
  preload: function() { this.load.image('gameover', 'assets/gameover.png')},
  create:  function() {	
  						// background
						var background = this.game.add.group();
				   		background.z = 1;
				   		background.add(this.game.add.sprite(0,0,'gameover'))},
  update:  function() {

		if(this.game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR, 10))	
			this.game.state.start('Preloader');
  }
}
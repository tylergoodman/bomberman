var Preloader = function(game) {} 

Preloader.prototype = {
  preload: function() { this.load.image('background', 'assets/titlescreen.jpg')},
  create:  function() {	
						//  This sets a limit on the up-scale
					    //this.game.scale.maxWidth = 800;
					    //this.game.scale.maxHeight = 600;

					    //  Then we tell Phaser that we want it to scale up to whatever the browser can handle, but to do it proportionally
					    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
					    this.game.scale.setScreenSize();
  						// background
						var background = this.game.add.group();
				   		background.z = 1;
				   		background.add(this.game.add.sprite(0,0,'background'))
				   	  },
  update:  function() {

		if(this.game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR, 10))
			this.game.state.start('Game');
  }
}
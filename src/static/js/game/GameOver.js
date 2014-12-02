var GameOver = function(game) {} 

GameOver.prototype = {
  preload: function() { 
  						this.load.image('gameover', './static/img/gameover.png')
  						game.load.audio('credits', ['./static/audio/credits.mp3', './static/audio/credits.mp3']);
					  },
  create:  function() {	
  						// background
						var background = this.game.add.group();
				   		background.z = 1;
				   		var gameOverSprite = this.game.add.sprite(0,0,'gameover')
				   		background.add(gameOverSprite)

				   		var image = game.cache.getImage('gameover')

				   		var scaleWidth = document.getElementById('game').offsetWidth / image.width 
				   	    var scaleHeight = document.getElementById('game').offsetHeight / image.height 

				   		gameOverSprite.scale.setTo(scaleWidth, scaleHeight)

				   		// Play Credits music
						this.creditsMusic = game.add.audio('credits', 1, true);
			   			this.creditsMusic.play();

				   	  },
  update:  function() {

		if(this.game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR, 10))	
			this.game.state.start('Preloader');
  },

  shutdown: function() {
  		
  		// stop playing music
  		this.creditsMusic.stop();
  }
}
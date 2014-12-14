var GameOver = function(game) {
								this.winner = null
								var image = null
								var gameOverSprite = null
							  } 

GameOver.prototype = {
  preload: function() { 
  						this.load.image('gameover', './static/img/GameOver/gameover.png')
						this.load.image('gameover1', './static/img/GameOver/player1.png')
						this.load.image('gameover2', './static/img/GameOver/player2.png')
						this.load.image('gameover3', './static/img/GameOver/player3.png')
						this.load.image('gameover4', './static/img/GameOver/player4.png')
  						game.load.audio('credits', ['./static/audio/credits.mp3', './static/audio/credits.mp3']);
					  },
  create:  function() {	
  						// background
						var background = this.game.add.group();
				   		background.z = 1;
				   		var gameOverSpriteName = 'gameover';
				   		switch(this.winner)
				   		{
				   			case 0:
				   				gameOverSpriteName = 'gameover1';
				   				break;
				   			case 1:
				   				gameOverSpriteName = 'gameover2';
				   				break;
				   			case 2:
				   				gameOverSpriteName = 'gameover3';
				   				break;
				   			case 3: 
				   				gameOverSpriteName = 'gameover4';
				   				break;
				   			default:
				   				gameOverSpriteName = 'gameover';
				   				break;
				   		}
				   		gameOverSprite = this.game.add.sprite(0,0, gameOverSpriteName)
				   		background.add(gameOverSprite)

				   		image = game.cache.getImage('gameover')

				   		var scaleWidth = document.getElementById('game').offsetWidth / image.width 
				   	    var scaleHeight = document.getElementById('game').offsetHeight / image.height 

				   		gameOverSprite.scale.setTo(scaleWidth, scaleHeight)

				   		// Play Credits music
						this.creditsMusic = game.add.audio('credits', 1, true);
			   			this.creditsMusic.play();

			   			// renable start game button
						$('#game-start').prop('disabled', false)

				   	  },
  update:  function() {

		if(this.game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR, 10))	
			this.game.state.start('Preloader');

		image = game.cache.getImage('gameover')

   		this.game.width = document.getElementById('game').offsetWidth
   		this.game.height = document.getElementById('game').offsetHeight

   		this.game.scale.refresh()

   		scaleWidth = document.getElementById('game').offsetWidth / image.width 
   	    scaleHeight = document.getElementById('game').offsetHeight / image.height 
	
   		gameOverSprite.scale.setTo(scaleWidth, scaleHeight);

    	game.scale.setScreenSize();
  },

  init: function(winner) 
					{
				  		this.winner = winner;
				  	},

  shutdown: function() {
  		
  		// stop playing music
  		if(this.creditsMusic != null)
  			this.creditsMusic.stop();
  }
}
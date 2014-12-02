var bg = null
var image = null
var scaleWidth = null
var scaleHeight = null
var ratio = 1;

var Preloader = function(game) {} 

Preloader.prototype = {
  preload: function() { this.load.image('background', './static/img/titlescreen.jpg')
  						game.load.audio('intro', ['./static/audio/intro.mp3', './static/audio/intro.mp3']);
					  },
  create:  function() {	
  						// background
						var background = this.game.add.group();
				   		background.z = 1;
				   		bg = this.game.add.sprite(0,0,'background')

				   		// intro music
				   		this.introMusic = game.add.audio('intro', 1, true);
				   		this.introMusic.play();

				   		// Scales background image
				   		image = game.cache.getImage('background')

				   		scaleWidth = document.getElementById('game').offsetWidth / image.width 
				   	    scaleHeight = document.getElementById('game').offsetHeight / image.height 

				   		background.add(bg)
				   		
				   	    if(scaleWidth > scaleHeight)
				   	    {
				   	    	ratio = scaleWidth;
				   			bg.scale.setTo(ratio, ratio);
				   	    }
				   	    else 
				   	    {
				   	    	ratio = scaleHeight;
				   			bg.scale.setTo(ratio, ratio);
				   	    }

				   	  },
  update:  function() {

   		image = game.cache.getImage('background')

   		this.game.width = document.getElementById('game').offsetWidth
   		this.game.height = document.getElementById('game').offsetHeight

   		this.game.scale.refresh()

   		scaleWidth = document.getElementById('game').offsetWidth / image.width 
   	    scaleHeight = document.getElementById('game').offsetHeight / image.height 

/*
   	    console.log( "window: " + document.getElementById('game').offsetWidth )
   	    console.log( "window: " + document.getElementById('game').offsetHeight )
   	    console.log( "image: " +bg.width )

   	    console.log( "image: " + bg.height )
*/
   			
   		bg.scale.setTo(scaleWidth, scaleHeight);

    	game.scale.setScreenSize();

		//if(this.game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR, 10))
		//	this.game.state.start('Game');
  },

  shutdown: function() {
  		
  		// stop playing music
  		this.introMusic.stop();
  }
}
var bg = null
var image = null
var scaleWidth = null
var scaleHeight = null
var ratio = 1;

var Preloader = function(game) {} 

Preloader.prototype = {
  preload: function() { this.load.image('background', 'assets/titlescreen.jpg')},
  create:  function() {	
						//  This sets a limit on the up-scale
					    //this.game.scale.maxWidth = 800;
					    //this.game.scale.maxHeight = 600;

					    //  Then we tell Phaser that we want it to scale up to whatever the browser can handle, but to do it proportionally
					    this.game.scale.maxWidth = document.getElementById('game').offsetWidth;
    					this.game.scale.maxHeight = document.getElementById('game').offsetHeight;
					    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
					    this.game.scale.setScreenSize()

  						// background
						var background = this.game.add.group();
				   		background.z = 1;
				   		bg = this.game.add.sprite(0,0,'background')
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

   		scaleWidth = document.getElementById('game').offsetWidth / image.width 
   	    scaleHeight = document.getElementById('game').offsetHeight / image.height 

/*
   	    console.log( "window: " + document.getElementById('game').offsetWidth )
   	    console.log( "window: " + document.getElementById('game').offsetHeight )
   	    console.log( "image: " +bg.width )

   	    console.log( "image: " + bg.height )
*/
   			
   		bg.scale.setTo(scaleWidth, scaleHeight);


		if(this.game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR, 10))
			this.game.state.start('Game');
  }
}
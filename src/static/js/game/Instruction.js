var Instruction = function(game) 	{
								this.playerID = null;
								this.peers = null;
								var bg = null
								var image = null
								var scaleWidth = null
								var scaleHeight = null
								var ratio = 1;
							} 

Instruction.prototype = {
  preload: function() { this.load.image('instruction', './static/img/instructionscreen.png')},
  create:  function() {	// background
						var background = this.game.add.group();
				   		background.z = 1;
				   		bg = this.game.add.sprite(0,0,'instruction')

				   		// Scales background image
				   		image = game.cache.getImage('instruction')

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

				   		// Start the game after 5 seconds
				   		game.time.events.add(Phaser.Timer.SECOND * 4, 
								function() {this.game.state.start('Game', true, false, this.playerID, this.peers)}, 
							this)
				   	},
  update:  function() {

  		image = game.cache.getImage('instruction')

   		this.game.width = document.getElementById('game').offsetWidth
   		this.game.height = document.getElementById('game').offsetHeight

   		this.game.scale.refresh()

   		scaleWidth = document.getElementById('game').offsetWidth / image.width 
   	    scaleHeight = document.getElementById('game').offsetHeight / image.height 
			
   		bg.scale.setTo(scaleWidth, scaleHeight);

    	game.scale.setScreenSize();

  },

  init: function(myId, peersID) 
					{
				  		this.playerID = myId;
				  		this.peers = peersID;
				  	}
}
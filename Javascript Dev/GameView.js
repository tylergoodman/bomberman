
/******************************************************************************
						Constructor
******************************************************************************/
	function GameView() {
		this.canvas = document.createElement("canvas");
		this.canvas.setAttribute("id", "myCanvas");
		this.canvas.setAttribute("width", 800);
		this.canvas.setAttribute("height", 600);
		this.canvas.style.border = "1px solid #d3d3d3";
		this.ctx = this.canvas.getContext("2d");
		document.body.appendChild(this.canvas);

/******************************************************************************
							Drawing
******************************************************************************/

		// Draws any Object at a location
		this.draw = function(object, x, y) {

		    this.ctx.drawImage(object,x,y);
		}

		// Clears canvas for redrawing
		this.ClearCanvas = function()
		{
			var canvas = document.getElementById("myCanvas");
			var ctx = canvas.getContext("2d");
			ctx.clearRect(0, 0, canvas.width, canvas.height);
		}

/******************************************************************************
						End of Drawing
******************************************************************************/
	}
/******************************************************************************
					End of Constructor
******************************************************************************/

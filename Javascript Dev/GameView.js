
/******************************************************************************
						Constructor
******************************************************************************/
	function GameView() {
		this.canvas = document.createElement("canvas");
		this.canvas.setAttribute("id", "myCanvas");
		this.canvas.setAttribute("width", 800);
		this.canvas.setAttribute("height", 800);
		this.canvas.style.border = "1px solid #d3d3d3";
		this.ctx = this.canvas.getContext("2d");
		document.body.appendChild(this.canvas);

/******************************************************************************
							Drawing
******************************************************************************/

		// Draws any Object at a location
		this.draw = function (object, x, y) {
		    this.ctx.drawImage(object, x, y);
		}

		// Clears canvas for redrawing
		this.ClearCanvas = function()
		{
			var canvas = document.getElementById("myCanvas");
			var ctx = canvas.getContext("2d");
			ctx.clearRect(0, 0, canvas.width, canvas.height);
		}


		// Refreshes the view
		this.Refresh = function(object)
		{
			if(object instanceof GameBoard)
			{
				this.ClearCanvas();

				// Get the Player data
				var playerBoard = object.ReturnBoard(Player);

				// Get the Wall data
				var wallBoard = object.ReturnBoard(Wall);

				// Get the Bomb data
				var bombBoard = object.ReturnBoard(Bomb);

				for(var i = 0; i < 9; i++)
				{
					for(var j = 0; j < 9; j++)
					{
						if(bombBoard[i][j] != undefined)
						{
							this.draw(bombBoard[i][j].Image, j * MOVESPEED,
								i * MOVESPEED);
						}

						if(wallBoard[i][j] != undefined)
						{
							this.draw(wallBoard[i][j].Image, j * MOVESPEED,
								i * MOVESPEED);
						}

						if(playerBoard[i][j] != undefined)
						{
							this.draw(playerBoard[i][j].Image, j * MOVESPEED,
								i * MOVESPEED);
						}
					}
				}

				/*
				// Get the GameObject data
				var board = object.ReturnBoard();

				for(var i = 0; i < 9; i++)
				{
					for(var j = 0; j < 9; j++)
					{
						if(board[i][j] != undefined)
						{
							this.draw(board[i][j].Image, j * MOVESPEED,
								i * MOVESPEED)
						}
					}
				}
				*/
			}
		}

/******************************************************************************
						End of Drawing
******************************************************************************/
	}
/******************************************************************************
					End of Constructor
******************************************************************************/

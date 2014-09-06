
/******************************************************************************
						Constructor
******************************************************************************/

	function GameObject (col, row, imageSource, id, imageWidth, imageHeight) {
		// Member variables
		this.Col = col; // x - position
		this.Row = row; // y - position
		this.Image =  new Image();
		this.Image.src = imageSource;
		this.Image.setAttribute("id", id);
		this.Image.setAttribute("width", imageWidth);
		this.Image.setAttribute("height", imageHeight);
		//document.body.appendChild(this.Image);
	}

/******************************************************************************
						End of Constructor
******************************************************************************/
	
/******************************************************************************
						Inherited Methods
******************************************************************************/

	// PosX Get/Set
	GameObject.prototype.getCol = function () {
		return this.Col;
	}

	GameObject.prototype.setCol = function (value) {
		this.Col = value;
	}

	// PosY Get/Set
	GameObject.prototype.getRow = function () {
		return this.Row;
	}

	GameObject.prototype.setRow = function (value) {
		this.Row = value;
	}

/******************************************************************************
						End of Inherited Methods
******************************************************************************/
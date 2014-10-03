function LayerManager()
{
	this.Layers = []

	this.AddLayer = function(layer)
	{
		// Add layer to Layers array
		this.Layers.push(layer)

		// return layer so it can be assigned
		return layer
	}

	// returns a layer from the list based on name
	this.ReturnLayer = function(name)
	{
		for(var i = 0; i < this.Layers.length; i++)
			if(this.Layers[i].getName() === name)
				return this.Layers[i]
		return null
	}
}
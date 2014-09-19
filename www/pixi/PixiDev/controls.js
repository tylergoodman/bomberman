    // function to move bomberman
	function move(player, direction)
	{	

		if(direction == "RIGHT")
		{
   			player.position.x = player.position.x + 25;
		}
		else if(direction == "LEFT")
		{
   			player.position.x = player.position.x - 25;
		}
		else if(direction == "UP")
		{
    		player.position.y =  player.position.y - 25;
		}
		else if(direction == "DOWN")
		{
    		player.position.y =  player.position.y + 25;
		}
	}

	// collision detection
	function isIntersecting (r1, r2) {
	return !(r2.x > (r1.x + r1.width) || 
           (r2.x + r2.width) < r1.x || 
           r2.y > (r1.y + r1.height) ||
           (r2.y + r2.height) < r1.y);
	}
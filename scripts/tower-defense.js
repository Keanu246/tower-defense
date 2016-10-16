var canvas = document.getElementById('canvas')
c = canvas.getContext('2d')

var play = true;

drawBG = function(){
	c.fillStyle='green'
	c.fillRect(0, 0, 512, 448);
}

playGame = function(){
	drawBG();
	
	if(play){
		requestAnimationFrame(playGame);
	}
}	
if(play){
	playGame();
}

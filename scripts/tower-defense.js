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
//PAUSE
$(document).on('keydown', function(z){
	key = z.keyCode;
	if(key === 32){
		if(play === true){
			play = false;
			console.log('PAUSED')
		} else {
			play = true;
			console.log('resumed')
			requestAnimationFrame(playGame);
		}
	}
});

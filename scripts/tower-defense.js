var canvas = document.getElementById('canvas')
c = canvas.getContext('2d')



var play = true;
var difficulty = 500;

var towers = [];

var enemies = [];
var enemiesRate = Math.round((Math.random()*difficulty)+1);
var enemiesFrame = 1;

var randX = Math.round((Math.random()*512)+1);
var randY = Math.round((Math.random()*448)+1);

genEnemies = function(){
	enemies.push([randX, randY]);
	randX = Math.round((Math.random()*512)+1);
	randY = Math.round((Math.random()*448)+1);
}
drawEnemies = function(){
	for(var i = 0; i < enemies.length; i++){
		c.fillStyle='red'
		c.fillRect(enemies[i][0] - 10, enemies[i][1] - 10, 20, 20);
	}
}
moveEnemies = function(){
	if(towers.length > 0){
		for(var i = 0; i < enemies.length; i++){
			if(i < towers.length){
				if(enemies[i][0] > towers[i][0]){
					enemies[i][0]--;
				}
				if(enemies[i][0] < towers[i][0]){
					enemies[i][0]++;
				}
				if(enemies[i][1] < towers[i][1]){
					enemies[i][1]++;
				}
				if(enemies[i][1] > towers[i][1]){
					enemies[i][1]--;
				}
			}		
		}
	}
}
genTowers = function(event){
	towers.push([event.offsetX, event.offsetY]);
}
drawTowers = function(){
	for(var i = 0; i < towers.length; i++){
		c.fillStyle='green'
		c.fillRect(towers[i][0] - 10, towers[i][1] - 10, 20, 20);
	}
}
drawBG = function(){
	c.fillStyle='gray'
	c.fillRect(0, 0, 512, 448);
}
playGame = function(){
	canvas.addEventListener('click', genTowers);
	
	if(enemiesFrame === enemiesRate){
		genEnemies();
		enemiesFrame = 1;
		enemiesRate = Math.round((Math.random()*difficulty)+1);
	}

	drawBG();
	drawTowers();
	drawEnemies();

	moveEnemies();
	
	enemiesFrame++;

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

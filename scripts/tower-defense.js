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

var closestTower;
var firstTower;
var secondTower;
var prevTower;
var fTA;
var fTB;
var fTC;
var sTA;
var sTB;
var sTC;


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
			for(var j = 0; j < towers.length; j++){
				prevTower = j - 1;

				console.log(j);
				fTA = Math.abs(enemies[i][0] - towers[prevTower][0]) * Math.abs(enemies[i][0] - towers[prevTower][0]);
				fTB = Math.abs(enemies[i][1] - towers[prevTower][1]) * Math.abs(enemies[i][1] - towers[prevTower][1]);
				fTC = fTA + fTB;
				firstTower = Math.sqrt(fTC);

				sTA = Math.abs(enemies[i][0] - towers[j][0]) * Math.abs(enemies[i][0] - towers[j][0]);
				sTB = Math.abs(enemies[i][1] - towers[j][1]) * Math.abs(enemies[i][1] - towers[j][1]);
				sTC = sTA + sTB;
				secondTower = Math.sqrt(sTC);

				console.log(firstTower);
				console.log(secondTower);

				if(firstTower < secondTower){
					closestTower = prevTower;
				}
			}
			//console.log(closestTower);
			if(enemies[i][0] > towers[closestTower][0]){
					enemies[i][0]--;
				}
			if(enemies[i][0] < towers[closestTower][0]){
				enemies[i][0]++;
			}
			if(enemies[i][1] < towers[closestTower][1]){
				enemies[i][1]++;
			}
			if(enemies[i][1] > towers[closestTower][1]){
				enemies[i][1]--;
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

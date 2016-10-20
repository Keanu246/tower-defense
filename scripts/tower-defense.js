var canvas = document.getElementById('canvas')
c = canvas.getContext('2d')

var play = true
var difficulty = 500

var towers = [{x: 246, y: 214, hp: 10}]

//Variables used for enemies[]
var enemies = []
var enemiesRate = Math.round((Math.random()*difficulty)+1)
var enemiesStartLocation
var enemiesFrame = 1
var enemiesAttackRate = Math.round((Math.random()*180)+1)
var enemiesAttackFrame = 1
var attackAnimationFrame = 0;

//Used to generate random numbers on X/Y axes
var randX
var randY

genRand = function(){
	randX = Math.round((Math.random()*512)+1);
	randY = Math.round((Math.random()*448)+1);
	enemiesStartLocation = Math.round((Math.random()*3)+1);
}
genRand();
//Variables used to determine which tower is closest to a
////given enemy  
//A, B, C are Pythagorean variables used to determine distance
////on X/Y axes
var closestTower
var prevTower
var lastTower
var firstTower
var fTA
var fTB
var fTC
var secondTower
var sTA
var sTB
var sTC

genEnemies = function(){
	genRand();
	if(enemiesStartLocation === 1){
		enemies.push([randX, -20, 0, true]);
	} else if(enemiesStartLocation === 2){
		enemies.push([-20, randY, 0, true]);
	} else if(enemiesStartLocation === 3){
		enemies.push([randX, 448 + 20, 0, true]);
	} else if(enemiesStartLocation === 4){
		enemies.push([512+20, randY, 0, true]);
	}
	if(towers.length > 0){
		findClosestTower();
	}
}
findClosestTower = function(){
	for(var i = 0; i < enemies.length; i++){
		for(var j = 1; j < towers.length; j++){
			prevTower = j - 1;

			//console.log(j);
			fTA = Math.abs(enemies[i][0] - towers[prevTower][0]) * Math.abs(enemies[i][0] - towers[prevTower][0]);
			fTB = Math.abs(enemies[i][1] - towers[prevTower][1]) * Math.abs(enemies[i][1] - towers[prevTower][1]);
			fTC = fTA + fTB;
			firstTower = Math.sqrt(fTC);

			sTA = Math.abs(enemies[i][0] - towers[j][0]) * Math.abs(enemies[i][0] - towers[j][0]);
			sTB = Math.abs(enemies[i][1] - towers[j][1]) * Math.abs(enemies[i][1] - towers[j][1]);
			sTC = sTA + sTB;
			secondTower = Math.sqrt(sTC);

			//console.log(firstTower);
			//console.log(secondTower);

			if(firstTower < secondTower){
				closestTower = prevTower;
			}
		}
	
		lastTower = towers.length - 1;

		fTA = Math.abs(enemies[i][0] - towers[lastTower][0]) * Math.abs(enemies[i][0] - towers[lastTower][0]);
		fTB = Math.abs(enemies[i][1] - towers[lastTower][1]) * Math.abs(enemies[i][1] - towers[lastTower][1]);
		fTC = fTA + fTB;
		firstTower = Math.sqrt(fTC);

		sTA = Math.abs(enemies[i][0] - towers[0][0]) * Math.abs(enemies[i][0] - towers[0][0]);
		sTB = Math.abs(enemies[i][1] - towers[0][1]) * Math.abs(enemies[i][1] - towers[0][1]);
		sTC = sTA + sTB;
		secondTower = Math.sqrt(sTC);

		if(firstTower < secondTower){
			closestTower = lastTower;
		}
		enemies[i][2] = closestTower;
	}
}
drawEnemies = function(){
	for(var i = 0; i < enemies.length; i++){
		if(attackAnimationFrame > 0 && enemies[i][3] === false){
			c.fillStyle='white';
			c.fillRect(enemies[i][0] - 10, enemies[i][1] - 10, 20, 20);
			attackAnimationFrame--;
		} else {
			c.fillStyle='red';
			c.fillRect(enemies[i][0] - 10, enemies[i][1] - 10, 20, 20);
		}
	}
}
enemiesAttack = function(){
	attackAnimationFrame = 10;
	for(var i = 0; i < enemies.length; i++){
		closestTower = enemies[i][2];
		if(enemies[i][3] === false){
			towers[closestTower][2]--;
		}
		if(towers[closestTower][2] <= 0){
			towers[closestTower] = [];
			findClosestTower();
		}
	}
}
moveEnemies = function(){
	for(var i = 0; i < enemies.length; i++){
		closestTower = enemies[i][2];
		if(enemies[i][0] > towers[closestTower][0] + 20){
			enemies[i][0]--;
			enemies[i][3] = true;
		}
		if(enemies[i][0] < towers[closestTower][0]- 20){
			enemies[i][0]++;
			enemies[i][3] = true;
		}
		if(enemies[i][1] < towers[closestTower][1] - 20){
			enemies[i][1]++;
			enemies[i][3] = true;
		}
		if(enemies[i][1] > towers[closestTower][1] + 20){
			enemies[i][1]--;
			enemies[i][3] = true;
		} else {
			enemies[i][3] = false;
		}
	}
}
genTowers = function(event){
	towers.push([event.offsetX, event.offsetY, 5]);
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
spliceArrays = function(){
	for(var i = 0; i < towers.length; i++){
		if(towers[i].length < 2){
			towers.splice(i, 1);
			console.log(towers.length);
		}
	}
}
playGame = function(){
	canvas.addEventListener('click', genTowers);

	if(enemiesFrame === enemiesRate){
		genEnemies();
		enemiesFrame = 1;
		enemiesRate = Math.round((Math.random()*difficulty)+1);
	}
	if(enemiesAttackFrame === enemiesAttackRate){
		enemiesAttack();
		enemiesAttackRate = Math.round((Math.random()*120)+60);
		enemiesAttackFrame = 1;
	}

	drawBG();
	drawTowers();
	drawEnemies();

	moveEnemies();
	
	enemiesFrame++;
	enemiesAttackFrame++;

	//spliceArrays();

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

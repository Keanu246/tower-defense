var canvas = document.getElementById('canvas')
c = canvas.getContext('2d')

var play = true
var difficulty = 500
var gameFrame = 1;
var money = 100;

//Variables used for towers[]
var towers = [{x: 246, y: 214, height: 40, width: 40, hp: 10, range: 200, attackFrame: Math.round(Math.random()*120)}]
var towersAttackRate = Math.round(Math.random()*120)
var towersAttackFrame = 1;
var towersBullets = []
var lastTowersBullets

//Variables used for enemies[]
var enemies = []
var enemiesRate = Math.round((Math.random()*difficulty)+1)
var enemiesStartLocation
var enemiesFrame = 1
var enemiesAttackRate = Math.round((Math.random()*180)+60)
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
	enemies.push({
		x: randX, 
		y: -20, 
		target: 0, 
		move: true, 
		hp: 5, 
		height: 20, 
		width: 20, 
		attackFrame: Math.round((Math.random()*180)+60), 
		attackAnimationFrame: 0
	});
	if(enemiesStartLocation === 1){
		enemies[enemies.length - 1].x = randX; 
		enemies[enemies.length - 1].y = -20;
	} else if(enemiesStartLocation === 2){
		enemies[enemies.length - 1].x = -20; 
		enemies[enemies.length - 1].y = randY;
	} else if(enemiesStartLocation === 3){
		enemies[enemies.length - 1].x = randX; 
		enemies[enemies.length - 1].y = 448 + 20;
	} else if(enemiesStartLocation === 4){
		enemies[enemies.length - 1].x = 512+20; 
		enemies[enemies.length - 1].y = randY;
	}
	if(towers.length > 0){
		findClosestTower();
	}
}
findClosestTower = function(){
	if(towers.length > 1){
		for(var i = 0; i < enemies.length; i++){
			for(var j = 1; j < towers.length; j++){
				prevTower = j - 1;

				//console.log(j);
				fTA = Math.abs(enemies[i].x - towers[prevTower].x) * Math.abs(enemies[i].x - towers[prevTower].x);
				fTB = Math.abs(enemies[i].y - towers[prevTower].y) * Math.abs(enemies[i].y - towers[prevTower].y);
				fTC = fTA + fTB;
				firstTower = Math.sqrt(fTC);

				sTA = Math.abs(enemies[i].x - towers[j].x) * Math.abs(enemies[i].x - towers[j].x);
				sTB = Math.abs(enemies[i].y - towers[j].y) * Math.abs(enemies[i].y - towers[j].y);
				sTC = sTA + sTB;
				secondTower = Math.sqrt(sTC);

				//console.log(firstTower);
				//console.log(secondTower);

				if(firstTower < secondTower){
					closestTower = prevTower;
				}
			}
		
			lastTower = towers.length - 1;

			fTA = Math.abs(enemies[i].x - towers[lastTower].x) * Math.abs(enemies[i].x - towers[lastTower].x);
			fTB = Math.abs(enemies[i].y - towers[lastTower].y) * Math.abs(enemies[i].y - towers[lastTower].y);
			fTC = fTA + fTB;
			firstTower = Math.sqrt(fTC);

			sTA = Math.abs(enemies[i].x - towers[0].x) * Math.abs(enemies[i].x - towers[0].x);
			sTB = Math.abs(enemies[i].y - towers[0].y) * Math.abs(enemies[i].y - towers[0].y);
			sTC = sTA + sTB;
			secondTower = Math.sqrt(sTC);

			if(firstTower < secondTower){
				closestTower = lastTower;
			}
			enemies[i].target = closestTower;
		}
	} else {
		for(var i = 0; i < enemies.length; i++){
			enemies[i].target = 0;
		}
	}
}
drawEnemies = function(){
	for(var i = 0; i < enemies.length; i++){
		if(enemies[i].attackAnimationFrame > 0 
		&& enemies[i].move === false){
			c.fillStyle='white';
			c.fillRect(enemies[i].x - enemies[i].width/2, enemies[i].y - enemies[i].height/2, enemies[i].width, enemies[i].height);
			enemies[i].attackAnimationFrame--;
		} else {
			c.fillStyle='red';
			c.fillRect(enemies[i].x - enemies[i].width/2, enemies[i].y - enemies[i].height/2, enemies[i].width, enemies[i].height);
		}
	}
}
enemiesAttack = function(){
	for(var i = 0; i < enemies.length; i++){
		if(gameFrame % enemies[i].attackFrame === 0){
			enemies[i].attackAnimationFrame = 10;
			enemies[i].attackFrame = Math.round((Math.random()*180)+120); 
			closestTower = enemies[i].target;
			if(enemies[i].move === false){
				towers[closestTower].hp--;
			}
			if(towers[closestTower].hp <= 0){
				towers.splice(closestTower, 1);
				//towers[closestTower] = {};
				findClosestTower();
				i = enemies.length + 1;
			}
		}
	}
}
moveEnemies = function(){
	for(var i = 0; i < enemies.length; i++){
		closestTower = enemies[i].target;
		changeX = enemies[i].x - towers[enemies[i].target].x;
		changeY = enemies[i].y - towers[enemies[i].target].y;
		slope = changeY / changeX;

		if(changeX < 0
		&& enemies[i].x < towers[closestTower].x - 20
		&& enemies[i].y < towers[closestTower].y - 20){
			enemies[i].x++;
			if(gameFrame % Math.round(slope) === 0){
				enemies[i].y+=slope;
			}
			enemies[i].move = true;
		}
		if(changeX > 0
		&& enemies[i].y > towers[closestTower].y + 20
		&& enemies[i].x > towers[closestTower].x + 20){
			enemies[i].x--;
			if(gameFrame % Math.round(slope) === 0){
				enemies[i].y-=slope;
			}
			enemies[i].move = true;
		}
		else {
			enemies[i].move = false;
		}
	}
}
genTowers = function(event){
	if(money >= 10){
		towers.push({
			x: event.offsetX, 
			y: event.offsetY, 
			width: 20,
			height: 20,
			hp: 10, 
			range: 100, 
			attackFrame: Math.round(Math.random()*120)
		});
		money -= 10;
		updateText();
	}
}
drawTowers = function(){
	for(var i = 0; i < towers.length; i++){
		c.fillStyle='green'
		c.fillRect(towers[i].x - towers[i].width/2, towers[i].y - towers[i].height/2, towers[i].width, towers[i].height);
	}
}
towersAttack = function(){
	for(var i = 0; i < towers.length; i++){
		if(gameFrame % towers[i].attackFrame === 0){
			towers[i].attackFrame = Math.round(Math.random()*120);
			for(var j = 0; j < enemies.length; j++){
				if(enemies[j].x > towers[i].x - towers[i].range
				&& enemies[j].x < towers[i].x + towers[i].range
				&& enemies[j].y > towers[i].y - towers[i].range
				&& enemies[j].y < towers[i].y + towers[i].range){
					
					towersBullets.push({x: towers[i].x, y: towers[i].y, speed: 4, target: i, targetX: 0, targetY: 0, height: 5, width: 5});
					lastTowersBullets = towersBullets.length - 1;

					if(enemies[j].x > towers[i].x){
						towersBullets[lastTowersBullets].targetX = enemies[j].x
					}
					if(enemies[j].x < towers[i].x){
						towersBullets[lastTowersBullets].targetX = enemies[j].x
					}
					if(enemies[j].y > towers[i].y){
						towersBullets[lastTowersBullets].targetY = enemies[j].y
					}
					if(enemies[j].y < towers[i].y){
						towersBullets[lastTowersBullets].targetY = enemies[j].y
					}

					j = enemies.length + 1;
				}
			}
		}
	}
}
drawTowersBullets = function(){
	for(var i = 0; i < towersBullets.length; i++){
		c.fillStyle='yellow'
		c.fillRect(towersBullets[i].x - 2, towersBullets[i].y - 2, 5, 5);
		changeX = towersBullets[i].targetX - towersBullets[i].x;
		changeY = towersBullets[i].targetY - towersBullets[i].y;
		slope = changeY / changeX;

		if(changeX < 0){
			towersBullets[i].x -= 4;
			towersBullets[i].y -= (slope * 4);
			if(towersBullets[i].x <= towersBullets[i].targetX){
				towersBullets.splice(i, 1);
				i = towersBullets.length + 1;
			}
		} 
		if(changeX > 0){
			towersBullets[i].x += 4;
			towersBullets[i].y += (slope * 4);
			if(towersBullets[i].x >= towersBullets[i].targetX){
				towersBullets.splice(i, 1);
				i = towersBullets.length + 1;
			}
		}

		//console.log(slope);
	}
}
drawBG = function(){
	c.fillStyle='gray'
	c.fillRect(0, 0, 512, 448);
}
detectCollision = function(){
	//towersBullets to enemies
	for(var i = 0; i < towersBullets.length; i++){
		for(var j = 0; j < enemies.length; j++){
			if(towersBullets[i].x > enemies[j].x - (enemies[j].width/2) - towersBullets[i].width + 1
			&& towersBullets[i].x < enemies[j].x + (enemies[j].width/2) + towersBullets[i].width - 1
			&& towersBullets[i].y > enemies[j].y - (enemies[j].height/2) - towersBullets[i].height + 1
			&& towersBullets[i].y < enemies[j].y + (enemies[j].height/2) + towersBullets[i].height - 1){
				towersBullets.splice(i, 1);
				enemies[j].hp--;
				console.log("Tower " + i + " shoots enemy " + j + ". Enemy " + j + "'s HP is " + enemies[j].hp);

				if(enemies[j].hp <= 0){
					enemies.splice(j, 1);
					difficulty--;
					money += 5;
					updateText();
				}

				i = towersBullets.length + 1;
				j = enemies.length + 1;
			}
		}
	}
}
updateText = function(){
	$('div#money').text('$' + money);
}
updateText();
spliceArrays = function(){
	for(var i = 0; i < towers.length; i++){
		if(towers[i].length < 2){
			towers.splice(i, 1);
			console.log(towers.length);
		}
	}
	for(var i = 0; i < enemies.length; i++){
		if(enemies[i] === 2){
			delete enemies[i]
			console.log(enemies.length);
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
		
		enemiesAttackRate = Math.round((Math.random()*120)+60);
		enemiesAttackFrame = 1;
	}

	enemiesAttack();
	towersAttack();

	drawBG();
	drawTowers();
	drawEnemies();
	drawTowersBullets();

	moveEnemies();
	
	enemiesFrame++;
	enemiesAttackFrame++;
	towersAttackFrame++;
	gameFrame++;

	detectCollision();

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

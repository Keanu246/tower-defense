var canvas = document.getElementById('canvas')
c = canvas.getContext('2d')

var play = true
var difficulty = 500
var points = 0
var gameFrame = 1
var money = 100
var towersDestroyed = 0;
var missText = []
var menu = {}
var menuPresent = false

//Variables used for towers[]
var towers = [{
	type: 1,
	x: 246, 
	y: 214, 
	height: 40, 
	width: 40, 
	hp: 200,
	defense: Math.round((Math.random()*40)+1),
	defenseRange: 40,
	hitFrame: 0,
	range: 200, 
	attackPower: Math.round((Math.random()*40)+1),
	attackPowerRange: 40,
	attackFrame: Math.round(Math.random()*120), 
	attackSpeed: 5
}]
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
		move: false, 
		hp: 100,
		defense: Math.round((Math.random()*20)+1),
		defenseRange: 20, 
		hitFrame: 0,
		range: 100,
		height: 20, 
		width: 20, 
		attackFrame: Math.round((Math.random()*60)),
		attackFrameRate: 60, 
		attackPower: Math.round((Math.random()*40)+1),
		attackPowerRange: 40,
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

	findClosestTower();
}
findClosestTower = function(){
	for(var i = 0; i < enemies.length; i++){
		if(enemies[i].move === false){
			closestTower = []
			for(var j = 0; j < towers.length; j++){
				a = Math.abs(enemies[i].x - towers[j].x) * Math.abs(enemies[i].x - towers[j].x);
				b = Math.abs(enemies[i].y - towers[j].y) * Math.abs(enemies[i].y - towers[j].y);
				closestTower.push(Math.sqrt(a + b));
			}
			enemies[i].target = closestTower.indexOf(Math.min(...closestTower));
			enemies[i].move =  true;
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
			if(enemies[i].hitFrame > 0){
				c.fillStyle = 'white';
				c.font = "60 px Georgia";
				c.fillText(enemies[i].hp + "HP", enemies[i].x - 10, enemies[i].y);
				enemies[i].hitFrame--;
			}
		}
	}
}
enemiesAttack = function(){
	for(var i = 0; i < enemies.length; i++){
		if(gameFrame % enemies[i].attackFrame === 0
		&& enemies[i].target < towers.length){
			enemies[i].attackAnimationFrame = 10;
			enemies[i].attackFrame = Math.round((Math.random()*enemies[i].attackFrameRate));
			closestTower = enemies[i].target;
			damage = enemies[i].attackPower - towers[closestTower].defense;
			enemies[i].attackPower = Math.round((Math.random()*enemies[i].attackPowerRange)+1);
			towers[closestTower].defense = Math.round((Math.random()*towers[closestTower].defenseRange)+1);
			if(damage <= 0){
				damage = 1;
			}
			enemies[i].attackPower = Math.round((Math.random()*20)+1);
			towers[closestTower].defense = Math.round((Math.random()*towers[closestTower].defenseRange)+1);
			if(enemies[i].move === false){
				towers[closestTower].hp-=damage;
				towers[closestTower].hitFrame = 40;
			}
			if(towers[closestTower].hp <= 0){
				towers.splice(closestTower, 1);
				towersDestroyed++;
				updateText();
				enemies[i].move = true;
				//towers[closestTower] = {};
				findClosestTower();
				i = enemies.length + 1;
			}
		}
	}
}
moveEnemies = function(){
	for(var i = 0; i < enemies.length; i++){
		if(enemies[i].move === true
		&& enemies[i].target < towers.length){
			closestTower = enemies[i].target;
			changeX = enemies[i].x - towers[closestTower].x;
			changeY = enemies[i].y - towers[closestTower].y;
			slope = changeY / changeX;

			if(enemies[i].move === true){
				if(changeX < 0){
					enemies[i].x++;
					if(gameFrame % Math.round(slope) === 0){
						enemies[i].y += slope;
					}
				}
				if(changeX > 0){
					enemies[i].x--;
					if(gameFrame % Math.round(slope) === 0){
						enemies[i].y -= slope;
					}
				}
			}
		}
	}
}
//TOFIX: Doesn't generate towers at X/Y coordinate of first click
handleClick = function(event){
	x = event.offsetX;
	y = event.offsetY;
	if(!menuPresent){
		genMenu(x, y);
	} else if(x >= menu.x && x <= menu.x + menu.width
	&& y >= menu.y && y <= menu.y + menu.height){
		genTowers(1, x, y);
		menuPresent = false;
		menu = {};
	} else if(x >= menu.x && x <= menu.x + menu.width
	&& y >= menu.y + menu.height && y <= menu.y + (menu.height*2)){
		genTowers(2, x, y);
		menuPresent = false;
		menu = {};
	} else {
		menuPresent = false;
		menu = {};
	}
}
genMenu = function(x, y){
	menu = {
		x: x, 
		y: y, 
		width: 70, 
		height: 20
	};

	menuPresent = true;
}
drawMenu = function(){		
	c.fillStyle = "green";
	c.fillRect(menu.x, menu.y, menu.width, menu.height);
	c.fillStyle = "white";
	c.fillRect(menu.x, menu.y + menu.height, menu.width, menu.height);
	c.fillStyle = "blue";
	c.fillRect(menu.x, menu.y + (2 * menu.height), menu.width, menu.height);
}
genTowers = function(type, x, y){
	if(money >= 10){
		towers.push({
			type: type,
			x: x, 
			y: y, 
			width: 20,
			height: 20,
			hp: 100, 
			defenseRange: 10,
			defense: Math.round((Math.random()*10)+1),
			hitFrame: 0,
			range: 100, 
			attackPower: Math.round((Math.random()*20)+1),
			attackPowerRange: 20,
			attackFrame: Math.round(Math.random()*120),
			attackSpeed: 3,
			healTarget: -1,
			move: true
		});
		if(type === 1){
			money -= 10;
		}
		if(type === 2){
			money -= 15;
		}
		updateText();
	}
}
drawTowers = function(){
	for(var i = 0; i < towers.length; i++){
		if(towers[i].type === 1){
			c.fillStyle='green'
		}
		if(towers[i].type === 2){
			c.fillStyle='white'
		}
		c.fillRect(towers[i].x - towers[i].width/2, towers[i].y - towers[i].height/2, towers[i].width, towers[i].height);
		if(towers[i].hitFrame > 0){
			c.fillStyle = 'black';
			c.font = "60 px Georgia";
			c.fillText(towers[i].hp + "HP", towers[i].x - 10, towers[i].y);
			towers[i].hitFrame--;
		}
	}
}
//TOFIX: Towers not always attacking enemies even when in range
towersAttack = function(){
	for(var i = 0; i < towers.length; i++){
		if(gameFrame % towers[i].attackFrame === 0
		&& enemies.length > 0 && towers[i].type != 2){
			findClosestEnemy();
			
			towers[i].attackFrame = Math.round(Math.random()*120);
			towers[i].attackPower = Math.round((Math.random()*towers[i].attackPowerRange)+1);
		
			if(enemies[towers[i].target].x > towers[i].x - towers[i].range
			&& enemies[towers[i].target].x < towers[i].x + towers[i].range
			&& enemies[towers[i].target].y > towers[i].y - towers[i].range
			&& enemies[towers[i].target].y < towers[i].y + towers[i].range){
				towersBullets.push({
					originTower: towers.indexOf(towers[i]),
					x: towers[i].x, 
					y: towers[i].y, 
					attackSpeed: towers[i].attackSpeed,
					attackPower: towers[i].attackPower, 
					target: towers[i].target, 
					targetX: enemies[towers[i].target].x, 
					targetY: enemies[towers[i].target].y, 
					height: 5, 
					width: 5
				});

				j = enemies.length + 1;
			}
		}
	}
}
findClosestEnemy = function(){
	for(var i = 0; i < towers.length; i++){
		closestEnemy = [];
		towers[i].attackFrame = Math.round(Math.random()*120);
		towers[i].attackPower = Math.round((Math.random()*towers[i].attackPowerRange)+1);
		for(var j = 0; j < enemies.length; j++){
			a = Math.abs(towers[i].x - enemies[j].x) * Math.abs(towers[i].x - enemies[j].x);
			b = Math.abs(towers[i].y - enemies[j].y) * Math.abs(towers[i].y - enemies[j].y);
			closestEnemy.push(Math.sqrt(a + b));
		}
		towers[i].target = closestEnemy.indexOf(Math.min(...closestEnemy));
	}
}
drawTowersBullets = function(){
	for(var i = 0; i < towersBullets.length; i++){
		c.fillStyle='yellow'
		c.fillRect(towersBullets[i].x - (towersBullets[i].width/2), 
			towersBullets[i].y - (towersBullets[i].height/2), 
			towersBullets[i].width, towersBullets[i].height);

		changeX = towersBullets[i].targetX - towersBullets[i].x;
		changeY = towersBullets[i].targetY - towersBullets[i].y;
		slope = changeY / changeX;

		if(changeX < 0){
			towersBullets[i].x -= 4;
			towersBullets[i].y -= (slope * towersBullets[i].attackSpeed);
			if(towersBullets[i].x <= towersBullets[i].targetX){
				missText.push([towersBullets[i].targetX, towersBullets[i].targetY, 40]);
				towersBullets.splice(i, 1);
				i = towersBullets.length + 1;
			}
		} 
		if(changeX > 0){
			towersBullets[i].y += (slope * towersBullets[i].attackSpeed);
			towersBullets[i].x += 4;
			if(towersBullets[i].x >= towersBullets[i].targetX){
				missText.push([towersBullets[i].targetX, towersBullets[i].targetY, 40]);
				towersBullets.splice(i, 1);
				i = towersBullets.length + 1;
			}
		}
	}
}
//TOFIX: Medics can't move around a non-targeted tower
////move boolean needs to be reassigned in detectCollision()
moveTowers = function(){
	for(var i = 0; i < towers.length; i++){
		if(towers[i].type === 2){
			findWeakestTower();
			towers[i].move = true;
			weakestTowerTarget = towers[i].healTarget;

			changeX = towers[i].x - towers[weakestTowerTarget].x;
			changeY = towers[i].y - towers[weakestTowerTarget].y;
			slope = changeY / changeX;

			if(towers[i].move === true){
				if(changeX < 0){
					towers[i].x++;
					if(gameFrame % Math.round(slope) === 0){
						towers[i].y += slope;
					}
				}
				if(changeX > 0){
					towers[i].x--;
					if(gameFrame % Math.round(slope) === 0){
						towers[i].y -= slope;
					}
				}
			}
		}
	}
}
findWeakestTower = function(){
	weakestTower = [];
	weakestTowerHP = []
	for(var i = 0; i < towers.length; i++){
		if(towers[i].type != 2){
			weakestTower.push(i);
			weakestTowerHP.push(towers[i].hp);
		}
	}
	target = weakestTower[weakestTowerHP.indexOf(Math.min(...weakestTowerHP))];
	for(var i = 0; i < towers.length; i++){
		if(towers[i].type === 2){
			towers[i].healTarget = target;
		}
	}
}
healTowers = function(){
	for(var i = 0; i < towers.length; i++){
		if(gameFrame % towers[i].attackFrame === 0 
		&& towers[i].type === 2 && towers[i].move === false){
			towers[i].attackPowerRange = 5;
			towers[i].attackFrame = Math.round(Math.random()*120);
			towers[i].attackPower = Math.round((Math.random()*towers[i].attackPowerRange)+1);
			towers[towers[i].healTarget].hp += towers[i].attackPower;
			towers[towers[i].healTarget].hitFrame = 40;
		}
	}
}
drawMissText = function(){
	for(var i = 0; i < missText.length; i++){
		if(missText[i][2] > 0){
			c.fillStyle = 'white';
			c.font = "60 px Georgia";
			c.fillText("Miss!", missText[i][0] - 2, missText[i][1] - 2);
			missText[i][2]--;
		}

		if(missText[i][2] <= 0){
			missText.splice(i, 1);
			i = missText.length + 1;
		}
	}
}
drawBG = function(){
	c.fillStyle='gray'
	c.fillRect(0, 0, 512, 448);
}
//TOFIX: Borders on enemies to towers
detectCollision = function(){
	//towersBullets to enemies
	for(var i = 0; i < towersBullets.length; i++){
		for(var j = 0; j < enemies.length; j++){
			if(towersBullets[i].x > enemies[j].x - (enemies[j].width/2) - towersBullets[i].width + 1
			&& towersBullets[i].x < enemies[j].x + (enemies[j].width/2) + towersBullets[i].width - 1
			&& towersBullets[i].y > enemies[j].y - (enemies[j].height/2) - towersBullets[i].height + 1
			&& towersBullets[i].y < enemies[j].y + (enemies[j].height/2) + towersBullets[i].height - 1){
				damage = towersBullets[i].attackPower - enemies[j].defense;
				if(damage <= 0){
					damage = 1;
				}
				enemies[j].defense = Math.round((Math.random()*enemies[j].defenseRange)+1);
				enemies[j].hp -= damage;
				enemies[j].hitFrame = 40;
				towersBullets.splice(i, 1);
				//console.log("Tower " + i + " shoots enemy " + j + ". Enemy " + j + "'s HP is " + enemies[j].hp);

				if(enemies[j].hp <= 0){
					enemies.splice(j, 1);
					difficulty--;
					money += 5;
					points++;
					updateText();
				}

				i = towersBullets.length + 1;
				j = enemies.length + 1;
			}
		}
	}
	//enemies to towers
	for(var i = 0; i < towers.length; i++){
		for(var j = 0; j < enemies.length; j++){
			if(towers[i].x > enemies[j].x - (enemies[j].width/2) - (towers[i].width/2) + 1
			&& towers[i].x < enemies[j].x + (enemies[j].width/2) + (towers[i].width/2) - 1
			&& towers[i].y > enemies[j].y - (enemies[j].height/2) - (towers[i].height/2) + 1
			&& towers[i].y < enemies[j].y + (enemies[j].height/2) + (towers[i].height/2) - 1){
				enemies[j].move = false;
			}
		}
	}
	//towers to towers
	for(var i = 0; i < towers.length; i++){
		for(var j = 0; j < towers.length; j++){
			if(j != i && towers[j].type === 2
			&& towers[i].x > towers[j].x - (towers[j].width/2) - (towers[i].width/2) + 1
			&& towers[i].x < towers[j].x + (towers[j].width/2) + (towers[i].width/2) - 1
			&& towers[i].y > towers[j].y - (towers[j].height/2) - (towers[i].height/2) + 1
			&& towers[i].y < towers[j].y + (towers[j].height/2) + (towers[i].height/2) - 1){
				towers[j].move = false;
			}
		}
	}
}
updateText = function(){
	$('div#money').text('$' + money);
	$('div#points').text('Points: ' + points);
	$('div#towersDestroyed').text('Towers destroyed: ' + towersDestroyed);
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
	canvas.addEventListener('click', handleClick);
	
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
	healTowers();

	drawBG();
	drawTowers();
	drawEnemies();
	drawTowersBullets();
	drawMissText();
	drawMenu();

	moveEnemies();
	moveTowers();
	
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

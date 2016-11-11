var canvas = document.getElementById('canvas')
c = canvas.getContext('2d')

//Canvas images
var grassOne = new Image()
grassOne.src = 'images/grass-1.png'
var grassTwo = new Image()
grassTwo.src = 'images/grass-2.png'
var grassThree = new Image()
grassThree.src = 'images/grass-3.png'

var play = true
var difficulty = 500
var points = 0
var gameFrame = 1
var money = 100
var towersDestroyed = 0;
var missText = []
var menu = {}
var menuPresent = false

var bg = []

//Variables used for towers[]
var towers = [{
	type: 1,
	x: 246, 
	y: 214, 
	height: 40, 
	width: 40, 
	hp: 200,
	hpMax: 200,
	defense: Math.round((Math.random()*40)+1),
	defenseRange: 40,
	hitFrame: 0,
	range: 200, 
	actionPower: Math.round((Math.random()*40)+1),
	actionPowerRange: 40,
	actionFrame: Math.round(Math.random()*120), 
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

	if(enemiesStartLocation === 1){
		x = randX; 
		y = -20;
	} else if(enemiesStartLocation === 2){
		x = -20; 
		y = randY;
	} else if(enemiesStartLocation === 3){
		x = randX; 
		y = 448 + 20;
	} else if(enemiesStartLocation === 4){
		x = 512+20; 
		y = randY;
	}

	enemies.push(new Enemy(x, y));

	enemies[enemies.length - 1].findClosestTower();
}

function Enemy(x, y){
	this.x = x; 
	this.y = y; 
	this.target = 0;  
	this.hp = 100;
	this.defense = Math.round((Math.random()*20)+1);
	this.defenseRange = 20;
	this.hitFrame = 0;
	this.range = 0;
	this.height = 20;
	this.width = 20; 
	this.actionFrame = Math.round((Math.random()*60));
	this.actionFrameRate = 60; 
	this.actionPower = Math.round((Math.random()*40)+1);
	this.actionPowerRange = 40;
	this.attackAnimationFrame = 0;

	Enemy.prototype.draw = function(){
		if(this.attackAnimationFrame > 0){
			c.fillStyle='white';
			c.fillRect(this.x - this.width/2, this.y - this.height/2, this.width, this.height);
			this.attackAnimationFrame--;
		} else {
			c.fillStyle='red';
			c.fillRect(this.x - this.width/2, this.y - this.height/2, this.width, this.height);
			if(this.hitFrame > 0){
				c.fillStyle = 'white';
				c.font = "60 px Georgia";
				c.fillText(this.hp + "HP", this.x - 10, this.y);
				this.hitFrame--;
			}
		}	
	}
	Enemy.prototype.move = function(){
		this.findClosestTower();
		if(this.target < towers.length){
			closestTower = this.target;
			changeX = this.x - towers[closestTower].x;
			changeY = this.y - towers[closestTower].y;
			slope = changeY / changeX;

			//moving from right to left along X
			if(changeX > 0
			&& this.x > towers[closestTower].x 
			- (towers[closestTower].width/2) 
			- (this.width/2) + 1){
				this.x--;
			}
			//moving up along Y
			if(changeY > 0 &&
			this.y > towers[closestTower].y 
			+ (towers[closestTower].height/2) 
			+ (this.height/2) - 1){
				if(gameFrame % Math.round(slope) === 0){
					this.y -= slope;
				} else{
					this.y--;
				}
				
			}
			//moving from left to right along X
			if(changeX < 0
			&& this.x < towers[closestTower].x 
			+ (towers[closestTower].width/2) 
			+ (this.width/2) - 1){
				this.x++;
			}
			//moving down along Y
			if(changeY < 0 &&
			this.y < towers[closestTower].y 
			- (towers[closestTower].height/2) 
			- (this.height/2) + 1){
				if(gameFrame % Math.round(slope) === 0){
					this.y += slope;
				} else{
					this.y++;
				}
			}
		}
	}
	Enemy.prototype.findClosestTower = function(){
		closestTower = []
		for(var j = 0; j < towers.length; j++){
			a = Math.abs(this.x - towers[j].x) * Math.abs(this.x - towers[j].x);
			b = Math.abs(this.y - towers[j].y) * Math.abs(this.y - towers[j].y);
			closestTower.push(Math.sqrt(a + b));
		}
		this.target = closestTower.indexOf(Math.min(...closestTower));
	}
	Enemy.prototype.attack = function(){
		this.actionFrame = Math.round(Math.random()*this.actionFrameRate);
		if(this.target < towers.length
		&& this.targetWithinRange()){
			this.attackAnimationFrame = 10;
			this.actionFrame = Math.round((Math.random()*this.actionFrameRate));
			closestTower = this.target;
			damage = this.actionPower - towers[closestTower].defense;
			this.actionPower = Math.round((Math.random()*this.actionPowerRange)+1);
			towers[closestTower].defense = Math.round((Math.random()*towers[closestTower].defenseRange)+1);
			
			if(damage <= 0){
				damage = 1;
			}
			
			this.actionPower = Math.round((Math.random()*20)+1);
			towers[closestTower].defense = Math.round((Math.random()*towers[closestTower].defenseRange)+1);
			
			towers[closestTower].hp-=damage;
			towers[closestTower].hitFrame = 40;
			
			if(towers[closestTower].hp <= 0){
				towers.splice(closestTower, 1);
				towersDestroyed++;
				updateText();
				//towers[closestTower] = {};
			}
		}
	}
	Enemy.prototype.targetWithinRange = function(){
		if(Math.abs(this.x - towers[this.target].x) <= this.range 
			+ (towers[this.target].width / 2) + (this.width / 2)
		&& Math.abs(this.y - towers[this.target].y) <= this.range 
			+ (towers[this.target].height / 2) + (this.height / 2)){
			return true
		} else {
			return false
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
			hpMax: 100,
			defenseRange: 10,
			defense: Math.round((Math.random()*10)+1),
			hitFrame: 0,
			range: 100, 
			actionPower: Math.round((Math.random()*20)+1),
			actionPowerRange: 20,
			actionFrame: Math.round(Math.random()*120),
			attackSpeed: 3,
			healTarget: null,
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
		if(gameFrame % towers[i].actionFrame === 0
		&& enemies.length > 0 && towers[i].type != 2){
			findClosestEnemy();
			
			towers[i].actionFrame = Math.round(Math.random()*120);
			towers[i].actionPower = Math.round((Math.random()*towers[i].actionPowerRange)+1);
		
			if(enemies[towers[i].target].x > towers[i].x - towers[i].range
			&& enemies[towers[i].target].x < towers[i].x + towers[i].range
			&& enemies[towers[i].target].y > towers[i].y - towers[i].range
			&& enemies[towers[i].target].y < towers[i].y + towers[i].range){
				towersBullets.push({
					originTower: towers.indexOf(towers[i]),
					x: towers[i].x, 
					y: towers[i].y, 
					attackSpeed: towers[i].attackSpeed,
					actionPower: towers[i].actionPower, 
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
		towers[i].actionFrame = Math.round(Math.random()*120);
		towers[i].actionPower = Math.round((Math.random()*towers[i].actionPowerRange)+1);
		for(var j = 0; j < enemies.length; j++){
			a = Math.abs(towers[i].x - enemies[j].x) * Math.abs(towers[i].x - enemies[j].x);
			b = Math.abs(towers[i].y - enemies[j].y) * Math.abs(towers[i].y - enemies[j].y);
			closestEnemy.push(Math.sqrt(a + b));
		}
		towers[i].target = closestEnemy.indexOf(Math.min(...closestEnemy));
	}
}
//TOFIX: Some bullets not moving beyond tower.  No target?
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

			//moving from right to left
			if(changeX > 0
			&& towers[i].x > towers[weakestTowerTarget].x 
			- (towers[weakestTowerTarget].width/2) 
			- (towers[i].width/2) + 1){
				towers[i].x--;
				if(gameFrame % Math.round(slope) === 0
				&& towers[i].y > towers[weakestTowerTarget].y 
				+ (towers[weakestTowerTarget].height/2) 
				+ (towers[i].height/2) - 1){
					towers[i].y -= slope;
				}
			}
			//moving from left to right
			if(changeX < 0
			&& towers[i].x < towers[weakestTowerTarget].x 
			+ (towers[weakestTowerTarget].width/2) 
			+ (towers[i].width/2) - 1){
				towers[i].x++;
				if(gameFrame % Math.round(slope) === 0
				&& towers[i].y < towers[weakestTowerTarget].y 
				- (towers[weakestTowerTarget].height/2) 
				- (towers[i].height/2) + 1){
					towers[i].y += slope;
				}
			}
			else {
				healTowers(i);
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
healTowers = function(i){
//	for(var i = 0; i < towers.length; i++){
		if(gameFrame % towers[i].actionFrame === 0 
		&& towers[i].type === 2 && towers[i].move === false
		&& towers[towers[i].healTarget].hp < towers[towers[i].healTarget].hpMax){
			towers[i].actionPowerRange = 5;
			towers[i].actionFrame = Math.round(Math.random()*120);
			towers[i].actionPower = Math.round((Math.random()*towers[i].actionPowerRange)+1);
			if(money >= towers[i].actionPower){
				towers[towers[i].healTarget].hp += towers[i].actionPower;
				towers[towers[i].healTarget].hitFrame = 40;
				money -= towers[i].actionPower;
				updateText();
			}
		}
//	}
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
	c.fillStyle='rgba(153, 204, 102, 1.0)'
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
				damage = towersBullets[i].actionPower - enemies[j].defense;
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

	drawBG();

	for(var i = 0; i < enemies.length; i++){
		enemies[i].draw();
		enemies[i].move();
		if(gameFrame % enemies[i].actionFrame === 0){
			enemies[i].attack();
		}
	}

	
	drawTowers();
	drawTowersBullets();
	drawMissText();
	drawMenu();

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
		event.preventDefault();
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

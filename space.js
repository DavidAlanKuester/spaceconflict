let canvas;
let ctx;
let rocket_x = 340;
let rocket_y = 400;
let rocket_energy = 100;
let rocketIsMovingRight = false;
let rocketIsMovingLeft = false;
let rocketIsMovingUp = false;
let rocketIsMovingDown = false;
let CurrentRocketImage = 'img/rocket_normal.png';
let asteroidOffset_x = 0;
let asteroidOffset_y = 0;
let enemies = [];
let shootingTime = 0;
let shootingMissileTime = 0;
let placedMissiles = [];
let placedHealth = [];
let collectedMissiles = [0];

let AUDIO_HEALTH = new Audio('audio/health.mp3');
let AUDIO_MISSILELOAD = new Audio('audio/missile_load.mp3');
let AUDIO_DAMAGE1= new Audio('audio/damage1.mp3');
let AUDIO_DAMAGE2= new Audio('audio/damage2.mp3');
let AUDIO_DAMAGE3= new Audio('audio/damage3.mp3');
let AUDIO_MISSILESHOOT= new Audio('audio/missileshoot.mp3');

function init() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    draw();
    createEnemiesList();
    checkForMoving();
    calculateasteroidOffset();
    listenForKeys();
    calculateEnemieMovement();
    checkForCollision();
    spawnObjects();
}
function calculateasteroidOffset() {
    setInterval(function () {
        asteroidOffset_x = asteroidOffset_x + 0.2;
        asteroidOffset_y = asteroidOffset_y + 0.1;
    }, 50);
}

function calculateEnemieMovement() {
    setInterval(function () {
        for (i = 0; i < enemies.length; i = i + 1) {
            let enemie = enemies[i];
            enemie.position_x = enemie.position_x - 1;
        }
    }, 10)
}

function checkForCollision() {
    // Enemy Missile Collision
    setInterval(function () {
        for (i = 0; i < enemies.length; i = i + 1) {
            let enemie = enemies[i];
            if ((enemie.position_x - 40) < rocket_x && (enemie.position_x + 40) > rocket_x && (enemie.position_y - 50) < rocket_y && (enemie.position_y + 5) > rocket_y) {
                if (rocket_energy > 0) {
                    rocket_energy -= 20;
                    enemies.splice(i, 1);
                    AUDIO_DAMAGE3.play();
                }  
            }
        }

        // Collecting Missiles
        for (i = 0; i < placedMissiles.length; i = i + 1) {
            let missile = placedMissiles[i];
            if ((missile.x - 20) < rocket_x && (missile.x + 20) > rocket_x && (missile.y - 50) < rocket_y && (missile.y + 10) > rocket_y) {
                placedMissiles.splice(i, 1);
               AUDIO_MISSILELOAD.play();
               collectedMissiles++;
            }

        }
        // Collecting Health
        for (i = 0; i < placedHealth.length; i = i + 1) {
            let health = placedHealth[i];
            if ((health.x - 20) < rocket_x && (health.x + 20) > rocket_x && (health.y - 50) < rocket_y && (health.y + 10) > rocket_y) {
                placedHealth.splice(i, 1);
                rocket_energy = rocket_energy + 10;
                AUDIO_HEALTH.play();
            }
        }
    }, 50);
}

function spawnObjects() {
    setInterval(function () {
        if (placedMissiles.length < 4) {
            let missile = {
                x: 720 * Math.random(),
                y: 300 + (100 * Math.random()),
            };
            placedMissiles.push(missile);
        }
    }, 30000);
    
    setInterval(function () {
        if (placedHealth.length < 4) {
            let health = {
                x: 720 * Math.random(),
                y: 300 + (100 * Math.random()),
            };
            placedHealth.push(health);
        }
    }, 20000);
}

function createEnemiesList() {
    enemies = [];
    // Alienships
    for (let i = 0; i < 30; i++) {
        let enemie = createEnemies('1green', 720 + i * 150 + Math.random() * 50, 50 + Math.random() * 200, 0.15);
        enemies.push(enemie);
    }
    for (let i = 30; i < 60; i++) {
        let enemie = createEnemies('2green', 720 + i * 150 + Math.random() * 50, 50 + Math.random() * 200, 0.15);
        enemies.push(enemie);
    }
    for (let i = 60; i < 90; i++) {
        let enemie = createEnemies('1red', 720 + i * 150 + Math.random() * 50, 50 + Math.random() * 200, 0.15);
        enemies.push(enemie);
    }
    for (let i = 90; i < 120; i++) {
        let enemie = createEnemies('2red', 720 + i * 150 + Math.random() * 50, 50 + Math.random() * 200, 0.15);
        enemies.push(enemie);
    }
    for (let i = 0; i < 30; i++) {
        let enemie = createEnemies('1green', 720 + i * 150 + Math.random() * 50, 50 + Math.random() * 200, 0.15);
        enemies.push(enemie);
    }
    //AlienRams
    for (let i = 0; i < 60; i++) {
        let enemie = createEnemies('1ram', 720 + i * 300 + Math.random() * 50, 300 + Math.random() * 150, 0.1);
        enemies.push(enemie);
    }
}

function draw() {
    drawBackground();
    updateRocket();
    drawEnemies();
    drawItems();
    requestAnimationFrame(draw);
    drawshooting();
    drawEnergieBar();
    drawInfo();
    drawShootMissile();
}

function updateRocket() {
    let base_image = new Image();
    base_image.src = CurrentRocketImage;
    if (base_image.complete) {
        ctx.drawImage(base_image, rocket_x, rocket_y, base_image.width * 0.3, base_image.height * 0.3);
    }
}


function drawItems() {
    for (i = 0; i < placedMissiles.length; i = i + 1) {
        let missile = placedMissiles[i];
        drawBackgroundObject('img/rocket.png', missile.x, missile.y, 0.5);
    }
    for (i = 0; i < placedHealth.length; i = i + 1) {
        let health = placedHealth[i];
        drawBackgroundObject('img/hp.png', health.x, health.y, 0.2);
    }
}

function drawShootMissile() {
    let timepassed = new Date().getTime() - shootingMissileTime;
    shot_missile_x = rocket_x;
    shot_missile_y = rocket_y - (timepassed * 0.75);
    let base_image = new Image();
    base_image.src = 'img/shotrocket.png';
    if (base_image.complete) {
        ctx.drawImage(base_image, shot_missile_x, shot_missile_y, base_image.width * 0.5, base_image.height * 0.5);
    }
}

function drawshooting() {
    if (shootingTime) {
        let timePassed = new Date().getTime() - shootingTime;
        let shot_x = rocket_x + 16;
        let shot_y = rocket_y - (timePassed / 2);

        let base_image = new Image();
        base_image.src = 'img/shot.png';
        if (base_image.complete) {
            ctx.drawImage(base_image, shot_x, shot_y, base_image.width, base_image.height);
        }
    }
}

function drawEnergieBar() {
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = 'gray';
    ctx.fillRect(5, 455, 210, 20,);
    ctx.globalAlpha = 1;

    ctx.fillStyle = 'green';
    ctx.fillRect(10, 460, 2 * rocket_energy, 10);

}

function drawInfo() {
    let base_image = new Image();
    base_image.src = 'img/rocket.png';
    if (base_image.complete) {
        ctx.drawImage(base_image, 220, 453, base_image.width * 0.5, base_image.height * 0.5);
    }

    ctx.font = '24px calibry'
    ctx.fillStyle = 'white';
    ctx.fillText('x' + collectedMissiles, 230, 473)
}


function drawEnemies() {
    for (i = 0; i < enemies.length; i = i + 1) {
        let enemie = enemies[i]
        drawBackgroundObject(enemie.img, enemie.position_x, enemie.position_y, enemie.scale, 1);
    }

}

function createEnemies(type, position_x, position_y, scale) {
    return {
        "img": "img/alien_level" + type + ".png",
        "position_x": position_x,
        "position_y": position_y,
        "scale": scale,
    };
}


function checkForMoving() {
    setInterval(function () {
        if (rocketIsMovingRight) {
            CurrentRocketImage = 'img/rocketMovingRight.png';

        } else if (rocketIsMovingLeft) {
            CurrentRocketImage = 'img/rocketMovingLeft.png';

        } else if (rocketIsMovingUp) {
            CurrentRocketImage = 'img/rocketMovingUp.png';

        } else if (rocketIsMovingDown) {
            CurrentRocketImage = 'img/rocketMovingDown.png';

        } else {
            CurrentRocketImage = 'img/rocket_normal.png';
        }
    }, 200);

}

function drawBackground() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Stars
    drawBackgroundObject('img/bg-elements1.png', 300, 100, 0.1, 0.3);
    drawBackgroundObject('img/bg-elements2.png', 500, 300, 0.1, 0.8);
    drawBackgroundObject('img/bg-elements1.png', 400, 200, 0.1, 0.9);
    drawBackgroundObject('img/bg-elements2.png', 200, 400, 0.1, 0.5);

    // Draw Asteroids
    drawBackgroundObject('img/asteroid1.png', 350 - asteroidOffset_x, 250 + asteroidOffset_y, 0.5, 0.5);
    drawBackgroundObject('img/asteroid2.png', 380 - asteroidOffset_x, 500 + asteroidOffset_y, 0.5, 0.5);
    drawBackgroundObject('img/asteroid3.png', 190 - asteroidOffset_x, 40 + asteroidOffset_y, 0.5, 0.8);
    drawBackgroundObject('img/asteroid4.png', 620 - asteroidOffset_x, 380 + asteroidOffset_y, 0.5, 0.7);
    drawBackgroundObject('img/asteroid5.png', 550 - asteroidOffset_x, 90 + asteroidOffset_y, 0.5, 0.6);

}

function drawBackgroundObject(src, object_x, object_y, scale, opacity) {
    if (opacity != undefined) {
        ctx.globalAlpha = opacity;
    }
    ctx.globalAlpha = opacity;
    let base_image = new Image();
    base_image.src = src;
    if (base_image.complete) {
        ctx.drawImage(base_image, object_x, object_y, base_image.width * scale, base_image.height * scale);
    }
    ctx.globalAlpha = 1;
}

function listenForKeys() {
    document.addEventListener('keydown', e => {
        const k = e.key;
        if (k == 'ArrowRight') {
            if (rocket_x < 685) {
                rocket_x = rocket_x + 10;
                rocketIsMovingRight = true;
            }
        }
        if (k == 'ArrowLeft') {
            if (rocket_x > 5) {
            rocket_x = rocket_x - 10;
            rocketIsMovingLeft = true;
            }
        }
        if (k == 'ArrowUp') {
            if (rocket_y > 300) {
            rocket_y = rocket_y - 10;
            rocketIsMovingUp = true;
            }
        }
        if (k == 'ArrowDown') {
            if (rocket_y < 400) {
            rocket_y = rocket_y + 5;
            rocketIsMovingDown = true;
            }
        }

        if (k == 'd') {
            let timePassed = new Date().getTime() - shootingTime;
            if (timePassed > 100) {
                shootingTime = new Date().getTime();
            }

        }
        
        if (k == 's') {
            let timePassed = new Date().getTime() - shootingMissileTime;
            if (timePassed > 2000) {
                shootingMissileTime = new Date().getTime();
                AUDIO_MISSILESHOOT.play();
            }

        }
    })
    document.addEventListener('keyup', e => {
        const k = e.key;
        if (k == 'ArrowRight') {
            rocketIsMovingRight = false;
        }
        if (k == 'ArrowLeft') {
            rocketIsMovingLeft = false;
        }
        if (k == 'ArrowUp') {
            rocketIsMovingUp = false;
        }
        if (k == 'ArrowDown') {
            rocketIsMovingDown = false;
        }
    })
}
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
let shootingList = [];
let shootingMissileTime = 0;
let placedMissiles = [];
let placedHealth = [];
let placedHealth2 = [];
let collectedMissiles = [0];
let lastMissile_x = 0;
let enemyShootingList = [];
let shot_missile_y = 0;
let currentMissileImage = 'img/rocket.png';
let health1Images = ['hp1.1.png', 'hp1.2.png', 'hp1.3.png', 'hp1.4.png', 'hp1.5.png', 'hp1.4.png', 'hp1.3.png', 'hp1.2.png']
let health2Images = ['hp2.1.png', 'hp2.2.png', 'hp2.3.png', 'hp2.4.png', 'hp2.5.png', 'hp2.4.png', 'hp2.3.png', 'hp2.2.png']
let defeatedEnemies = [0];
let highScores = [];

// ----------- Constants -------------
let AUDIO_HEALTH = new Audio('audio/health.mp3');
let AUDIO_MISSILELOAD = new Audio('audio/missile_load.mp3');
let AUDIO_DAMAGE1 = new Audio('audio/damage1.mp3');
let AUDIO_DAMAGE2 = new Audio('audio/damage2.mp3');
let AUDIO_DAMAGE3 = new Audio('audio/damage3.mp3');
let AUDIO_MISSILESHOOT = new Audio('audio/missileshoot.mp3');

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
    enemyRandomShot();
    animateItems();
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



function enemyRandomShot() {
    setInterval(function () {
        let visibleEnemies = enemies.filter(function (enemy) {
            return enemy.position_x > 0 && enemy.position_x < 720;
        });
        let i = Math.floor(Math.random() * visibleEnemies.length);
        let randomEnemy = visibleEnemies[i];
        enemyShootingList.push({
            shot: 'img/enemyshot.png',
            position_x: randomEnemy.position_x,
            position_y: randomEnemy.position_y,
        });

    }, 1000);

}

function checkForCollision() {
    // Enemy Missile(Ram) & Rocket Collision
    setInterval(function () {
        for (let i = 0; i < enemies.length; i = i + 1) {
            let enemie = enemies[i];
            if ((enemie.position_x - 40) < rocket_x && (enemie.position_x + 40) > rocket_x && (enemie.position_y - 50) < rocket_y && (enemie.position_y + 5) > rocket_y) {
                if (rocket_energy > 0) {
                    rocket_energy -= 20;
                    if (rocket_energy < 0) {
                        rocket_energy = 0;
                    }
                    CurrentRocketImage = 'img/rocket_normallight.png'
                    setTimeout(function () {
                        enemie.img = 'img/rocket_normal.png'
                    }, 100);

                } 
                
                if (rocket_energy <= 0) {
                    CurrentRocketImage = 'img/destroyed.png';
                    rocket_energy = 0;
                    setTimeout(function () {
                        endgame();
                    }, 300);
                }
                console.log(rocket_energy);
                enemies.splice(i, 1);
                AUDIO_DAMAGE3.play();

            }
        }
        // Enemy NormalShot & Rocket Collision 
        for (let i = 0; i < enemyShootingList.length; i = i + 1) {
            let enemyShot = enemyShootingList[i];
            if ((rocket_x - 40) < enemyShot.position_x && (rocket_x + 40) > enemyShot.position_x && (rocket_y - 30) < enemyShot.position_y && (rocket_y + 30) > enemyShot.position_y) {
                if (rocket_energy > 0) {
                    rocket_energy -= 5;
                    CurrentRocketImage = 'img/rocket_normallight.png'
                    setTimeout(function () {
                        CurrentRocketImage = 'img/rocket_normal.png'
                    }, 100);
                } 
                
                if (rocket_energy <= 0) {
                    CurrentRocketImage = 'img/destroyed.png';
                    rocket_energy = 0;
                    setTimeout(function () {
                        endgame();
                    }, 300);
                }
                enemyShootingList.splice(i, 1);
                AUDIO_DAMAGE2.play();
            } else if (enemyShot.position_y > 440) {
                enemyShootingList.splice(i, 1);
            }
        }

        // Normal Rocket_Shot & Enemy collision
        for (let i = 0; i < enemies.length; i = i + 1) {
            let enemie = enemies[i];

            for (let j = 0; j < shootingList.length; j++) {
                let currentShot = shootingList[j];

                if ((enemie.position_x - 25) < currentShot.x && (enemie.position_x + 20) > currentShot.x && (enemie.position_y - 10) < currentShot.y && (enemie.position_y + 10) > currentShot.y) {
                    enemie.hp -= 10;
                    if (enemie.hp <= 0) {
                        enemie.img = 'img/destroyed.png';
                        setTimeout(function () {
                            enemies.splice(i, 1);
                        }, 250);
                        defeatedEnemies++;
                    } else {
                        if (enemie.img == 'img/alien_level2green.png') {
                            enemie.img = 'img/alien_level2greenlight.png';
                            setTimeout(function () {
                                enemie.img = 'img/alien_level2green.png'
                            }, 100);
                        }
                        else if (enemie.img == 'img/alien_level1red.png') {
                            enemie.img = 'img/alien_level1redlight.png';
                            setTimeout(function () {
                                enemie.img = 'img/alien_level1red.png'
                            }, 100);
                        }
                        else if (enemie.img == 'img/alien_level2red.png') {
                            enemie.img = 'img/alien_level2redlight.png';
                            setTimeout(function () {
                                enemie.img = 'img/alien_level2red.png'
                            }, 100);
                        }

                    }
                    shootingList.splice(j, 1);
                }
            }
        }

        // Rocket_Missile & Enemy collision
        for (let i = 0; i < enemies.length; i = i + 1) {
            let enemie = enemies[i];
            if ((enemie.position_x - 25) < lastMissile_x && (enemie.position_x + 20) > lastMissile_x && (enemie.position_y - 10) < shot_missile_y && (enemie.position_y + 10) > shot_missile_y) {
                enemie.hp -= 20;
                if (enemie.hp <= 0) {
                    enemie.img = 'img/destroyed.png';
                    setTimeout(function () {
                        enemies.splice(i, 1);
                    }, 250);
                    defeatedEnemies++;
                } else {
                    if (enemie.img == 'img/alien_level1red.png') {
                        enemie.img = 'img/alien_level1redlight.png';
                        setTimeout(function () {
                            enemie.img = 'img/alien_level1red.png'
                        }, 100);
                    }
                    else if (enemie.img == 'img/alien_level2red.png') {
                        enemie.img = 'img/alien_level2redlight.png';
                        setTimeout(function () {
                            enemie.img = 'img/alien_level2red.png'
                        }, 100);
                    }

                }
                shootingMissileTime = 0;
            }
        }

        // Collecting Missiles
        for (let i = 0; i < placedMissiles.length; i = i + 1) {
            let missile = placedMissiles[i];
            if ((missile.x - 20) < rocket_x && (missile.x + 20) > rocket_x && (missile.y - 50) < rocket_y && (missile.y + 10) > rocket_y) {
                placedMissiles.splice(i, 1);
                AUDIO_MISSILELOAD.play();
                collectedMissiles++;
            }

        }
        // Collecting Health
        for (let i = 0; i < placedHealth.length; i = i + 1) {
            let health = placedHealth[i];
            if ((health.x - 20) < rocket_x && (health.x + 20) > rocket_x && (health.y - 50) < rocket_y && (health.y + 10) > rocket_y) {
                placedHealth.splice(i, 1);
                if (rocket_energy < 100) {
                    rocket_energy = rocket_energy + 10;
                    if (rocket_energy > 100) {
                        rocket_energy = 100;
                    }
                    AUDIO_HEALTH.play();
                }
            }
        }

        // Collecting Health2
        for (i = 0; i < placedHealth2.length; i = i + 1) {
            let health2 = placedHealth2[i];
            if ((health2.x - 20) < rocket_x && (health2.x + 20) > rocket_x && (health2.y - 50) < rocket_y && (health2.y + 10) > rocket_y) {
                placedHealth2.splice(i, 1);
                if (rocket_energy < 100) {
                    rocket_energy = rocket_energy + 20;
                    if (rocket_energy > 100) {
                        rocket_energy = 100;
                    }
                    AUDIO_HEALTH.play();
                }
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
                imageIndex: 0
            };
            placedHealth.push(health);
        }
    }, 20000);

    setInterval(function () {
        if (placedHealth2.length < 4) {
            let health2 = {
                x: 720 * Math.random(),
                y: 300 + (100 * Math.random()),
                imageIndex: 0
            };
            placedHealth2.push(health2);
        }
    }, 40000);
}

function createEnemiesList() {
    enemies = [];
    // Alienships
    for (let i = 0; i < 30; i++) {
        let enemie = createEnemies('1green', 720 + i * 150 + Math.random() * 50, 50 + Math.random() * 200, 0.15, 10);
        enemies.push(enemie);
    }
    for (let i = 30; i < 60; i++) {
        let enemie = createEnemies('2green', 720 + i * 150 + Math.random() * 50, 50 + Math.random() * 200, 0.15, 20);
        enemies.push(enemie);
    }
    for (let i = 60; i < 90; i++) {
        let enemie = createEnemies('1red', 720 + i * 150 + Math.random() * 50, 50 + Math.random() * 200, 0.15, 30);
        enemies.push(enemie);
    }
    for (let i = 90; i < 120; i++) {
        let enemie = createEnemies('2red', 720 + i * 150 + Math.random() * 50, 50 + Math.random() * 200, 0.15, 40);
        enemies.push(enemie);
    }

    //AlienRams
    for (let i = 0; i < 60; i++) {
        let enemie = createEnemies('1ram', 720 + i * 300 + Math.random() * 50, 300 + Math.random() * 150, 0.1, '1', 10);
        enemies.push(enemie);
    }
}

function draw() {
    drawBackground();
    updateRocket();
    drawEnemies();
    drawItems();
    drawshooting();
    drawEnergieBar();
    drawInfo();
    drawShootMissile();
    drawEnemyShots();
    requestAnimationFrame(draw);
    loadHighscores();
}

function loadHighscores() {
    highScores = JSON.parse(localStorage.getItem('highScores')) || [];
}

function drawEnemyShots() {
    for (let i = 0; i < enemyShootingList.length; i = i + 1) {
        let currentShot = enemyShootingList[i];
        currentShot.position_y += 4;
        if (currentShot.position_y > 480) {
            enemyShootingList.splice(i, 1);
        }
        let base_image = new Image();
        base_image.src = 'img/enemyshot.png';
        if (base_image.complete) {
            ctx.drawImage(base_image, currentShot.position_x, currentShot.position_y, base_image.width, base_image.height);
        }
    }
}

function updateRocket() {
    let base_image = new Image();
    base_image.src = CurrentRocketImage;
    if (base_image.complete) {
        ctx.drawImage(base_image, rocket_x, rocket_y, base_image.width * 0.3, base_image.height * 0.3);
    }
}


function animateItems() {
    setInterval(function () {
        if (currentMissileImage == 'img/rocket.png') {
            currentMissileImage = 'img/rocketblink.png'
        } else {
            currentMissileImage = 'img/rocket.png'
            console.log(currentMissileImage)
        }

        for (i = 0; i < placedHealth.length; i = i + 1) {
            let health = placedHealth[i];
            health.imageIndex = (health.imageIndex + 1) % health1Images.length;
        }
        for (i = 0; i < placedHealth2.length; i = i + 1) {
            let health2 = placedHealth2[i];
            health2.imageIndex = (health2.imageIndex + 1) % health2Images.length;
        }
    }, 200);

}

function drawItems() {
    for (i = 0; i < placedMissiles.length; i = i + 1) {
        let missile = placedMissiles[i];
        drawBackgroundObject(currentMissileImage, missile.x, missile.y, 0.5);

    }
    for (i = 0; i < placedHealth.length; i = i + 1) {
        let health = placedHealth[i];
        drawBackgroundObject('img/' + health1Images[health.imageIndex], health.x, health.y, 0.2);
    }
    for (i = 0; i < placedHealth2.length; i = i + 1) {
        let health2 = placedHealth2[i];
        drawBackgroundObject('img/' + health2Images[health2.imageIndex], health2.x, health2.y, 0.2);
    }
}

function drawShootMissile() {
    let timepassed = new Date().getTime() - shootingMissileTime;
    let shot_missile_x = lastMissile_x + 13;
    shot_missile_y = rocket_y - (timepassed * 0.75);
    let base_image = new Image();
    base_image.src = 'img/shotrocket.png';
    if (base_image.complete) {
        ctx.drawImage(base_image, shot_missile_x, shot_missile_y, base_image.width * 0.5, base_image.height * 0.5);
    }
}

function drawshooting() {
    for (i = 0; i < shootingList.length; i = i + 1) {
        let currentShot = shootingList[i];
        let timePassed = new Date().getTime() - currentShot.shootingTime;
        shot_x = currentShot.x + 16;
        shot_y = rocket_y - (timePassed / 2);
        currentShot.y = shot_y;
        if (shot_y < 0) {
            shootingList.splice(i, 1);
        }

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
        ctx.drawImage(base_image, 220, 450, base_image.width * 0.5, base_image.height * 0.5);
    }

    ctx.font = '24px calibry'
    ctx.fillStyle = 'white';
    ctx.fillText('x' + collectedMissiles, 240, 473)

    ctx.font = '24px calibry'
    ctx.fillStyle = 'white';
    ctx.fillText('Kills: ' + defeatedEnemies, 290, 473)
}


function drawEnemies() {
    for (i = 0; i < enemies.length; i = i + 1) {
        let enemie = enemies[i]
        drawBackgroundObject(enemie.img, enemie.position_x, enemie.position_y, enemie.scale, 1);
        if (enemie.x < 0) {
            enemies.splice(i, 1);
        }
        if (enemies.length == 0) {
            endgame();
        }
    }

}

function createEnemies(type, position_x, position_y, scale, hp) {
    return {
        "img": "img/alien_level" + type + ".png",
        "position_x": position_x,
        "position_y": position_y,
        "scale": scale,
        "hp": hp,
    };
}

function endgame() {
    canvas.style.display = 'none';
    document.getElementById('gameover_menu').classList.remove('d-none');
    document.getElementById('exit').classList.add('d-none');
    AUDIO_DAMAGE1.volume = 0;
    AUDIO_DAMAGE2.volume = 0;
    AUDIO_DAMAGE3.volume = 0;
    AUDIO_MISSILESHOOT.volume = 0;
    AUDIO_HEALTH.volume = 0;
    AUDIO_MISSILELOAD.volume = 0;

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

function save_highscore() {
    let newScore = {
        'name': document.getElementById('player-name').value,
        'point': defeatedEnemies,
    };

    highScores.push(newScore)

    localStorage.setItem('highScores', JSON.stringify(highScores));
    window.location.href = 'start.html';
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
        if (e.code == 'Space') {
            let timePassed = new Date().getTime() - shootingTime;
            if (timePassed > 100) {
                shootingTime = new Date().getTime();
                shootingList.push({
                    x: rocket_x,
                    shootingTime: shootingTime,
                    y: rocket_y,
                }
                );
            }

        }
        if (k == 's' && collectedMissiles > 0) {
            let timePassed = new Date().getTime() - shootingMissileTime;
            lastMissile_x = rocket_x;
            if (timePassed > 2000) {
                shootingMissileTime = new Date().getTime();
                AUDIO_MISSILESHOOT.play();
                if (collectedMissiles > 0) {
                    collectedMissiles--;
                }

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
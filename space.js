let canvas;
let ctx;
let rocket_x = 340;
let rocket_y = 400;
let rocketIsMovingRight = false;
let rocketIsMovingLeft = false;
let rocketIsMovingUp = false;
let rocketIsMovingDown = false;
let CurrentRocketImage = 'img/rocket_normal.png';


function init() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    checkForMoving();
    draw();
    listenForKeys();
}
function draw() {
    drawBackground();
    updateRocket();
    requestAnimationFrame(draw);
}


function updateRocket() {
    let base_image = new Image();
    base_image.src = CurrentRocketImage;
    if (base_image.complete) {
        ctx.drawImage(base_image, rocket_x, rocket_y, base_image.width * 0.3, base_image.height * 0.3);
    }
}

function checkForMoving() {
    setInterval (function () {
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

    drawStars('img/bg-elements1.png', 300, 100, 0.1, 0.3);
    drawStars('img/bg-elements2.png', 500, 300, 0.1, 0.8);
    drawStars('img/bg-elements1.png', 400, 200, 0.1, 0.9);
    drawStars('img/bg-elements2.png', 200, 400, 0.1, 0.5);
}

function drawStars(src, star_x, star_y, scale, opacity) {
    if (opacity != undefined) {
        ctx.globalAlpha = opacity;
    }
    ctx.globalAlpha = opacity;
    let base_image = new Image();
    base_image.src = src;
    if (base_image.complete) {
        ctx.drawImage(base_image, star_x, star_y, base_image.width * scale, base_image.height * scale);
    }
    ctx.globalAlpha = 1;
}

function listenForKeys() {
    document.addEventListener('keydown', e => {
        const k = e.key;
        console.log(k);
        if (k == 'ArrowRight') {
            rocket_x = rocket_x + 10;
            rocketIsMovingRight = true;
        }
        if (k == 'ArrowLeft') {
            rocket_x = rocket_x - 10;
            rocketIsMovingLeft = true;
        }
        if (k == 'ArrowUp') {
            rocket_y = rocket_y - 10;
            rocketIsMovingUp = true;
        }
        if (k == 'ArrowDown') {
            rocket_y = rocket_y + 5;
            rocketIsMovingDown = true;
        }
    })
    document.addEventListener('keyup', e => {
        const k = e.key;
        console.log(k);
        if (k == 'ArrowRight') {
            rocket_x = rocket_x + 10;
            rocketIsMovingRight = false;
        }
        if (k == 'ArrowLeft') {
            rocket_x = rocket_x - 10;
            rocketIsMovingLeft = false;
        }
        if (k == 'ArrowUp') {
            rocket_y = rocket_y - 10;
            rocketIsMovingUp = false;
        }
        if (k == 'ArrowDown') {
            rocket_y = rocket_y + 5;
            rocketIsMovingDown = false;
        }
    })
}
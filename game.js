//canvas and 2d context
const canvas = document.getElementById("snakeCanvas");
const ctx = canvas.getContext("2d");

//define map
const map = {
    width: 20,
    height: 20
}

//define size of cubes (makes up the map - used to draw)
let cubeWidth = canvas.width/map.width;
let cubeHeight = canvas.height/map.height;

//define snake start position
const startX = Math.round(map.width/5);
const startY = Math.round(map.height/2);

//define snake & fruit
const snake = new Snake(startX, startY);
const fruit = new Fruit();

// keyinput "buffer"
let keyInput = [];

//deltatime
let startTime = Date.now();
const gameTick = 200;

//gamestates
let playing = true;
let paused = false;
let won = false;

//launch gameLoop
gameLoop();

function gameLoop() {
    requestAnimationFrame(gameLoop);

    if (Date.now() - startTime >= gameTick && playing && !paused && !won) {
        //update snake position
        snake.updateDirection(keyInput);
        snake.updatePosition();
        //check conditions
        snake.withinBounds(map.width, map.height);
        snake.checkEat(fruit);
        won = checkWin();
        //check if snake has hit itself
        playing = !snake.collision(snake.body[0].x, snake.body[0].y, 1);
        //update time
        startTime = Date.now();
    } 
    //draws canvas
    draw();
}


//If snake size is equal or bigger than map then the player won
function checkWin() {
    return (snake.body.length >= map.width * map.height);
}


//draw game - based on state
function draw() {
    //clear image
    ctx.fillStyle = 'rgb(50,50,50)';
    ctx.fillRect(0,0, canvas.width, canvas.height);

    //draw snake
    snake.draw(ctx, paused, playing);

    //draw fruit
    fruit.draw(ctx);
    
    //draw score - (kinda an afterthought just snake length (minus start length) times 5)
    ctx.textAlign = 'center';
    ctx.font='bold ' + canvas.width/30 + 'px Verdana';
    ctx.fillStyle = 'lightblue';
    ctx.fillText('Score: ' + (snake.body.length-3)*5, canvas.width/2, canvas.height * 0.05);

    //write winner
    ctx.font='bold ' + canvas.width/6 + 'px Verdana';
    if(won) {
        ctx.fillStyle = 'yellow';
        ctx.fillText('WINNER!', canvas.width/2,canvas.height/2);
    } 
    //write paused
    else if(paused) {
        ctx.fillStyle = 'white';
        ctx.fillText('PAUSED', canvas.width/2,canvas.height/2);
    }
}


//reset game to starting state
function reset(){
    //reset snake
    snake.direction = "RIGHT";
    snake.body = [{x: startX, y: startY}, {x: startX, y: startY}, {x: startX, y: startY}];
    //reset input
    keyInput = [];
    //place fruit
    fruit.place();
    playing = true;
    won = false;
}


//handles input
addEventListener("keydown", (e) => {
    switch(e.code) {
        //movement
        case "KeyW":
        case "ArrowUp":
            if (keyInput.length == 0) {
                if (snake.direction != "DOWN") {
                    keyInput.push("UP");
                } 
            } else {
                keyInput.push("UP");
            }
            break;
        case "KeyS":
        case "ArrowDown":
            if (keyInput.length == 0) {
                if (snake.direction != "UP") {
                    keyInput.push("DOWN");
                } 
            } else {
                keyInput.push("DOWN");
            }
            break;
        case "KeyA":
        case "ArrowLeft":
            if (keyInput.length == 0) {
                if (snake.direction != "RIGHT") {
                    keyInput.push("LEFT");
                } 
            } else {
                keyInput.push("LEFT");
            }    
            break;
        case "KeyD":
        case "ArrowRight":
            if (keyInput.length == 0) {
                if (snake.direction != "LEFT") {
                    keyInput.push("RIGHT");
                } 
            } else {
                keyInput.push("RIGHT");
            }
            break;
        //reset
        case "KeyR":
            reset();
            break;
        //pause
        case "KeyP":
            if (paused) {
                paused = false;
            } else {
                paused = true;
            }
            break;
    }
});

//handle window resize
window.addEventListener("resize", () => {
    //update canvas size
    canvas.height = 0.75 * window.innerHeight;
    canvas.width = canvas.height;

    //check that canvas still fits screen
    if (canvas.width > window.innerWidth) {
        canvas.width = window.innerWidth;
        canvas.height = canvas.width;
    }

    cubeWidth = canvas.width/map.width;
    cubeHeight = canvas.height/map.height;
});
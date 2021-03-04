const canvas = document.getElementById("snakeCanvas");
const ctx = canvas.getContext("2d");

//define map
const map = {
    width: 20,
    height: 20
}

//define snake start position
const startPos = {
    x: Math.round(map.width/5),
    y: Math.round(map.height/2)
}

//define snake
const snake = {
    direction: "RIGHT",
    //first index will be head
    body: [{x: startPos.x, y: startPos.y}, {x: startPos.x, y: startPos.y}, {x: startPos.x, y: startPos.y}]
}

//define fruit
const fruit = {
    x: 0,
    y: 0
}

// keyinput "buffer"
let keyInput = [];


//call start
start();


function start() {
    const gameTick = 100;
    placeFruit();

    //add keyboard input
    addEventListener("keydown", handleInput);

    //launch gameLoop
    setInterval(gameLoop, gameTick);
}

//gamestates
let playing = true;
let paused = false;
let won = false;

function gameLoop() {
    if (playing && !paused && !won) {
        //update snake position
        updateDirection();
        updatePosition();
        //check bounds
        withinBounds();
        //check fruit collision
        checkEat();
        //check win condition
        won = checkWin();
        //check if snake has hit itself snakeCollision(x,y, index) - index = the index of the snake we start checking from
        if(snakeCollision(snake.body[0].x, snake.body[0].y, 1)) {
            playing = false;
        }
    } 
    //draws canvas
    draw();
}

//check if snake is within map bounds
function withinBounds() {
    let x = snake.body[0].x;
    let y = snake.body[0].y;

    //check x
    if(x < 0) {
        snake.body[0].x = map.width-1;
    }else if(x == map.width) {
        snake.body[0].x = 0;
    }

    //check y
    if(y < 0) {
        snake.body[0].y = map.height-1;
    }else if(y == map.height) {
        snake.body[0].y = 0;
    }

}

//updates snake direction
function updateDirection() {
    if (keyInput.length != 0) {
        snake.direction = keyInput.shift();
    }
}


function updatePosition() {
    //update body
    for(let i = snake.body.length - 1; i > 0; i--) {
        snake.body[i].x = snake.body[i-1].x;
        snake.body[i].y = snake.body[i-1].y;
    }
    //update head
    switch (snake.direction){
        case "UP":
            snake.body[0].y--;
            break;
        case "DOWN":
            snake.body[0].y++;
            break;
        case "LEFT":
            snake.body[0].x--;
            break;
        case "RIGHT":
            snake.body[0].x++;
            break;
    }
}


function checkEat() {
    //check if head and fruit are at same position
   if (snake.body[0].x == fruit.x && snake.body[0].y == fruit.y) {
        //increase snake size
        for (let i = 0; i < 3; i++) {
            let x = snake.body[snake.body.length-1].x;
            let y = snake.body[snake.body.length-1].y;
          
            snake.body.push({x, y});
        }

        placeFruit();
   }
}

//place fruit random spot (that isn't "inside snake")
function placeFruit() {
    do{
        //place fruit
        fruit.x = Math.floor(Math.random() * map.width);
        fruit.y = Math.floor(Math.random() * map.height);
    }while(snakeCollision(fruit.x, fruit.y, 0));
}


function snakeCollision(x, y, indexStart) {
    //check it's not within snake
    for (let i = indexStart; i < snake.body.length; i++) {
        if(snake.body[i].x == x && snake.body[i].y == y) {
            return true;
        }
    }
    return false;
}

function checkWin() {
    //If snake size is equal or bigger than map then the player won
    return (snake.body.length >= map.width * map.height);
}


function draw() {
    //update canvas size
    canvas.height = 0.75 * window.innerHeight;
    canvas.width = canvas.height;


    //define size of cubes
    const cubeWidth = canvas.width/map.width;
    const cubeHeight = canvas.height/map.height

    //clear image
    ctx.fillStyle = 'rgb(50,50,50)';
    ctx.fillRect(0,0, canvas.width, canvas.height);
 

    ctx.strokeStyle = 'rgb(50,50,50)';
    ctx.lineWidth = 2;
    //draw snake
    for(let i = 0; i < snake.body.length; i++) {
        //snake blue if paused
        if (paused) {
            ctx.fillStyle = 'blue';
        }
        //snake red if dead (maybe find better name than playing)
        else if (!playing) {
            ctx.fillStyle = 'red';
        }
        //snake alive green
        else {
            ctx.fillStyle = 'green';
        }
    
        ctx.fillRect(snake.body[i].x*cubeWidth, snake.body[i].y*cubeHeight, cubeWidth, cubeHeight);
        ctx.strokeRect(snake.body[i].x*cubeWidth, snake.body[i].y*cubeHeight, cubeWidth, cubeHeight);
    }

    //draw fruit
    ctx.fillStyle = 'red';
    ctx.strokeStyle = 'brown';

    ctx.fillRect(fruit.x*cubeWidth, fruit.y*cubeHeight, cubeWidth, cubeHeight);
    ctx.strokeRect(fruit.x*cubeWidth, fruit.y*cubeHeight, cubeWidth, cubeHeight);



    //draw score - (kinda an afterthought just snake length (minus start length) times 5)
    ctx.font='bold ' + canvas.width/30 + 'px Verdana';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'lightblue';
    ctx.fillText('Score: ' + (snake.body.length-3)*5, canvas.width/2, canvas.height * 0.05);

    //write winner (if won lol)
    if(won) {
        ctx.font='bold ' + canvas.width/6 + 'px Verdana';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'yellow';
        ctx.fillText('WINNER!', canvas.width/2,canvas.height/2);
    }

    //write winner (if won lol)
    if(paused) {
        ctx.font='bold ' + canvas.width/6 + 'px Verdana';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'white';
        ctx.fillText('PAUSED', canvas.width/2,canvas.height/2);
    }
}


//reset method
function reset(){
    //reset snake
    snake.direction = "RIGHT";
    snake.body = [{x: startPos.x, y: startPos.y}, {x: startPos.x, y: startPos.y}, {x: startPos.x, y: startPos.y}];
    //reset input
    keyInput = [];
    //place fruit
    placeFruit();
    playing = true;
    won = false;
}


//handles input
function handleInput(e) {
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
}

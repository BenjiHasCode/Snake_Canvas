class Snake {
    constructor(startX, startY) {
        this.direction = "RIGHT";
        //first index will be head
        this.body = [{x: startX, y: startY}, {x: startX, y: startY}, {x: startX, y: startY}];
    }

    //updates snake direction based on array of input
    updateDirection(keyInput) {
        if (keyInput.length != 0) {
            this.direction = keyInput.shift();
        }
    }


    updatePosition() {
        //update body
        for(let i = this.body.length - 1; i > 0; i--) {
            this.body[i].x = this.body[i-1].x;
            this.body[i].y = this.body[i-1].y;
            }   
            //update head
            switch (this.direction){
                case "UP":
                    this.body[0].y--;
                    break;
                case "DOWN":
                    this.body[0].y++;
                    break;
                case "LEFT":
                    this.body[0].x--;
                    break;
                case "RIGHT":
                    this.body[0].x++;
                    break;
        }
    }

    withinBounds(xBound, yBound) {
        const x = this.body[0].x;
        const y = this.body[0].y;
    
        //check x
        if(x < 0) {
            this.body[0].x = xBound-1;
        }else if(x == xBound) {
            this.body[0].x = 0;
        }
    
        //check y
        if(y < 0) {
            this.body[0].y = yBound-1;
        }else if(y == yBound) {
            this.body[0].y = 0;
        }
    
    }

    checkEat(consumable) {
        //check if head and fruit are at same position
       if (this.body[0].x == consumable.x && this.body[0].y == consumable.y) {
            //increase snake size
            for (let i = 0; i < 3; i++) {
                let x = this.body[snake.body.length-1].x;
                let y = this.body[snake.body.length-1].y;
              
                this.body.push({x, y});
            }
            consumable.place();
       }
    }

    //returns true if snake collides with x and y - false if not
    //index is from which index, of the snake, we start checking (0 = head, 1 block after head, and so on)
    collision(x, y, indexStart) {
        //check it's not within snake
        for (let i = indexStart; i < this.body.length; i++) {
            if(this.body[i].x == x && this.body[i].y == y) {
                return true;
            }
        }
        return false;
    }


    draw(ctx, paused, playing) {
        ctx.strokeStyle = 'rgb(50,50,50)';
        ctx.lineWidth = 2;

        //find game state
        if (paused)         //snake blue if paused
            ctx.fillStyle = 'blue';
        else if (!playing)  //snake red if dead (maybe find better name than playing)
            ctx.fillStyle = 'red';
        else                //snake alive green
            ctx.fillStyle = 'green';
        
        //draw body
        for(let i = 0; i < this.body.length; i++) {
            ctx.fillRect(this.body[i].x*cubeWidth, this.body[i].y*cubeHeight, cubeWidth, cubeHeight);
            ctx.strokeRect(this.body[i].x*cubeWidth, this.body[i].y*cubeHeight, cubeWidth, cubeHeight);
        }
    }
}

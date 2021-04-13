class Fruit{
    constructor() {
        this.x;
        this.y;
        this.place();
    }

    //place fruit random spot (that isn't "inside snake")
    place() {
        do{
            //place fruit
            this.x = Math.floor(Math.random() * map.width);
            this.y = Math.floor(Math.random() * map.height);
        } while(snake.collision(this.x, this.y, 0));
    }

    draw(ctx) {
        ctx.fillStyle = 'red';
        ctx.strokeStyle = 'brown';
    
        ctx.fillRect(fruit.x*cubeWidth, fruit.y*cubeHeight, cubeWidth, cubeHeight);
        ctx.strokeRect(fruit.x*cubeWidth, fruit.y*cubeHeight, cubeWidth, cubeHeight);
    }
}

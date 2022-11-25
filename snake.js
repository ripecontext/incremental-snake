
class Snake {
    constructor() {

        this.position = [[2, 2], [1, 2]];
        this.direction = 2;

    }

    draw(){

        var canvas = document.getElementById("game_display_canvas");
        var ctx = canvas.getContext("2d");

        ctx.fillStyle = "#FFFFFF";

        for(let i = 0; i < this.position.length - 1; i++) {
            ctx.fillRect(this.position[i][0] * 10, this.position[i][1] * 10, 10, 10);
        }

    }

    move() {

        const directions = [[0, -1], [1, 0], [0, 1], [-1, 0]];
        let next_cell = this.position[this.position.length - 1];

        next_cell = [next_cell[0] + directions[this.direction][0], next_cell[1] + directions[this.direction][1]];
        this.position.push(next_cell);

    }

    set_direction(direction) {
        this.direction = direction;
    }
}

class GameManager {

    constructor(snake) {
        this.snake = snake;
    }

    on_key_press(event) {

        const W_KEY = 87;
        const A_KEY = 65;
        const S_KEY = 83;
        const D_KEY = 68;
    
        const keyPressed = event.keyCode;
    
        switch(keyPressed) {
            case W_KEY:
                this.snake.direction = 0;
                break;
            case A_KEY:
                this.snake.set_direction(3);
                break;
            case S_KEY:
                this.snake.set_direction(2);
                break;
            case D_KEY:
                this.snake.set_direction(1);
                break;
        }
    
    }
}

function main() {

    let snake = new Snake();
    let manager = new GameManager(snake);
    running = true;

    document.addEventListener("keydown", manager.on_key_press);

    gameLoop(manager, running)

}

function gameLoop(manager, running) {
    setTimeout(function onTick() {
        manager.snake.move();
        manager.snake.draw();

        if (running) {
            gameLoop(manager, running);
        }
    }, 100)
}



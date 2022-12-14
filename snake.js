
class Snake {
    

    constructor(board_size) {

        this.position = [[1, 2], [2, 2], [3, 2]];
        this.direction = 2;

        this.board_size = board_size;

    }

    draw(food_position){

        var canvas = document.getElementById("game_display_canvas");
        var ctx = canvas.getContext("2d");

        ctx.fillStyle = "#222222";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#FF0000";
        ctx.fillRect(food_position[0] * 10, food_position[1] * 10, 10, 10);

        ctx.fillStyle = "#FFFFFF";

        for(let i = 0; i < this.position.length - 1; i++) {
            ctx.fillRect(this.position[i][0] * 10, this.position[i][1] * 10, 10, 10);
        }

    }

    move(has_eaten) {

        const directions = [[0, -1], [1, 0], [0, 1], [-1, 0]];
        let next_cell = this.position[this.position.length - 1];

        let dead = this.isDead()

        next_cell = [next_cell[0] + directions[this.direction][0], next_cell[1] + directions[this.direction][1]];
        this.position.push(next_cell);

        if (!has_eaten) {
            this.position.shift();
        }

        return dead

    }

    isDead() {

        let head_position = this.position.at(-1);

        if (isArrayItemInArray(head_position, this.position.slice(0,-1))) {
            console.log("In Body");
            return true;
        }

        if (!((0 <= head_position[0] && head_position[0] < this.board_size) && (0 <= head_position[1] && head_position[1] < this.board_size))) {
            console.log("In Wall");
            return true;
        }
        return false;

    }

    set_direction(direction) {
        this.direction = direction;
    }
}

class GameManager {

    constructor(snake) {
        this.snake = snake;
        this.document = document;

        document.addEventListener("keydown", this.on_key_press.bind(this));
    }

    on_key_press(event) {

        const W_KEY = 87;
        const A_KEY = 65;
        const S_KEY = 83;
        const D_KEY = 68;
    
        let keyPressed = event.keyCode;
    
        switch(keyPressed) {
            case W_KEY:
                this.snake.set_direction(0);
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

function isArrayItemInArray(item, array) {

    item = JSON.stringify(item);
    array = JSON.stringify(array);

    return (array.indexOf(item) >= 0)

}

function main() {

    const board_size = 40

    const snake = new Snake(board_size);
    const manager = new GameManager(snake, document);

    var food_position = [Math.floor(Math.random() * board_size), Math.floor(Math.random() * board_size)];

    var running = true;

    gameLoop(manager, running, food_position);

}

function gameLoop(manager, running, food_position) {
    setTimeout(function onTick() {
        has_eaten = false;
        board_size = manager.snake.board_size;

        while (isArrayItemInArray(food_position, manager.snake.position)) {
            has_eaten = true;
            food_position = [Math.floor(Math.random() * (board_size)), Math.floor(Math.random() * (board_size))];
        }

        running = !manager.snake.move(has_eaten);
        manager.snake.draw(food_position);

        //console.log(running);

        if (running) {
            gameLoop(manager, running, food_position);
        }
    }, 100)
}



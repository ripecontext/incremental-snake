
class Snake {
    

    constructor(board_size) {

        this.position = [[3, 3], [3, 2]];
        this.direction = 2;
        this.score = 0;

        this.board_size = board_size;

    }

    draw(food_position){

        const scale = 320 / this.board_size;

        var canvas = document.getElementById("game_display_canvas");
        var ctx = canvas.getContext("2d");

        ctx.fillStyle = "#222222";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#FF0000";
        ctx.fillRect(food_position[0] * scale, food_position[1] * scale, scale, scale);

        ctx.fillStyle = "#FFFFFF";

        for(let i = 0; i < this.position.length - 1; i++) {
            ctx.fillRect(this.position[i][0] * scale, this.position[i][1] * scale, scale, scale);
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
        } else {
            this.score += 1;
        }

        return dead

    }

    isDead() {

        let head_position = this.position.at(-1);

        if (is_array_item_in_array(head_position, this.position.slice(0,-1))) {
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



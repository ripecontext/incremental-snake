
class Snake {
    

    constructor(board_size) {

        this.position = [[3, 3], [3, 2]];
        this.direction = 2;
        this.score = 0;

        this.board_size = board_size;

    }

    draw(food_position){

        const canvas = document.getElementById("game_display_canvas");
        const ctx = canvas.getContext("2d");

        ctx.setTransform(1, 0, 0, 1, 0, 0);

        ctx.scale(canvas.width / this.board_size, canvas.height / this.board_size);

        ctx.fillStyle = "#222222";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#FF0000";
        ctx.fillRect(food_position[0], food_position[1], 1, 1);

        ctx.fillStyle = "#FFFFFF";

        for(let i = 0; i < this.position.length - 1; i++) {
            ctx.fillRect(this.position[i][0], this.position[i][1], 1, 1);
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



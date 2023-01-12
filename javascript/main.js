function main() {

    document.getElementById("stage_two_content").style.display = 'none';
    document.getElementById("stage_three_content").style.display = 'none';
    document.getElementById("reset_button").style.display = 'none';
    document.getElementById("real_reset_button").style.display = 'none';
    document.getElementById("shop_display").style.display = 'block';
    document.getElementById("shop_button").className += " active";

    const board_size = 10

    const snake = new Snake(board_size);
    manager = new GameManager(snake);

    if (localStorage.getItem("manager_state") === null) {
        manager.clear_data();
    }

    if (typeof(Storage) !== undefined) {
        manager.load_data();
    }
    manager.update_GUI();

}

function gameLoop(running, food_position) {


    if (!manager.game_in_progress){
        document.getElementById("start_game_button").disabled = true;
        manager.snake.position = [[3, 3], [3, 2]];
        manager.snake.score = 0;
        manager.snake.direction = 2;
        manager.game_in_progress = true;
    }

    setTimeout(function onTick() {
        has_eaten = false;
        board_size = this.manager.multipliers["board_size"];

        while (is_array_item_in_array(food_position, manager.snake.position)) {
            has_eaten = true;
            food_position = [Math.floor(Math.random() * (board_size)), Math.floor(Math.random() * (board_size))];
        }


        if (document.getElementById("autopilot_checkbox").checked) {
            manager.snake.direction = manager.decide_direction(food_position);
        } else if (manager.movement_queue.length > 0){
            manager.snake.direction = manager.movement_queue.shift();
        }

        running = !manager.snake.move(has_eaten);
        manager.snake.draw(food_position);
        
        manager.update_GUI();

        if (running) {
            gameLoop(running, food_position);
        } else {

            //apply scores to money
            manager.currency += (manager.snake.score ** manager.multipliers["score_exponent"]) * manager.multipliers["score_multiplier"];

            //update labels
            manager.update_GUI();
            document.getElementById("start_game_button").disabled = false;
            manager.game_in_progress = false;

            //save progress
            manager.save_data();

            if (document.getElementById("auto_restart_checkbox").checked) {
                gameLoop(running, food_position);
            }
        }
    }, manager.multipliers["game_speed"]);
}
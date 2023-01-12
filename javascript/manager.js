class GameManager {

    constructor(snake) {
        this.snake = snake;
        this.movement_queue = [];
        this.currency = 0;

        this.game_in_progress = false;
        this.stage = 1;

        this.multipliers = {"score_multiplier": 1, "score_exponent": 1, "board_size": 10, "game_speed": 150}; 
        this.autopilots = {"distance_to_food": false, "wall_detection": false, "area_detection": true};

        this.buttons = [];
        this.buttons.push([new PurchaseButton(4, 3, 100), "score_multiplier", "Upgrade Score Multiplier"]);
        this.buttons.push([new PurchaseButton(10, 4, 100), "score_exponent", "Upgrade Score Exponent"]);
        this.buttons.push([new PurchaseButton(1000, 10**6, 5), "board_size", "Upgrade Board Size"]);
        this.buttons.push([new PurchaseButton(1000000, 0, 1), "stage_two_button", "Unlock Stage Two"]);
        this.buttons.push([new PurchaseButton(1000000, 0, 1), "distance_to_food_unlock", "Unlock Distance to Food"]);
        this.buttons.push([new PurchaseButton(100000000, 0, 1), "wall_detection_unlock", "Unlock Wall and Body Detection"]);
        this.buttons.push([new PurchaseButton(10000000000, 0, 1), "area_detection_unlock", "Unlock Area Detection"]);
        this.buttons.push([new PurchaseButton(1000000000000, 0, 1), "stage_three_button", "Unlock Stage Three"]);
        this.buttons.push([new PurchaseButton(1000000000000, 5, 33), "game_speed", "Upgrade Game Speed"]);

        document.addEventListener("keydown", this.on_key_press.bind(this));
    }

    on_key_press(event) {

        const W_KEY = 87;
        const A_KEY = 65;
        const S_KEY = 83;
        const D_KEY = 68;
    
        let keyPressed = event.keyCode;

        if (this.movement_queue.length < 3) {

            switch(keyPressed) {
                case W_KEY:
                    this.movement_queue.push(0);
                    break;
                case A_KEY:
                    this.movement_queue.push(3);
                    break;
                case S_KEY:
                    this.movement_queue.push(2);
                    break;
                case D_KEY:
                    this.movement_queue.push(1);
                    break;
            }

        }

    }

    decide_direction(food_position) {

        const directions = [[0, -1], [1, 0], [0, 1], [-1, 0]];
        var costs = [0, 0, 0, 0];

        const head_position = this.snake.position.at(-1); 
        const board_size = this.multipliers["board_size"]

        for (var i = 0; i < 4; i++) {

            var new_head_position = [head_position[0] + directions[i][0], head_position[1] + directions[i][1]];

            if (this.autopilots["distance_to_food"]) {

                costs[i] += euclidian_distance(new_head_position, food_position);

            }

            if (this.autopilots["wall_detection"]) {

                if (!(0 <= new_head_position[0] && new_head_position[0] < board_size) && !(0 <= new_head_position[1] && new_head_position[1] < board_size)) {

                    costs[i] += 1000;

                } else if (is_array_item_in_array(new_head_position, this.snake.position)) {
                    
                    costs[i] += 1000;

                }

            }

            if (this.autopilots["area_detection"]) {

                costs[i] -= 100 * this.area_detection(new_head_position);

            }

        }

        const cost_minimum = Math.min.apply(null, costs);
        return costs.indexOf(cost_minimum);
        
    }

    area_detection(starting_position) {

        const directions = [[0, -1], [1, 0], [0, 1], [-1, 0]];
        const board_size = this.multipliers["board_size"];

        var visited = [starting_position];
        var blocked = [];
        
        while (visited.length > 0 && blocked.length < 40) {

            var current_node = visited.at(0);
            blocked.push(visited.shift());

            for (var i = 0; i < 4; i++) {
                var next_node = [current_node[0] + directions[i][0], current_node[1] + directions[i][1]];

                if ((0 <= next_node[0] && next_node[0] < board_size) && (0 <= next_node[1] && next_node[1] < board_size)) {

                    if (!(is_array_item_in_array(next_node, this.snake.position)) && !(is_array_item_in_array(next_node, visited))) {

                        visited.push(next_node);

                    }
                    
                }
            }
            
        }

        return blocked.length;

    }

    purchase_button_clicked(id) {

        var button = -1;

        for (var i = 0; i < this.buttons.length; i++) {
            if (this.buttons[i][1] == id) {
                button = this.buttons[i];
            }
        }

        switch(button[1]){
            case "score_multiplier":
                if (button[0].on_click()){
                    this.multipliers["score_multiplier"] *= 2;
                }
                break;

            case "score_exponent":
                if (button[0].on_click()){
                    this.multipliers["score_exponent"] += 0.1;
                }
                break;

            case "board_size":
                if (button[0].on_click()){
                    this.multipliers["board_size"] *= 2;
                    this.snake.board_size = this.multipliers["board_size"];
                }
                break;
            
            case "stage_two_button":
                if (button[0].on_click()) {
                    this.stage = 2;
                }
                break;
            
            case "distance_to_food_unlock":
                if (button[0].on_click()) {
                    this.autopilots["distance_to_food"] = true;
                }
                break;

            case "wall_detection_unlock":
                if (button[0].on_click()) {
                    this.autopilots["wall_detection"] = true;
                }
                break;

            case "area_detection_unlock":
                if (button[0].on_click()) {
                    this.autopilots["area_detection"] = true;
                }
                break;

            case "stage_three_button":
                if (button[0].on_click()) {
                    this.stage = 3;
                }
                break;

            case "game_speed":
                if (button[0].on_click()) {
                    this.multipliers["game_speed"] *= 0.9;
                }
                break;
        }

        this.update_GUI();

    }

    update_GUI() {

        for (var i = 0; i < this.buttons.length; i++) {

            var button = document.getElementById(this.buttons[i][1]);

            if (this.buttons[i][0].price_multiplier === 0) {

                if (this.buttons[i][0].price > 0) {

                    button.innerHTML = `${this.buttons[i][2]}<br>Cost: ${display_logarithmically(this.buttons[i][0].price)}`;

                } else {

                    button.innerHTML = this.buttons[i][2];

                    if (this.stage >= 2) {
                        document.getElementById("stage_two_content").style.display = 'block';
                    } 
                    if (this.stage >= 3) {
                        document.getElementById("stage_three_content").style.display = 'block';
                    }

                }

            } else {

                button.innerHTML = `${this.buttons[i][2]}<br>Current Value: ${display_logarithmically(this.multipliers[this.buttons[i][1]])}<br>Cost: ${display_logarithmically(this.buttons[i][0].price)}`;

            }

            if (this.currency >= this.buttons[i][0].price) {
                button.disabled = false;
            } else {
                button.disabled = true;
            }

        }

        this.update_label_by_id("currency_counter", "Money: £" + display_logarithmically(manager.currency));
        manager.update_label_by_id("score_counter", "Score: " + String(display_logarithmically(manager.snake.score)));
        manager.update_label_by_id("money_equation", String(`(${display_logarithmically(manager.snake.score)} ^ ${display_logarithmically(manager.multipliers["score_exponent"])}) * ${display_logarithmically(manager.multipliers["score_multiplier"])} = ${display_logarithmically((manager.snake.score ** manager.multipliers["score_exponent"]) * manager.multipliers["score_multiplier"])}`));


    }

    update_label_by_id(id, text) {

        document.getElementById(id).innerHTML = String(text);

    }

    save_data() {
        const auto_restart_on = document.getElementById("auto_restart_checkbox").checked;
        const auto_pilot_on = document.getElementById("autopilot_checkbox").checked;

        localStorage.setItem("manager_state", `${this.currency};${(auto_restart_on) ? 1 : 0};${(auto_pilot_on) ? 1 : 0}`);
        var upgrade_string = "";
        for (var i = 0; i < this.buttons.length; i++) {
            upgrade_string += this.buttons[i][0].upgrade_amount + ";";
        }
        localStorage.setItem("upgrades", upgrade_string);
    }

    load_data() {
        this.currency = 10 ** 200; //to get all upgrades

        //retrieve manager state
        var manager_state_data = localStorage.getItem("manager_state");
        manager_state_data = manager_state_data.split(";");
        
        document.getElementById("auto_restart_checkbox").checked = (manager_state_data[1] == 1);
        document.getElementById("autopilot_checkbox").checked = (manager_state_data[2] == 1);

        var end_currency = Number(manager_state_data[0]);

        //retrieve upgrade data

        var upgrades_data = localStorage.getItem("upgrades");
        upgrades_data = upgrades_data.split(";");

        for (var i = 0; i < upgrades_data.length; i++) {

            for (var j = 0; j < upgrades_data[i]; j++) {

                manager.purchase_button_clicked(this.buttons[i][1]);
            }

        }

        this.currency = end_currency;

    }

    clear_data() {
        localStorage.setItem("manager_state", "0;1");
        localStorage.setItem("upgrades", "0;0;0;0;0;0;0;0");
        window.location.reload();
    }
}
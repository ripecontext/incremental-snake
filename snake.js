
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

class GameManager {

    constructor(snake) {
        this.snake = snake;
        this.currency = 0;

        this.game_in_progress = false;
        this.stage = 1;

        this.multipliers = {"score_multiplier": 1, "score_exponent": 1, "board_size": 10, "game_speed": 100};
        this.autopilots = {"distance_to_food": false, "wall_detection": false, "area_detection": false};

        this.buttons = [];
        this.buttons.push([new PurchaseButton(4, 2.4, 100), "score_multiplier", "Upgrade Score Multiplier"]);
        this.buttons.push([new PurchaseButton(10, 3.2, 100), "score_exponent", "Upgrade Score Exponent"]);
        this.buttons.push([new PurchaseButton(1000, 10**8, 3), "board_size", "Upgrade Board Size"]);
        this.buttons.push([new PurchaseButton(1000000, 0, 1), "stage_two_button", "Unlock Stage Two"]);
        this.buttons.push([new PurchaseButton(1000000, 0, 1), "distance_to_food_unlock", "Unlock Distance to Food"]);
        this.buttons.push([new PurchaseButton(100000000, 0, 1), "wall_detection_unlock", "Unlock Wall and Body Detection"]);
        this.buttons.push([new PurchaseButton(10000000000, 0, 1), "area_detection_unlock", "Unlock Area Detection"]);
        this.buttons.push([new PurchaseButton(1000000000000, 0, 1), "stage_three_button", "Unlock Stage Three"]);
        this.buttons.push([new PurchaseButton(1000000000000, 2, 44), "stage_three_button", "Unlock Stage Three"]);

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

                } else if (this.autopilots["area_detection"]) {

                    costs[i] -= 1000 * this.area_detection(new_head_position);
    
                }

            }

        }

        const cost_minimum = Math.min.apply(null, costs);
        return costs.indexOf(cost_minimum);
        
    }

    area_detection(starting_position) {

        const directions = [[0, -1], [1, 0], [0, 1], [-1, 0]];

        var visited = [starting_position];
        var blocked = [];
        
        while (visited.length > 0 && blocked.length < this.snake.position.length) {

            var current_node = visited.at(0);
            blocked.push(visited.shift());

            for (var i = 0; i < 4; i++) {
                var next_node = [current_node[0] + directions[i][0], current_node[1] + directions[i][1]];

                if ((0 <= next_node[0] && next_node[0] < this.board_size) && (0 <= next_node[1] && next_node[1] < this.board_size)) {

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

            case "game_speed_button":
                if (button[0].click()) {
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
                        document.getElementById("stage_two_content").style.visibility = 'visible';
                    }

                }

            } else {

                button.innerHTML = `${this.buttons[i][2]}<br>Current Value: ${display_logarithmically(this.multipliers[this.buttons[i][1]])}<br>Cost: ${display_logarithmically(this.buttons[i][0].price)}`;

            }

            if (this.currency >= this.buttons[i][0].price) {
                button.style.borderColor = "green";
            } else {
                button.style.borderColor = "red";
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
        localStorage.setItem("manager_state", `${this.currency};${this.stage}`);
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
    }
}

class PurchaseButton {

    constructor(starting_value, price_multiplier, max_level) {

        this.price = starting_value;
        this.price_multiplier = price_multiplier;
        this.max_level = max_level
        this.upgrade_amount = 0;

    }

    on_click() {

        if (manager.currency >= this.price && this.upgrade_amount <= this.max_level) {
            manager.currency -= this.price;
            this.price *= this.price_multiplier;
            this.upgrade_amount += 1;
            return true;
        }

        return false;

    }

}

// --------------miscelaneous tools--------------------------

function round_to_dp(places, number) {
    return Math.round(number * (10 ** places)) / (10 ** places);
}

function display_logarithmically(number) {

    if (number == 0) {
        return 0;
    } else if (number >= 1000 || number < 0.01) {
        const exponent = Math.floor(Math.log10(number));
        const mantissa = round_to_dp(2, number / (10**exponent));
        return `${mantissa}e${exponent}`;
    } else {
        return round_to_dp(2, number);
    }
}

function is_array_item_in_array(item, array) {

    item = JSON.stringify(item);
    array = JSON.stringify(array);

    return (array.indexOf(item) >= 0);

}

function euclidian_distance(point_one, point_two) {
    x_difference = point_two[0] - point_one[0];
    y_difference = point_two[1] - point_one[1];

    return Math.sqrt(x_difference**2 + y_difference**2);
}

function give_money(amount) {
    manager.currency += amount;
}

function sleep(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

// --------------initialising and main game loop----------------

function main() {

    document.getElementById("stage_two_content").style.visibility = 'hidden';

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
        }

        running = !manager.snake.move(has_eaten);
        manager.snake.draw(food_position);
        
        manager.update_GUI();

        if (running) {
            gameLoop(running, food_position);
        } else {

            //apply scores to money
            manager.currency += (manager.snake.score ** manager.multipliers["score_exponent"]) * manager.multipliers["score_multiplier"];
            
            //set up snake for next round
            manager.snake.position = [[3, 3], [3, 2]];
            manager.snake.score = 0;
            manager.snake.direction = 2;

            //update labels
            manager.update_GUI();
            manager.update_label_by_id("money_equation", String(`(Score ^ Score Exponent) * Score Multiplier = Money`));
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



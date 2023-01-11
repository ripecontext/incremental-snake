class PurchaseButton {

    constructor(starting_value, price_multiplier, max_level) {

        this.price = starting_value;
        this.price_multiplier = price_multiplier;
        this.max_level = max_level
        this.upgrade_amount = 0;

    }

    on_click() {

        if (manager.currency >= this.price && this.upgrade_amount < this.max_level) {
            manager.currency -= this.price;
            this.price *= this.price_multiplier;
            this.upgrade_amount += 1;
            return true;
        }

        return false;

    }

}

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

function uncover_reset_button() {
    document.getElementById("reset_button").style.display = 'block';
}

function uncover_real_reset_button() {
    document.getElementById("real_reset_button").style.display = 'block';
}

function give_money(amount) {
    manager.currency += amount;
}

function sleep(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

function openTab(evt, tabName) {
    var i, tabcontent, tablinks;

    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";

}
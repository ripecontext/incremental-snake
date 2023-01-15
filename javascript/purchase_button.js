class PurchaseButton {

    constructor(id, currency, starting_value, price_multiplier, max_level, display_text) {

        this.id = id;
        this.display_text = display_text;

        this.price = starting_value;
        this.currency = currency;
        this.price_multiplier = price_multiplier;
        this.max_level = max_level;
        this.upgrade_amount = 0;

    }

    show(currency, multipliers) {

        const button = document.getElementById(this.id);

        if (this.price_multiplier == 0) {
        
            if (this.price > 0) {

                button.innerHTML = `${this.display_text}<br>Cost: ${display_logarithmically(this.price)}`;

            } else {

                button.innerHTML = this.display_text;

            }

        } else {

            button.innerHTML = `${this.display_text}<br>Current Value: ${display_logarithmically(multipliers[this.id])}<br>Cost: ${display_logarithmically(this.price)}`;

        }

        if (currency[this.currency] >= this.price) {
            button.disabled = false;
        } else {
            button.disabled = true;
        }

    }

    on_click(currency) {

        console.log(currency);

        if (currency[this.currency] >= this.price && this.upgrade_amount < this.max_level) {
            currency[this.currency] -= this.price;
            this.price *= this.price_multiplier;
            this.upgrade_amount += 1;
            return true;
        }

        return false;

    }

}
import { getLocalStorage } from "./utils.mjs";

export default class CheckoutProcess{
    constructor(key, outputSelector) {
        this.key = key;
        this.outputSelector = outputSelector;
        this.list = [];
        this.itemTotal = 0;
        this.shipping = 0;
        this.tax = 0;
        this.orderTotal = 0;
    }

    init() {
        this.list = getLocalStorage(this.key);
        this.calculateOrderTotal();
    }

    calculateOrderTotal() {
        let subtotal = 0;

        this.list.forEach(item => {
            const qty = item.quantity || 1;
            subtotal += item.FinalPrice * qty;
        });

        this.itemTotal = subtotal;

        // output in the console
        const subtotalElement = document.querySelector(`${this.outputSelector} #subtotal`);
        if (subtotalElement) subtotalElement.innerText = `$${subtotal.toFixed(2)}`;
    }

    calculateTotal() {
        // tax %6
        this.tax = (this.itemTotal * 0.06);

        // $10 for the first item and $2 for each additional item after that.
        const totalItems = this.list.reduce((sum, item) => {
            return sum + (item.quantity || 1);
        }, 0);
        this.shipping = 10 + Math.max(0, totalItems - 1) * 2;

        // total
        this.orderTotal = this.itemTotal + this.tax + this.shipping;

        this.DisplayTotal();
    }

    DisplayTotal() {
        const container = document.querySelector(this.outputSelector);
        if (!container) return;

        const tax = container.querySelector("#tax");
        const shipping = container.querySelector("#shipping");
        const total = container.querySelector("#total");

        if (tax) tax.innerText = `$${this.tax.toFixed(2)}`;
        if (shipping) shipping.innerText = `$${this.shipping.toFixed(2)}`;
        if (total) total.innerText = `$${this.orderTotal.toFixed(2)}`;
    }


    packageItems(items) {
        return items.map(item => ({
            id: item.Id,
            name: item.Name,
            price: item.FinalPrice,
            quantity: item.quantity || 1
        }));
    }

    formDataToJSON(form) {
        const formData = new FormData(form);
        const data = {};
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        return data;
    }

    async checkout(form) {
        event.preventDefault()
        // data from the form
        const data = this.formDataToJSON(form);

        // the server expects:
        const order = {
            orderDate: new Date().toISOString(),
            fname: data.firstName,
            lname: data.lastName,
            street: data.streetAddress,
            city: data.city,
            state: data.state,
            zip: data.zipCode,
            cardNumber: data.cardNumber,
            expiration: data.expiration,
            code: data.secCode,
            items: this.packageItems(this.list), //items in the cart
            orderTotal: this.orderTotal.toFixed(2),
            shipping: this.shipping,
            tax: this.tax.toFixed(2)
        };

        // fetch POST
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(order)
        };

        // Send to server
        const url = "https://wdd330-backend.onrender.com/checkout";
        const response = await fetch(url, options);
        const result = await response.json();

        return result; 
    }
}
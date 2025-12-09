// Save location and go to menu
function selectLocation(loc) {
    localStorage.setItem("location", loc);
    window.location = "menu.html";
}

// Display location on menu page
const locTitle = document.getElementById("locationTitle");
if (locTitle) {
    locTitle.textContent = "Location: " + localStorage.getItem("location");
}

// Options handlers
function getMargOptions() {
    return document.getElementById("margNoBasil").checked ? " (No basil)" : "";
}

function getPepOptions() {
    if (document.getElementById("pepHotHoney").checked)
        return " (Hot Honey +£1)";
    return "";
}

// Basket
let basket = JSON.parse(localStorage.getItem("basket") || "[]");

function addItem(name, price, option = "") {
    if (option.includes("Hot Honey")) price += 1;

    basket.push({ name: name + option, price });
    localStorage.setItem("basket", JSON.stringify(basket));

    updateBasketDisplay();
}

function updateBasketDisplay() {
    const list = document.getElementById("basketList");
    const total = document.getElementById("totalPrice");

    if (!list) return;

    list.innerHTML = "";
    let sum = 0;

    basket.forEach(item => {
        let li = document.createElement("li");
        li.textContent = `${item.name} — £${item.price.toFixed(2)}`;
        list.appendChild(li);
        sum += item.price;
    });

    total.textContent = "Total: £" + sum.toFixed(2);
}

updateBasketDisplay();

// Go to checkout
function goToCheckout() {
    window.location = "checkout.html";
}

// Checkout Page
const summaryList = document.getElementById("summaryList");
const summaryTotal = document.getElementById("summaryTotal");

if (summaryList) {
    let total = 0;
    basket.forEach(item => {
        let li = document.createElement("li");
        li.textContent = `${item.name} — £${item.price.toFixed(2)}`;
        summaryList.appendChild(li);
        total += item.price;
    });
    summaryTotal.textContent = "Total: £" + total.toFixed(2);
}

// Generate time slots
const timeSlot = document.getElementById("timeSlot");
if (timeSlot) {
    for (let t = 16 * 60 + 10; t <= 20 * 60 + 50; t += 10) {
        let hour = Math.floor(t / 60);
        let min = t % 60;
        let label = `${hour}:${min.toString().padStart(2, "0")}`;

        let opt = document.createElement("option");
        opt.value = label;
        opt.textContent = label;
        timeSlot.appendChild(opt);
    }
function addItem(name, price, option = "") {
    if (option.includes("Hot Honey")) price += 1;

    // Check if item already exists
    let existing = basket.find(item => item.name === name + option);
    if (existing) {
        existing.quantity += 1; // increment quantity
    } else {
        basket.push({ name: name + option, price, quantity: 1 });
    }

    localStorage.setItem("basket", JSON.stringify(basket));
    updateBasketDisplay();
}

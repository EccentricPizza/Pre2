// --- LOCATION PAGE ---
function selectLocation(loc) {
    localStorage.setItem("location", loc);
    window.location.href = "menu.html";
}

// Display location on menu page
const locTitle = document.getElementById("locationTitle");
if (locTitle) {
    locTitle.textContent = "Location: " + localStorage.getItem("location");
}

// --- MENU OPTIONS ---
function getMargOptions() {
    return document.getElementById("margNoBasil").checked ? " (No basil)" : "";
}

function getPepOptions() {
    return document.getElementById("pepHotHoney").checked ? " (Hot Honey +£1)" : "";
}

// --- BASKET ---
let basket = JSON.parse(localStorage.getItem("basket") || "[]");

// Add item with options and quantity
function addItem(name, price, option = "") {
    if (option.includes("Hot Honey")) price += 1;

    // Check if same item + option exists
    let existing = basket.find(item => item.name === name + option);
    if (existing) {
        existing.quantity += 1;
    } else {
        basket.push({ name: name + option, price, quantity: 1 });
    }

    localStorage.setItem("basket", JSON.stringify(basket));
    updateBasketDisplay();
}

// Update basket display (menu page)
function updateBasketDisplay() {
    const list = document.getElementById("basketList");
    const total = document.getElementById("totalPrice");

    if (!list) return;

    list.innerHTML = "";
    let sum = 0;

    basket.forEach((item, index) => {
        let li = document.createElement("li");
        li.textContent = `${item.name} — £${item.price.toFixed(2)} x `;

        // Quantity input
        let qtyInput = document.createElement("input");
        qtyInput.type = "number";
        qtyInput.min = 1;
        qtyInput.value = item.quantity;
        qtyInput.onchange = function() {
            item.quantity = parseInt(qtyInput.value);
            localStorage.setItem("basket", JSON.stringify(basket));
            updateBasketDisplay();
        };

        // Remove button
        let removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";
        removeBtn.onclick = function() {
            basket.splice(index, 1);
            localStorage.setItem("basket", JSON.stringify(basket));
            updateBasketDisplay();
        };

        li.appendChild(qtyInput);
        li.appendChild(removeBtn);
        list.appendChild(li);

        sum += item.price * item.quantity;
    });

    total.textContent = "Total: £" + sum.toFixed(2);
}

// Go to checkout page
function goToCheckout() {
    window.location.href = "checkout.html";
}

updateBasketDisplay();

// --- CHECKOUT PAGE ---
const summaryList = document.getElementById("summaryList");
const summaryTotal = document.getElementById("summaryTotal");

if (summaryList) {
    basket = JSON.parse(localStorage.getItem("basket") || "[]");

    // Render basket summary
    function renderSummary() {
        summaryList.innerHTML = "";
        let total = 0;

        if (basket.length === 0) {
            summaryList.innerHTML = "<li>Your basket is empty!</li>";
            summaryTotal.textContent = "Total: £0.00";
            return;
        }

        basket.forEach((item, index) => {
            let li = document.createElement("li");
            li.textContent = `${item.name} — £${item.price.toFixed(2)} x `;

            let qtyInput = document.createElement("input");
            qtyInput.type = "number";
            qtyInput.min = 1;
            qtyInput.value = item.quantity;
            qtyInput.onchange = function() {
                item.quantity = parseInt(qtyInput.value);
                localStorage.setItem("basket", JSON.stringify(basket));
                renderSummary();
            };

            let removeBtn = document.createElement("button");
            removeBtn.textContent = "Remove";
            removeBtn.onclick = function() {
                basket.splice(index, 1);
                localStorage.setItem("basket", JSON.stringify(basket));
                renderSummary();
            };

            li.appendChild(qtyInput);
            li.appendChild(removeBtn);
            summaryList.appendChild(li);

            total += item.price * item.quantity;
        });

        summaryTotal.textContent = "Total: £" + total.toFixed(2);
    }

    renderSummary();

    // Populate time slots
    const timeSlot = document.getElementById("timeSlot");
    for (let t = 16 * 60 + 10; t <= 20 * 60 + 50; t += 10) {
        let hour = Math.floor(t / 60);
        let min = t % 60;
        let label = `${hour}:${min.toString().padStart(2, "0")}`;

        let opt = document.createElement("option");
        opt.value = label;
        opt.textContent = label;
        timeSlot.appendChild(opt);
    }

    // Handle order submission
    document.getElementById("orderForm").addEventListener("submit", function(e) {
        e.preventDefault();

        const name = document.getElementById("custName").value;
        const phone = document.getElementById("custPhone").value;
        const date = document.getElementById("pickupDate").value;
        const time = document.getElementById("timeSlot").value;

        if (!name || !phone || !date || !time) {
            alert("Please fill out all fields.");
            return;
        }

        alert(`Thank you ${name}! Your order has been placed.\nPickup: ${date} at ${time}\nTotal: £${basket.reduce((a,b)=>a+b.price*b.quantity,0).toFixed(2)}`);

        // Clear basket
        localStorage.removeItem("basket");

        // Redirect to location page
        window.location.href = "index.html";
    });
}

// ---------------------------
// Full JavaScript for Pizza Pre-Order System
// ---------------------------

window.onload = function() {
    // ---------------------------
    // LOCATION PAGE
    // ---------------------------
    function selectLocation(loc) {
        localStorage.setItem("location", loc);
        window.location.href = "menu.html";
    }

    // Expose function globally for button onclick
    window.selectLocation = selectLocation;

    // ---------------------------
    // MENU PAGE
    // ---------------------------
    const locTitle = document.getElementById("locationTitle");
    if (locTitle) {
        locTitle.textContent = "Location: " + localStorage.getItem("location");
    }

    // Functions to get options for pizzas
    function getMargOptions() {
        const checkbox = document.getElementById("margNoBasil");
        return checkbox && checkbox.checked ? " (No basil)" : "";
    }

    function getPepOptions() {
        const checkbox = document.getElementById("pepHotHoney");
        return checkbox && checkbox.checked ? " (Hot Honey +£1)" : "";
    }

    // Expose to global for button onclick
    window.getMargOptions = getMargOptions;
    window.getPepOptions = getPepOptions;

    // ---------------------------
    // BASKET LOGIC
    // ---------------------------
    let basket = JSON.parse(localStorage.getItem("basket") || "[]");

    function addItem(name, price, option = "") {
        // Adjust price for Hot Honey option
        if (option.includes("Hot Honey")) price += 1;

        // Check if same item+option exists
        let existing = basket.find(item => item.name === name + option);
        if (existing) {
            existing.quantity += 1;
        } else {
            basket.push({ name: name + option, price, quantity: 1 });
        }

        localStorage.setItem("basket", JSON.stringify(basket));
        updateBasketDisplay();
    }

    window.addItem = addItem; // expose globally for onclick

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

        if (total) total.textContent = "Total: £" + sum.toFixed(2);
    }

    updateBasketDisplay();

    // Go to checkout page
    function goToCheckout() {
        window.location.href = "checkout.html";
    }

    window.goToCheckout = goToCheckout;

    // ---------------------------
    // CHECKOUT PAGE
    // ---------------------------
    const summaryList = document.getElementById("summaryList");
    const summaryTotal = document.getElementById("summaryTotal");
    const pickupDateInput = document.getElementById("pickupDate");

    if (summaryList && summaryTotal) {
        basket = JSON.parse(localStorage.getItem("basket") || "[]");

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

                // Quantity input
                let qtyInput = document.createElement("input");
                qtyInput.type = "number";
                qtyInput.min = 1;
                qtyInput.value = item.quantity;
                qtyInput.onchange = function() {
                    item.quantity = parseInt(qtyInput.value);
                    localStorage.setItem("basket", JSON.stringify(basket));
                    renderSummary();
                };

                // Remove button
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

        // ---------------------------
        // TIME SLOTS
        // ---------------------------
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
        }

        // ---------------------------
        // PICKUP DATE VALIDATION
        // ---------------------------
        const location = localStorage.getItem("location");
        if (pickupDateInput && location) {
            pickupDateInput.min = new Date().toISOString().split("T")[0];

            pickupDateInput.addEventListener("input", function() {
                const selectedDate = new Date(this.value);
                const day = selectedDate.getDay(); // 0 = Sunday, 6 = Saturday

                let valid = false;

                if (location === "Limavady") {
                    // Open Wednesday (3) to Sunday (0)
                    if ([0, 3, 4, 5, 6].includes(day)) valid = true;
                } else if (location === "Eglinton") {
                    // Open Saturdays only (6)
                    if (day === 6) valid = true;
                }

                if (!valid) {
                    alert("Selected date is unavailable for this location. Please choose another day.");
                    this.value = "";
                }
            });
        }

        // ---------------------------
        // ORDER SUBMISSION
        // ---------------------------
        const orderForm = document.getElementById("orderForm");
        if (orderForm) {
            orderForm.addEventListener("submit", function(e) {
                e.preventDefault();

                const name = document.getElementById("custName").value;
                const phone = document.getElementById("custPhone").value;
                const date = document.getElementById("pickupDate").value;
                const time = document.getElementById("timeSlot").value;

                if (!name || !phone || !date || !time) {
                    alert("Please fill out all fields.");
                    return;
                }

                alert(`Thank you ${name}! Your order has been placed.\nPickup: ${date} at ${time}\nT

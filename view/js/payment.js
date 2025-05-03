const form = document.getElementById("paymentForm");
const plans = document.querySelectorAll(".plan");
const totalAmount = document.querySelector(".amount");
const cardNumberInput = document.getElementById("cardNumber");
const expiryInput = document.getElementById("expiry");
const cvvInput = document.getElementById("cvv");
const payBtn = document.getElementById("pay-btn");

plans.forEach((plan) => {
    plan.addEventListener("click", () => {
        plans.forEach((p) => p.classList.remove("selected"));
        plan.classList.add("selected");

        const price = parseInt(plan.dataset.price);
        let months = 1;
        if (plan.querySelector(".plan-name").textContent === "Semi-Annualy")
            months = 6;
        if (plan.querySelector(".plan-name").textContent === "Yearly")
            months = 12;

        const total = (price * months).toFixed(2);
        totalAmount.textContent = `₹${total}`;
        totalAmount.nextElementSibling.textContent = `(${months} month${months > 1 ? "s" : ""
            })`;
    });
});

const planNameInput = document.getElementById('plan_name');
const planPriceInput = document.getElementById('plan_price');

plans.forEach(plan => {
    plan.addEventListener('click', () => {
        // Remove 'selected' class from all
        plans.forEach(p => p.classList.remove('selected'));

        // Add 'selected' class to the clicked one
        plan.classList.add('selected');

        // Update hidden fields
        const name = plan.querySelector('.plan-name').innerText.trim();
        const price = plan.getAttribute('data-price').trim();

        planNameInput.value = name;
        planPriceInput.value = price;

        // Update the UI (optional)
        const amountDiv = document.querySelector('.total-amount .amount');
        const duration = name === 'Monthly' ? 1 : name === 'Yearly' ? 12 : 6;
        amountDiv.innerText = `₹${price * duration}.00`;
    });
});

// Set default on load (you marked Semi-Annualy as selected)
document.addEventListener('DOMContentLoaded', () => {
    const selected = document.querySelector('.plan.selected');
    if (selected) {
        const name = selected.querySelector('.plan-name').innerText.trim();
        const price = selected.getAttribute('data-price').trim();
        planNameInput.value = name;
        planPriceInput.value = price;
    }
});

document.querySelectorAll(".plan").forEach((planDiv) => {
    planDiv.addEventListener("click", function () {
        document.querySelectorAll(".plan").forEach((p) =>
            p.classList.remove("selected")
        );
        planDiv.classList.add("selected");
        document.getElementById("plan_name").value =
            planDiv.querySelector(".plan-name").innerText;
        document.getElementById("plan_price").value =
            planDiv.getAttribute("data-price");
    });
});

payBtn.addEventListener("click", async function (e) {
    e.preventDefault();

    const plan_name = document.getElementById("plan_name").value;
    if (!plan_name) {
        alert("Please select a plan.");
        return;
    }

    // Send to backend to create order
    const res = await fetch("/payment", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan_name }),
    });

    const data = await res.json();
    if (!data.order) {
        alert("Error creating order.");
        return;
    }

    const options = {
        key: "rzp_test_f7KvjxjG0mJxq1", // Your Razorpay Key
        amount: data.order.amount,
        currency: "INR",
        name: "ARNAV RANJAN",
        description: "Purchase Premium Membership",
        order_id: data.order.id,
        handler: function (response) {
            alert("Payment Successful! Payment ID: " + response.razorpay_payment_id);
            fetch("/verify_payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                  username: data.order.username,
                }),
              });
              
        },
        theme: {
            color: "#3399cc",
        },
    };

    const rzp1 = new Razorpay(options);
    rzp1.open();
});
const form = document.getElementById("paymentForm");
const plans = document.querySelectorAll(".plan");
const totalAmount = document.querySelector(".amount");
const cardNumberInput = document.getElementById("cardNumber");
const expiryInput = document.getElementById("expiry");
const cvvInput = document.getElementById("cvv");

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

document.getElementById("pay-btn").addEventListener("click", function () {
    var options = {
        key: "rzp_test_jVv00BARb5C4LI",
        amount: "50700",
        currency: "INR",
        name: "ARNAV RANJAN",
        description: "Purchase Premium Membership",
        handler: function (response) {
            alert(
                "Payment Successful! Payment ID: " + response.razorpay_payment_id
            );
        },
        theme: {
            color: "#3399cc",
        },
    };

    var rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();
});
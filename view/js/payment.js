// ../js/payment.js
document.addEventListener('DOMContentLoaded', () => {
  const planElems = document.querySelectorAll('.plan');
  const originalSpan = document.getElementById('original-amount');
  const discountedSpan = document.getElementById('discounted-amount');
  const durationDiv = document.getElementById('amount-duration');
  const coinsHidden = document.getElementById('coinshidden');
  const planNameInput = document.getElementById('plan_name');
  const planPriceInput = document.getElementById('plan_price');
  const payBtn = document.getElementById('pay-btn');

  // config (no DOM name clash)
  const planConfig = [
    { name: "Monthly", price: 199, months: 1 },
    { name: "Semi-Annualy", price: 169, months: 6 },
    { name: "Yearly", price: 149, months: 12 }
  ];

  function updateAmount(index) {
    const coins = Number(coinsHidden?.value || 0);
    const plan = planConfig[index];
    const original = plan.price * plan.months;
    const discounted = Math.max(0, original - coins);

    if (originalSpan) originalSpan.textContent = `₹${original.toFixed(2)}`;
    if (discountedSpan) discountedSpan.textContent = `₹${discounted.toFixed(2)}`;
    if (durationDiv) durationDiv.textContent = `(${plan.months} month${plan.months > 1 ? 's' : ''})`;

    if (planNameInput) planNameInput.value = plan.name;
    if (planPriceInput) planPriceInput.value = discounted.toFixed(2); // rupees as string
  }

  // pick default selected index (from markup) or fallback
  let selectedIndex = Array.from(planElems).findIndex(el => el.classList.contains('selected'));
  if (selectedIndex === -1) selectedIndex = 0;

  planElems.forEach((el, idx) => {
    el.addEventListener('click', () => {
      planElems.forEach(p => p.classList.remove('selected'));
      el.classList.add('selected');
      selectedIndex = idx;
      updateAmount(idx);
    });
  });

  // initial render
  updateAmount(selectedIndex);

  // Payment button handler (keeps your existing logic, but safe)
  payBtn?.addEventListener('click', async (e) => {
    e.preventDefault();
    const plan_name = planNameInput.value;
    const plan_price = planPriceInput.value; // discounted rupees

    if (!plan_name || !plan_price) {
      alert('Please select a plan.');
      return;
    }

    try {
      // console.log(plan_name, plan_price);
      const res = await fetch('/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan_name, plan_price })
      });
      const data = await res.json();
      if (!data.order) {
        alert('Error creating order.');
        return;
      }

      const options = {
        key: 'rzp_test_f7KvjxjG0mJxq1',
        amount: data.order.amount, // backend must send paise integer
        currency: 'INR',
        name: 'ARNAV RANJAN',
        description: 'Purchase Premium Membership',
        order_id: data.order.id,
        handler: function (response) {
          alert('Payment Successful! Payment ID: ' + response.razorpay_payment_id);
          fetch('/verify_payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              username: data.order.username,
            }),
          });
        },
        theme: { color: '#3399cc' },
      };

      const rzp1 = new Razorpay(options);
      rzp1.open();
    } catch (err) {
      console.error(err);
      alert('Payment error (see console).');
    }
  });
});

const express = require('express');


try {
// Create customer if not exists
let customerId = user.stripeCustomerId;
if (!customerId) {
const cust = await stripe.customers.create({ email: user.email });
customerId = cust.id;
user.stripeCustomerId = customerId;
await user.save();
}


const session = await stripe.checkout.sessions.create({
payment_method_types: ['card'],
mode: 'subscription',
line_items: [
{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }
],
customer: customerId,
success_url: successUrl || `${process.env.BASE_URL}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
cancel_url: cancelUrl || `${process.env.BASE_URL}/billing/cancel`,
metadata: { userId: user._id.toString() }
});


res.json({ url: session.url });
} catch (err) {
console.error(err);
res.status(500).json({ error: 'Stripe error' });
}
});


// Stripe webhook endpoint (called by Stripe)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
const sig = req.headers['stripe-signature'];
let event;
try {
event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
} catch (err) {
console.error('Webhook signature verification failed.', err.message);
return res.status(400).send(`Webhook Error: ${err.message}`);
}


// Handle the checkout.session.completed event
if (event.type === 'checkout.session.completed') {
const session = event.data.object;
const userId = session.metadata?.userId;
if (userId) {
try {
const user = await User.findById(userId);
if (user) {
user.plan = 'pro';
await user.save();
console.log(`Upgraded user ${user.email} to PRO`);
}
} catch (err) {
console.error('Failed to upgrade user:', err);
}
}
}


// You can handle other events like invoice.payment_failed, customer.subscription.deleted
res.json({ received: true });
});


module.exports = router;
import { Router } from 'express';
import Stripe from 'stripe';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../db.js';
import { authMiddleware } from '../auth.js';

const router = Router();
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

// Plans
const PLANS = {
  monthly: {
    price: 9.99,
    stripe_price_id: process.env.STRIPE_MONTHLY_PRICE_ID || 'price_monthly',
    interval: 'month'
  },
  yearly: {
    price: 79.99,
    stripe_price_id: process.env.STRIPE_YEARLY_PRICE_ID || 'price_yearly',
    interval: 'year'
  }
};

// Get subscription status
router.get('/status', authMiddleware, (req, res) => {
  const db = getDb();
  const user = db.prepare('SELECT subscription_status, subscription_tier, subscription_end FROM users WHERE id = ?').get(req.userId);
  res.json({
    subscription_status: user.subscription_status,
    subscription_tier: user.subscription_tier,
    subscription_end: user.subscription_end
  });
});

// Create checkout session (mock for now - real Stripe when keys are set)
router.post('/create-checkout', authMiddleware, async (req, res) => {
  const { plan } = req.body; // 'monthly' or 'yearly'
  if (!plan || !PLANS[plan]) {
    return res.status(400).json({ error: 'Invalid plan. Use monthly or yearly.' });
  }

  const planConfig = PLANS[plan];

  if (stripe) {
    try {
      const db = getDb();
      let user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.userId);

      // Create or get Stripe customer
      let customerId = user.stripe_customer_id;
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          metadata: { userId: req.userId }
        });
        customerId = customer.id;
        db.prepare('UPDATE users SET stripe_customer_id = ? WHERE id = ?').run(customerId, req.userId);
      }

      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [{
          price: planConfig.stripe_price_id,
          quantity: 1
        }],
        mode: 'subscription',
        success_url: `${process.env.APP_URL || 'http://localhost:3000'}/account?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.APP_URL || 'http://localhost:3000'}/pricing`,
        metadata: { userId: req.userId, plan }
      });

      return res.json({ url: session.url, sessionId: session.id });
    } catch (err) {
      console.error('Stripe error:', err);
      return res.status(500).json({ error: 'Payment processing error' });
    }
  }

  // Mock mode - simulate successful subscription
  const db = getDb();
  const endDate = new Date();
  if (plan === 'monthly') {
    endDate.setMonth(endDate.getMonth() + 1);
  } else {
    endDate.setFullYear(endDate.getFullYear() + 1);
  }

  db.prepare(
    'UPDATE users SET subscription_status = ?, subscription_tier = ?, subscription_end = ? WHERE id = ?'
  ).run('active', plan, endDate.toISOString(), req.userId);

  res.json({
    success: true,
    subscription_status: 'active',
    subscription_tier: plan,
    subscription_end: endDate.toISOString()
  });
});

// Cancel subscription
router.post('/cancel', authMiddleware, (req, res) => {
  const db = getDb();
  db.prepare(
    'UPDATE users SET subscription_status = ?, subscription_tier = ?, subscription_end = ? WHERE id = ?'
  ).run('cancelled', 'free', null, req.userId);

  res.json({ success: true, subscription_status: 'cancelled' });
});

// Webhook for Stripe events
router.post('/webhook', async (req, res) => {
  if (!stripe) return res.status(200).json({ received: true });

  let event;
  try {
    const sig = req.headers['stripe-signature'];
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  const db = getDb();

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const userId = session.metadata.userId;
      const plan = session.metadata.plan;
      const endDate = new Date();
      if (plan === 'yearly') {
        endDate.setFullYear(endDate.getFullYear() + 1);
      } else {
        endDate.setMonth(endDate.getMonth() + 1);
      }
      db.prepare(
        'UPDATE users SET subscription_status = ?, subscription_tier = ?, subscription_end = ? WHERE id = ?'
      ).run('active', plan, endDate.toISOString(), userId);
      break;
    }
    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      const customerId = subscription.customer;
      const user = db.prepare('SELECT id FROM users WHERE stripe_customer_id = ?').get(customerId);
      if (user) {
        db.prepare(
          'UPDATE users SET subscription_status = ?, subscription_tier = ?, subscription_end = ? WHERE id = ?'
        ).run('cancelled', 'free', null, user.id);
      }
      break;
    }
  }

  res.json({ received: true });
});

export { PLANS };
export default router;
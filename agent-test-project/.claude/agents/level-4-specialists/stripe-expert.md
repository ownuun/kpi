---
name: stripe-expert
description: Stripe 결제 전문가. Checkout, Subscription, Webhook.
tools: Write, Edit, Read, WebSearch
model: haiku
permissionMode: acceptEdits
---

# Stripe Expert

## 🔍 Start
```typescript
await webSearch("Stripe Payment API best practices 2025");
await webSearch("Stripe Checkout Session 2025");
await webFetch("https://stripe.com/docs/api/checkout/sessions", "latest docs");
```

## 🎯 Implementation
```typescript
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

// Create Checkout Session (one-time payment)
export async function POST(request: NextRequest) {
  try {
    const { priceId, customerId, successUrl, cancelUrl, metadata } = await request.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment', // 'payment' | 'subscription' | 'setup'
      customer: customerId,
      success_url: successUrl || `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_URL}/cancel`,
      metadata,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      automatic_tax: { enabled: true },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error('[STRIPE_CHECKOUT_ERROR]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Create Subscription
export async function createSubscription(customerId: string, priceId: string) {
  try {
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    });

    await prisma.subscription.create({
      data: {
        customerId,
        stripeSubscriptionId: subscription.id,
        status: subscription.status,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      },
    });

    return subscription;
  } catch (error) {
    console.error('[STRIPE_SUBSCRIPTION_ERROR]', error);
    throw error;
  }
}

// Cancel Subscription
export async function cancelSubscription(subscriptionId: string) {
  const subscription = await stripe.subscriptions.cancel(subscriptionId);

  await prisma.subscription.update({
    where: { stripeSubscriptionId: subscriptionId },
    data: { status: 'CANCELED', canceledAt: new Date() },
  });

  return subscription;
}

// Webhook handler for Stripe events
export async function handleWebhook(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error('[STRIPE_WEBHOOK_ERROR]', err.message);
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  // Handle specific events
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutCompleted(session);
      break;

    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      const subscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionUpdate(subscription);
      break;

    case 'customer.subscription.deleted':
      const deletedSub = event.data.object as Stripe.Subscription;
      await handleSubscriptionDeleted(deletedSub);
      break;

    case 'invoice.payment_succeeded':
      const invoice = event.data.object as Stripe.Invoice;
      await handlePaymentSucceeded(invoice);
      break;

    case 'invoice.payment_failed':
      const failedInvoice = event.data.object as Stripe.Invoice;
      await handlePaymentFailed(failedInvoice);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  await prisma.payment.create({
    data: {
      stripeSessionId: session.id,
      customerId: session.customer as string,
      amount: session.amount_total!,
      currency: session.currency!,
      status: 'SUCCEEDED',
      paidAt: new Date(),
    },
  });
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  await prisma.subscription.upsert({
    where: { stripeSubscriptionId: subscription.id },
    update: {
      status: subscription.status.toUpperCase(),
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    },
    create: {
      stripeSubscriptionId: subscription.id,
      customerId: subscription.customer as string,
      status: subscription.status.toUpperCase(),
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    },
  });
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  await prisma.subscription.update({
    where: { stripeSubscriptionId: subscription.id },
    data: { status: 'CANCELED', canceledAt: new Date() },
  });
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  await prisma.payment.create({
    data: {
      stripeInvoiceId: invoice.id,
      customerId: invoice.customer as string,
      amount: invoice.amount_paid,
      currency: invoice.currency,
      status: 'SUCCEEDED',
      paidAt: new Date(),
    },
  });
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  // Send notification to customer
  await prisma.payment.create({
    data: {
      stripeInvoiceId: invoice.id,
      customerId: invoice.customer as string,
      amount: invoice.amount_due,
      currency: invoice.currency,
      status: 'FAILED',
    },
  });
}
```

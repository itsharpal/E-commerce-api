import Stripe from 'stripe';
import { Order } from '../models/order.model.js';
import { Cart } from '../models/cart.model.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const handleStripeWebHook = async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET_KEY;

    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (error) {
        console.error("⚠️ Webhook signature verification failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const { orderId, userId } = session.metadata;

        try {
            // 1️⃣ Mark the order as paid
            const updatedOrder = await Order.findByIdAndUpdate(
                orderId,
                { status: "paid", paymentId: session.payment_intent },
                { new: true }
            );

            // 2️⃣ Clear the user's cart
            await Cart.findOneAndUpdate(
                { user: userId },
                { $set: { items: [], totalPrice: 0 } }
            );

            console.log("✅ Payment successful, order updated:", updatedOrder._id);
        } catch (error) {
            console.error("❌ Error updating order after payment:", error);
        }
    }

    res.status(200).json({ received: true });
};
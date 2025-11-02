import Stripe from 'stripe';
import { Cart } from '../models/cart.model.js';
import dotenv from 'dotenv';
dotenv.config({});

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
    try {
        const userId = req.id;

        const cart = await Cart.findOne({ user: userId }).populate("items.productId", "name price");;
        if (!cart || cart.items.length === 0) {
            return res.status(400).json("Cart is empty");
        }

        const lineItems = cart.items.map((item) => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: item.productId.name,
                },
                unit_amount: item.productId.price * 100
            },
            quantity: item.quantity
        }))

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            customer_creation: "always",
            billing_address_collection: "required",
            success_url: `${process.env.FRONTEND_URL}/success`,
            cancel_url: `${process.env.FRONTEND_URL}/cancel`,
            metadata: { userId },
        });

        res.status(200).json({ success: true, url: session.url });
    } catch (error) {
        console.error("Stripe session error:", error);
        res.status(500).json({ message: "Error creating checkout session" });
    }
};
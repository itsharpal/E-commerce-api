import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    products: [
        {
            product: {
                type: mongoose.Schema.ObjectId,
                ref: 'Product'
            },
            quantity: {
                type: Number
            }
        }
    ],
    status: {
        type: String,
        enum: ["pending", "paid", "shipped"],
        default: "pending"
    },
    paymentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment"
    },
}, {timestamps: true})

export const Order = mongoose.model('Order', orderSchema);
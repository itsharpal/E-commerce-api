import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.ObjectId,
        ref: 'Order'
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }, 
    amount: {
        type: Number
    },
    paymentStatus: {
        type: String
    },
    paymentDate: {
        type: Date,
        default: Date.now
    }
})

export const Payment = mongoose.model("Payment", paymentSchema);
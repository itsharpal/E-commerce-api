import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.ObjectId,
        ref: "Category",
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number
    }
}, { timestamps: true })

export const Product = mongoose.model("Product", productSchema);
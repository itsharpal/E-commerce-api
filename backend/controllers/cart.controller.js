import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";

export const addProductToCart = async (req, res) => {
    try {
        const userId = req.id;
        const { productId, quantity } = req.body;

        // 1️⃣ Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const productPrice = product.price * quantity;

        // 2️⃣ Find user's cart
        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            // If no cart, create a new one
            cart = await Cart.create({
                user: userId,
                items: [{ productId, quantity }],
                totalPrice: productPrice,
            });
        } else {
            // 3️⃣ Check if product already in cart
            const existingItem = cart.items.find(
                (item) => item.productId.toString() === productId
            );

            if (existingItem) {
                // Update quantity if product already in cart
                existingItem.quantity += quantity;
            } else {
                // Otherwise, add new product
                cart.items.push({ productId, quantity });
            }

            // 4️⃣ Recalculate total price
            cart.totalPrice = cart.items.reduce(
                (acc, item) => acc + item.quantity * product.price,
                0
            );

            await cart.save();
        }

        // 5️⃣ Populate product details for response
        const updatedCart = await Cart.findOne({ user: userId }).populate(
            "items.productId",
            "name description price"
        );

        return res.status(201).json({
            success: true,
            message: "Product added/updated successfully",
            cart: updatedCart,
        });
    } catch (error) {
        console.error("Error adding product to cart:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

export const getCart = async (req, res) => {
    try {
        const userId = req.id;
        const cart = await Cart.findOne({ user: userId })
            .populate("items.productId", "name price description category") // specify fields to show
            .lean(); // converts mongoose doc to plain JS object for faster response

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        res.status(200).json({
            success: true,
            cart
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching cart",
            error: error.message
        });
    }
};

export const removeProductFromCart = async (req, res) => {
    try {
        const userId = req.id;
        const productId = req.params

        const cart = await Cart.find({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        cart.items = cart.items.filter(i => i.productId.toString() !== productId);

        cart.totalPrice = cart.items.reduce((acc, i) => acc + i.quantity * i.productId.price, 0);
        await cart.save();

        return res.status(200).json({
            success: true, 
            message: "Product removed", 
            cart
        })

    } catch (error) {
        console.log(error);
    }
}

export const updateCartItemQuantity = async (req, res) => {
  try {
    const userId = req.id;
    const { productId, quantity } = req.body;

    let cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(i => i.productId.toString() === productId);
    if (!item) return res.status(404).json({ message: "Product not found in cart" });

    if (quantity <= 0) {
      // Remove item if quantity set to 0
      cart.items = cart.items.filter(i => i.productId.toString() !== productId);
    } else {
      item.quantity = quantity;
    }

    // Recalculate total price
    cart.totalPrice = cart.items.reduce((acc, i) => acc + i.quantity * i.productId.price, 0);
    await cart.save();

    const updatedCart = await Cart.findOne({ user: userId }).populate("items.productId", "name price");
    res.status(200).json({ success: true, cart: updatedCart });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const clearCart = async (req, res) => {
  try {
    const userId = req.id;

    const cart = await Cart.findOneAndUpdate(
      { user: userId },
      { $set: { items: [], totalPrice: 0 } },
      { new: true }
    );

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    res.status(200).json({ success: true, message: "Cart cleared successfully", cart });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
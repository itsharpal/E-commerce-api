import { Product } from '../models/product.model.js';
import { User } from '../models/user.model.js';

export const newProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body;
        if (!name || !description || !price || !stock) {
            return res.status(400).json("All fields are required !");
        }

        const product = await Product.create({
            name,
            description,
            price,
            category,
            stock
        });

        return res.status(201).json({
            message: "Product added successfully",
            product
        });
    } catch (error) {
        console.log(error);
    }
}

export const updateProduct = async (req, res) => {
    try {
        const productId = req.params.productId;
        if (!productId) {
            return res.json("Id not provided")
        }
        const { name, description, price, stock, category } = req.body;
        const updatedProduct = { name, description, price, stock, category };

        const product = await Product.findByIdAndUpdate(productId, updatedProduct, { new: true });
        if (!product) {
            return res.status(400).json({
                message: "product doesn't exists",
                success: false
            })
        }

        return res.status(200).json({
            message: "Updated successfuly",
            product
        });
    } catch (error) {
        console.log(error);
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.productId;

        const product = await Product.findByIdAndDelete(productId);
        if (!product) {
            return res.status(400).json({
                message: "product doesn't exists",
                success: false
            })
        }

        return res.status(200).json({
            message: "Deleted following product successfuly",
            product
        });
    } catch (error) {
        console.log(error);
    }
}

export const getProductById = async (req, res) => {
    try {
        const productId = req.params.productId;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(400).json({
                message: "product doesn't exists",
                success: false
            })
        }

        return res.status(200).json(product);

    } catch (error) {
        
    }
}

export const getProduct = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const category = req.query.category || "";
    const minPrice = Number(req.query.minPrice) || 0;
    const maxPrice = Number(req.query.maxPrice) || Number.MAX_VALUE;

    // Build query dynamically
    const query = {
      price: { $gte: minPrice, $lte: maxPrice },
    };

    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ];
    }

    if (category) {
      query.category = category; // category should be an ObjectId string
    }

    const products = await Product.find(query).populate("category");

    if (products.length === 0) {
      return res.status(404).json({
        message: "No products found",
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};
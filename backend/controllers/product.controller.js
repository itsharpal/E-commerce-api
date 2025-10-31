import { Product } from '../models/product.model.js';

export const newProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body;
        if(!name || !description || !price || !category || !stock) {
            return res.status(400).json("All fields are required !");
        }

        
    } catch (error) {
        console.log(error);
    }
}
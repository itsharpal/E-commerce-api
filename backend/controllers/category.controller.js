import { Category } from "../models/category.model.js";

export const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name || !description) {
            return res.status(400).json("All fields are required");
        }

        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json("Category already exists");
        }

        const category = await Category.create({
            name,
            description
        });

        return res.status(201).json({
            message: "Category created successfully",
            success: true,
            category
        });

    } catch (error) {
        console.log(error);
    }
}

export const updateCategory = async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        if (!categoryId) {
            return res.json("Id not provided")
        }
        const { name, description } = req.body;
        const updatedCategory = { name, description };

        const category = await Category.findByIdAndUpdate(categoryId, updatedCategory, { new: true });
        if (!category) {
            return res.status(400).json({
                message: "Category doesn't exists",
                success: false
            })
        }

        return res.status(200).json({
            message: "Updated successfuly",
            category
        });
    } catch (error) {
        console.log(error);
    }
}

export const deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.categoryId;

        const category = await Category.findByIdAndDelete(categoryId);
        if (!category) {
            return res.status(400).json({
                message: "category doesn't exists",
                success: false
            })
        }

        return res.status(200).json({
            message: "Deleted following category successfuly",
            category
        });
    } catch (error) {
        console.log(error);
    }
}
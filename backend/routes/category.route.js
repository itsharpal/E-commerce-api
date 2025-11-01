import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import isAdmin from '../middlewares/isAdmin.js';
import { createCategory, deleteCategory, updateCategory } from '../controllers/category.controller.js';

const router = express.Router();

router.route('/create').post(isAuthenticated, isAdmin, createCategory);
router.route('/update/:categoryId').post(isAuthenticated, isAdmin, updateCategory);
router.route('/delete/:categoryId').get(isAuthenticated, isAdmin, deleteCategory);

export default router;
import express from 'express';
import { deleteProduct, getProduct, getProductById, newProduct, updateProduct } from '../controllers/product.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import isAdmin from '../middlewares/isAdmin.js';

const router = express.Router();

router.route('/new').post(isAuthenticated, isAdmin, newProduct);
router.route('/update/:productId').post(isAuthenticated, isAdmin, updateProduct);
router.route('/delete/:productId').get(isAuthenticated, isAdmin, deleteProduct);
router.route('/get/:productId').get(isAuthenticated, getProductById);
router.route('/get').get(isAuthenticated, getProduct);

export default router; 
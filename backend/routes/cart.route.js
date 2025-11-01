import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { addProductToCart, clearCart, getCart, removeProductFromCart, updateCartItemQuantity } from '../controllers/cart.controller.js';

const router = express.Router();

router.route('/add').post(isAuthenticated, addProductToCart);
router.route('/get').get(isAuthenticated, getCart);
router.route('/delete/:productId').get(isAuthenticated, removeProductFromCart);
router.route('/changeQuantity').post(isAuthenticated, updateCartItemQuantity);
router.route('/clearAll').get(isAuthenticated, clearCart);

export default router;
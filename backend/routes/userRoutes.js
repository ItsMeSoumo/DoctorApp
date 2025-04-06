import express from 'express';
import { login, register, getUserData, applyDoctors, getNotification, getAllDoc } from '../controllers/user.controller.js';
import { isAuthenticated } from '../middlewares/auth.midddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/getUserData', isAuthenticated, getUserData)
router.post('/apply-doctors', isAuthenticated, applyDoctors);
router.post('/getNotification', isAuthenticated, getNotification);

router.get('/getAllDoc', isAuthenticated, getAllDoc);
export default router;
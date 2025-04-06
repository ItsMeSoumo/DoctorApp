import express from 'express';
import { getAllUsers, getAllDoctors, changeStatus, deleteUser } from '../controllers/admin.controller.js';
import { isAuthenticated } from '../middlewares/auth.midddleware.js';

const router = express.Router();


router.get('/getAllUsers', isAuthenticated, getAllUsers);
router.get('/getAllDoctors', isAuthenticated, getAllDoctors);
router.post('/changeStatus', isAuthenticated, changeStatus);
router.delete('/deleteUser/:userId', isAuthenticated, deleteUser);

export default router;
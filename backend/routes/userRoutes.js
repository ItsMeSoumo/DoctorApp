import express from 'express';
import {
  login,
  register,
  getUserData,
  applyDoctors,
  getNotification,
  getAllDoc,
  bookAppointment,
  bookAvailablity,
  userAppointments,
  updateUserInfo,
  uploadReportController, // controller import
} from '../controllers/user.controller.js';

import { isAuthenticated } from '../middlewares/auth.midddleware.js';
import { upload } from '../middlewares/upload.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/getUserData', isAuthenticated, getUserData);
router.post('/apply-doctors', isAuthenticated, applyDoctors);
router.post('/getNotification', isAuthenticated, getNotification);
router.get('/getAllDoc', isAuthenticated, getAllDoc);
router.post('/bookAppointment', isAuthenticated, bookAppointment);
router.post('/bookAvailablity', isAuthenticated, bookAvailablity);
router.get('/userAppointments', isAuthenticated, userAppointments);
router.post('/updateUserInfo', isAuthenticated, updateUserInfo);

// ✅ FINAL: Report Upload Route
router.post(
  '/upload-report',
  isAuthenticated,
  upload.single('file'), // multer middleware
  uploadReportController // controller
);

export default router;

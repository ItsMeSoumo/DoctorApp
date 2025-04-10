import express from 'express';
import { getDoctorInfo, updateDoctorInfo, getDoctorbyId, doctorAppointments, updateStatusController } from '../controllers/doctor.controller.js';
import { isAuthenticated } from '../middlewares/auth.midddleware.js';

const router = express.Router();


router.post('/getDoctorInfo', isAuthenticated, getDoctorInfo);

router.post('/updateDoctorInfo', isAuthenticated, updateDoctorInfo);
router.post('/getDoctorbyId', isAuthenticated, getDoctorbyId);
router.get('/doctorAppointments', isAuthenticated, doctorAppointments);
router.post('/updateStatus', isAuthenticated, updateStatusController);

export default router;
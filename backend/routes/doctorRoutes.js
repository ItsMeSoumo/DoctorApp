import express from 'express';
import { getDoctorInfo, updateDoctorInfo } from '../controllers/doctor.controller.js';
import { isAuthenticated } from '../middlewares/auth.midddleware.js';

const router = express.Router();


router.post('/getDoctorInfo', isAuthenticated, getDoctorInfo);

router.post('/updateDoctorInfo', isAuthenticated, updateDoctorInfo);


export default router;
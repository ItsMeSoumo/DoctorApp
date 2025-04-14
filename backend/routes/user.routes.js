import express from 'express'
import { register, login, getUserData, updateUserInfo, applyDoctors, getNotification, deleteNotification, getAllDoc, bookAvailability, bookAppointment, userAppointments, uploadReportController, removeReportController } from '../controllers/user.controller.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'

const router = express.Router()

router.post('/getNotification', authMiddleware, getNotification); 
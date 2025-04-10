import userModel from '../models/userModels.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModel.js'
import moment from 'moment'

export const register = async(req, res) => {
    try{
        const existingUser = await userModel.findOne({email:req.body.email })
        if(existingUser){
            return res.status(200).send({message: 'User already exist', success: false})
        }
        const password = req.body.password
        const salt = await bcrypt.genSalt (10)
        const hashedPassword = await bcrypt.hash(password, salt)
        req.body.password = hashedPassword
        const newUser = new userModel(req.body)
        await newUser.save()
        res.status(201).send({message: 'Registration succesfull', success: true})
     }
    catch(error){
        console.log(error)
        res.status(500).send({success: false, message: `Register Controller ${error.message}`})
    }
}

export const login = async(req, res) => {
    try{
        const user = await userModel.findOne({email: req.body.email})
        if(!user){
            return res.status(200).send({message: 'User not Found', success: false})
        }
        const isMatch = await bcrypt.compare(req.body.password, user.password)
        if(!isMatch){
            return res.status(200).send({message: `Invalid Email and Password`, success: false})
        }
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '2d' })
        res.status(200).send({
            message: `Login Successful`, 
            success: true, 
            token,
            data: {
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                isDoctor: user.isDoctor,
                _id: user._id
            }
        })
    }
    catch(error){
        console.log(error)
        res.status(500).send({message:`Error in Login ${error.message}`})
    }
}


export const getUserData = async(req, res) => {
    try{
        const user = await userModel.findOne({_id: req.userId})
        if(!user){
            return res.status(404).send({
                message: "user not found", 
                success: false
            })
        }else{
            res.status(200).send({
                success: true,
                data: {
                    name: user.name,
                    email: user.email,
                    isAdmin: user.isAdmin,  
                    isDoctor: user.isDoctor,
                    _id: user._id,
                }
            })
        }
    } catch(error){
        res.status(500).send({
            message:'auth error',
            success: false,
            error
        })
    }
}

export const updateUserInfo = async (req, res) => {
    try {
        const userId = req.userId; // Get userId from auth middleware instead of body
        const updateData = req.body;

        // Remove fields that shouldn't be updated
        delete updateData._id;
        // delete updateData.password;
        // delete updateData.isAdmin;
        // delete updateData.isDoctor;

        const user = await userModel.findOneAndUpdate(
            { _id: userId },
            { $set: updateData },
            { 
                new: true,
                runValidators: true
            }
        );

        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).send({
            success: true,
            message: "User info updated successfully",
            data: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                gender: user.gender,
                _id: user._id
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error updating user info',
            error: error.message
        });
    }
}

export const applyDoctors = async (req, res) => {
    try {
      const newDoctor = new doctorModel({
        ...req.body,
        status: "pending",
        userId: req.userId  // This comes from auth middleware and matches the user's _id
      });
      
      await newDoctor.save();

      const adminUser = await userModel.findOne({ isAdmin: true });
      const notification = adminUser.notification || [];
      notification.push({
        type: "apply-doctor-request",
        message: `${newDoctor.firstName} ${newDoctor.lastName} Has Applied For A Doctor Account`,
        data: {
          doctorId: newDoctor._id,
          name: newDoctor.firstName + " " + newDoctor.lastName,
          onClickPath: "/admin/doctors",
        },
      });
      await userModel.findByIdAndUpdate(adminUser._id, { notification });

      res.status(201).send({
        success: true,
        message: "Doctor Account Applied Successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        error,
        message: "Error While Applying For Doctor",
      });
    }
};

export const getNotification = async(req, res) => {
    try{
        const user = await userModel.findOne({_id:req.body.userId})
        const seenNotification = user.seenNotification
        const notification = user.notification
        seenNotification.push(...notification)
        user.notification = []
        user.seenNotification = notification
        const updatedUser = await user.save()
        res.status(200).send({
            success: true,
            message: 'Notification fetched successfully',
            data: updatedUser,
        })
    } catch(error){
        console.log(error)
        res.status(500).send({
            message: 'Error in Notification',
            success: false,
            error
        })
    }
}

export const getAllDoc = async(req, res) => {
    try{
        const doctors = await doctorModel.find({status: 'approved'})
  
            res.status(200).send({
                success: true,
                message: "All doctors Fetcheddddd",
                data: doctors
            })
    } catch(error){
        res.status(500).send({
            message:'get doc error',
            success: false,
            error
        })
    }
}

export const bookAppointment = async(req, res) => {
    try {
        req.body.date = moment(req.body.date, "DD-MM-YYYY").toISOString();
        req.body.time = moment(req.body.time, "HH:mm").toISOString();
        req.body.status = "pending";
        const newAppointment = new appointmentModel(req.body);
        await newAppointment.save();
        const user = await userModel.findOne({ _id: req.body.doctorInfo.userId });
        if (user) {
          user.notification = user.notification || [];
          user.notification.push({
            type: "New-appointment-request",
            message: `A new Appointment Request from ${req.body.userInfo.name}`,
            onClickPath: "/user/appointments",
          });
          await user.save();
        }
        res.status(200).send({
          success: true,
          message: "Appointment Book succesfully",
        });
    } catch(error){
        console.log(error)
        res.status(500).send({
            message:'Error booking appointment',
            success: false,
            error: error.message
        })
    }
}

export const bookAvailablity = async(req, res) => {
    try{
        const date = moment(req.body.date, "DD-MM-YYYY").toISOString();
        const fromTime = moment(req.body.time, "HH:mm").subtract(1, 'hours').toISOString();
        const toTime = moment(req.body.time, "HH:mm").add(1, 'hours').toISOString();
        const doctorId = req.body.doctorId;
        const appointments = await appointmentModel.find({
            doctorId, 
            date,
            time: {
                $gte: fromTime,
                $lte: toTime
            }
        });
        if(appointments.length > 0){
            return res.status(200).send({
                success: false,
                message: "Appointments not available at this time"
            });
        } else {
            return res.status(200).send({
                success: true,
                message: "Appointments available"
            });
        }
    } catch(error){
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error in Booking"
        });
    }
}   

export const userAppointments = async (req, res) => {
    try {
        const appointments = await appointmentModel.find({ userId: req.userId })
            .populate('doctorId', 'firstName lastName email specialization experience fees timings')
            .populate('userId', 'name email phone')
            .sort({ createdAt: -1 });
        
        res.status(200).send({
            success: true,
            message: "Appointments fetched successfully",
            data: appointments
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in fetching appointments",
            error
        });
    }
};

// controllers/user.controller.js

export const uploadReportController = async (req, res) => {
  try {
    const userId = req.userId; // JWT middleware se mil raha hai
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const base64File = file.buffer.toString('base64');

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $push: { reports: base64File } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Report uploaded successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: 'Upload failed', error });
  }
};

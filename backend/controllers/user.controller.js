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
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'User not found'
            });
        }

        // Get current notifications
        const currentNotifications = [...user.notification];
        const currentSeenNotifications = [...user.seenNotification];

        // Move current notifications to seen notifications
        user.seenNotification = [...currentSeenNotifications, ...currentNotifications];
        user.notification = [];
        
        // Save the updated user
        await user.save();
        
        // Send the notification data
        res.status(200).send({
            success: true,
            message: 'Notification fetched successfully',
            data: {
                notifications: currentNotifications,
                seenNotifications: currentSeenNotifications
            }
        });
    } catch(error){
        console.log('Notification error:', error);
        res.status(500).send({
            message: 'Error in Notification',
            success: false,
            error: error.message
        });
    }
}

export const deleteNotification = async(req, res) => {
    try{
        const user = await userModel.findOne({_id:req.body.userId})
        user.notification = []
        user.seenNotification = []
        const updatedUser = await user.save()
        updatedUser.password = undefined
        res.status(200).send({
            success: true,
            message: 'Notification deleted successfully',
            data: updatedUser,
        });
    } catch(error){
        console.log('Notification error:', error);
        res.status(500).send({
            message: 'Error in deleteNotification',
            success: false,
            error: error.message
        });
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

export const bookAvailability = async (req, res) => {
    try {
        if (!req.body.date || !req.body.time || !req.body.doctorId) {
            return res.status(400).send({
                success: false,
                message: "Missing required fields"
            });
        }

        // Convert the input date and time to the correct format
        const formattedDate = moment(req.body.date, "DD-MM-YYYY").format("YYYY-MM-DD");
        const formattedTime = req.body.time;

        console.log("Checking availability for:", {
            doctorId: req.body.doctorId,
            date: formattedDate,
            time: formattedTime
        });

        // Find existing appointments for this doctor on this date and time
        const existingAppointment = await appointmentModel.findOne({
            doctorId: req.body.doctorId,
            date: formattedDate,
            time: formattedTime
        });

        console.log("Existing appointment:", existingAppointment);

        if (existingAppointment) {
            return res.status(200).send({
                success: false,
                message: "This time slot is already booked"
            });
        }

        return res.status(200).send({
            success: true,
            message: "Time slot is available"
        });
    } catch (error) {
        console.log("Error in bookAvailability:", error);
        res.status(500).send({
            success: false,
            error,
            message: "Error checking appointment availability"
        });
    }
};

export const bookAppointment = async (req, res) => {
    try {
        if (!req.body.date || !req.body.time || !req.body.doctorId || !req.body.doctorInfo || !req.body.userInfo) {
            return res.status(400).send({
                success: false,
                message: "Missing required appointment information"
            });
        }

        // Parse and validate the date
        const appointmentDate = moment(req.body.date, "DD-MM-YYYY");
        if (!appointmentDate.isValid()) {
            return res.status(400).send({
                success: false,
                message: "Invalid date format"
            });
        }

        // Parse and validate the time
        const appointmentTime = moment(req.body.time, "HH:mm");
        if (!appointmentTime.isValid()) {
            return res.status(400).send({
                success: false,
                message: "Invalid time format"
            });
        }

        // Format date and time for storage
        const formattedDate = appointmentDate.format("YYYY-MM-DD");
        const formattedTime = appointmentTime.format("HH:mm");

        console.log('Booking appointment with date:', formattedDate, 'time:', formattedTime);

        // Check if date is in the past
        if (moment(formattedDate).isBefore(moment().startOf('day'))) {
            return res.status(400).send({
                success: false,
                message: "Cannot book appointments for past dates"
            });
        }

        // Check if slot is still available
        const existingAppointment = await appointmentModel.findOne({
            doctorId: req.body.doctorId,
            date: formattedDate,
            time: formattedTime
        });

        if (existingAppointment) {
            return res.status(400).send({
                success: false,
                message: "This time slot has already been booked"
            });
        }

        // Create new appointment with the formatted date and time
        const newAppointment = new appointmentModel({
            ...req.body,
            date: formattedDate,  // Store as YYYY-MM-DD
            time: formattedTime,  // Store as HH:mm
            status: "pending"
        });

        const savedAppointment = await newAppointment.save();
        console.log('Saved appointment:', {
            date: savedAppointment.date,
            time: savedAppointment.time
        });

        // Send notification to doctor
        const user = await userModel.findOne({ _id: req.body.doctorInfo.userId });
        if (user) {
            user.notification = user.notification || [];
            user.notification.push({
                type: "New-appointment-request",
                message: `A new Appointment Request from ${req.body.userInfo.name}`,
                onClickPath: "/doctor-appointments",
                createdAt: new Date()
            });
            await user.save();
        }

        res.status(200).send({
            success: true,
            message: "Appointment booked successfully",
        });
    } catch (error) {
        console.log("Error in bookAppointment:", error);
        res.status(500).send({
            message: 'Error booking appointment',
            success: false,
            error: error.message
        });
    }
};

export const userAppointments = async (req, res) => {
    try {
        const appointments = await appointmentModel.find({ userId: req.userId })
            .populate('doctorId', 'firstName lastName email specialization experience fees timings')
            .populate('userId', 'name email phone')
            .sort({ createdAt: -1 });
        
        // Format dates and times before sending
        const formattedAppointments = appointments.map(apt => {
            const doc = apt.toObject();
            return {
                ...doc,
                // Keep the original date as stored in DB
                date: doc.date,
                time: doc.time
            };
        });

        res.status(200).send({
            success: true,
            message: "Appointments fetched successfully",
            data: formattedAppointments
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
    const userId = req.userId;
    const appointmentId = req.body.appointmentId;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const base64File = file.buffer.toString('base64');

    // Update the appointment with the file
    const updatedAppointment = await appointmentModel.findByIdAndUpdate(
      appointmentId,
      { 
        $set: { 
          attachment: base64File,
          reportUploaded: true
        } 
      },
      { new: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Report uploaded successfully',
      appointment: updatedAppointment,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: 'Upload failed', error: error.message });
  }
};

export const removeReportController = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const updatedAppointment = await appointmentModel.findByIdAndUpdate(
      appointmentId,
      { 
        $unset: { attachment: 1 },
        $set: { reportUploaded: false }
      },
      { new: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Report removed successfully',
      appointment: updatedAppointment,
    });
  } catch (error) {
    console.error('Remove error:', error);
    res.status(500).json({ success: false, message: 'Failed to remove report', error: error.message });
  }
};

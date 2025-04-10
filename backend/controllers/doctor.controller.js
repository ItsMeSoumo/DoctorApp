import doctorModel from "../models/doctorModel.js"
import appointmentModel from "../models/appointmentModel.js"
import userModel from '../models/userModels.js'

export const getDoctorInfo = async(req, res) => {
    try{
        const doctor = await doctorModel.findOne({userId: req.body.userId})
        if (!doctor) {
            return res.status(404).send({
                success: false,
                message: 'Doctor profile not found'
            })
        }
        res.status(200).send({
            success: true,
            data: {doctor}
        })
    } catch(error){
        console.log(error)
        res.status(500).send({
            message:'Doctor info error',
            success: false,
            error
        })
    }
}

export const updateDoctorInfo = async(req, res) => {
    try{
        const doctor = await doctorModel.findOneAndUpdate(
            {userId: req.body.userId}, 
            req.body,
            { new: true }
        )
        if (!doctor) {
            return res.status(404).send({
                success: false,
                message: 'Doctor profile not found'
            })
        }
        res.status(200).send({
            success: true,
            message: "Doctor info updated",
            data: doctor
        })
    } catch(error){
        console.log(error)
        res.status(500).send({
            message:'Doctor info error',
            success: false,
            error
        })
    }
}

export const getDoctorbyId = async(req, res) => {
    try{
        const doctor = await doctorModel.findById(req.body.doctorId);
        if (!doctor) {
            return res.status(404).send({
                success: false,
                message: 'Doctor not found'
            });
        }
        res.status(200).send({
            success: true,
            message: "Doctor fetched successfully",
            data: doctor
        });
    } catch(error){
        console.log(error)
        res.status(500).send({
            message:'Error getting doctor details',
            success: false,
            error
        })
    }
}

export const doctorAppointments = async (req, res) => {
    try {
        // First find the doctor using userId from auth middleware
        const doctor = await doctorModel.findOne({ userId: req.userId });
        
        if (!doctor) {
            return res.status(404).send({
                success: false,
                message: "Doctor not found, invalid userId"
            });
        }

        // Then find all appointments for this doctor
        const appointments = await appointmentModel.find({ 
            doctorId: doctor._id 
        });

        res.status(200).send({
            success: true,
            message: "Doctor Appointments fetched successfully",
            data: appointments.map(appointment => ({
                ...appointment.toObject(),
                doctorInfo: appointment.doctorInfo,
                userInfo: appointment.userInfo,
                date: appointment.date,
                time: appointment.time,
                status: appointment.status,
                _id: appointment._id
            }))
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in fetching doctor appointments",
            error
        });
    }
};
  
export const updateStatusController = async (req, res) => {
    try {
        const { appointmentId, status } = req.body;

        if (!appointmentId || !status) {
            return res.status(400).send({
                success: false,
                message: "Appointment ID and status are required"
            });
        }

        const appointment = await appointmentModel.findById(appointmentId);
        if (!appointment) {
            return res.status(404).send({
                success: false,
                message: "Appointment not found"
            });
        }

        appointment.status = status;
        await appointment.save();

        const user = await userModel.findOne({ _id: appointment.userId });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Associated user not found"
            });
        }

        const notification = user.notification || [];
        notification.push({
            type: "status-updated",
            message: `Your appointment has been ${status}`,
            onClickPath: "/doctor-appointments",
        });
        await user.save();

        res.status(200).send({
            success: true,
            message: "Appointment Status Updated Successfully",
            data: appointment
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Updating Appointment Status",
            error: error.message
        });
    }
};


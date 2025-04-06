import userModel from '../models/userModels.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import doctorModel from '../models/doctorModel.js'

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
        res.status(200).send({message: `Login Succesfull`, success: true, token, 
            role: {   
            isAdmin: user.isAdmin,
            isDoctor: user.isDoctor
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
        const user = await userModel.findOne({_id: req.body.userId})
        if(!user){
            return res.status(200).send({
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

export const applyDoctors = async (req, res) => {
    try {
      const newDoctor = new doctorModel({
        ...req.body,
        status: 'pending',
      });
      await newDoctor.save();
  
      const adminUser = await userModel.findOne({ isAdmin: true });
      const notification = adminUser.notification;
  
      notification.push({
        type: 'apply-doctor-request',
        message: `${newDoctor.firstName} ${newDoctor.lastName} has applied for a Doctor account`,
        data: {
          doctorId: newDoctor._id,
          name: newDoctor.firstName + " " + newDoctor.lastName,
          onClickPath: '/admin/doctors',
        },
      });
  
      await userModel.findByIdAndUpdate(adminUser._id, { notification });
  
      res.status(201).send({
        success: true,
        message: 'Doctor Account Applied Successfully',
      });
    } catch (error) {
      console.error("Apply Doctor Error: ", error);
      res.status(500).send({
        message: 'Error a gaya mere bablu',
        success: false,
        error,
      });
    }
}

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
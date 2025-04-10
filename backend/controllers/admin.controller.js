import userModel from '../models/userModels.js'
import doctorModel from '../models/doctorModel.js'
import jwt from 'jsonwebtoken'

export const getAllUsers = async(req, res) => {
    try{
        const user = await userModel.find({})
        
            res.status(200).send({
                success: true,
                message: "All Users Fetched",
                data: user,
            })
    } catch(error){
        console.log(error)
        res.status(500).send({
            message:'Error in getAllUsers',
            success: false,
            error
        })
    }
}

export const deleteUser = async(req, res) => {
    try {
        const userId = req.params.userId;
        const user = await userModel.findByIdAndDelete(userId);
        
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User not found"
            });
        }

        // If user was a doctor, delete doctor profile too
        if (user.isDoctor) {
            await doctorModel.findOneAndDelete({ userId: userId });
        }

        res.status(200).send({
            success: true,
            message: "User deleted successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: 'Error deleting user',
            success: false,
            error
        });
    }
};

export const getAllDoctors = async(req, res) => {
    try{
        const doctor = await doctorModel.find({})
            res.status(200).send({
                success: true,
                message: "All doctors Fetched",
                data: doctor,
            })
    } catch(error){
        console.log(error)
        res.status(500).send({
            message:'Error in getAlldoctors',
            success: false,
            error
        })
    }
}

// export const changeStatus = async (req, res) => {
//   try {
//     const { doctorId, status } = req.body;

//     // Step 1: Update doctor status
//     const doctor = await doctorModel.findByIdAndUpdate(
//       doctorId,
//       { status },
//       { new: true } // returns updated doc
//     );

//     // Step 2: Find the user related to that doctor
//     const user = await userModel.findById(doctor.userId);

//     // Step 3: Update user's isDoctor flag
//     user.isDoctor = status === "approved" ? true : false;

//     // Step 4: Add notification
//     const notification = user.notification || [];
//     notification.push({
//       type: "doctor-account-request-updated",
//       message: `Your Doctor Account Request Has ${status}`,
//       onClickPath: "/notification",
//     });

//     // Step 5: Save user
//     user.notification = notification;
//     await user.save();

//     res.status(200).send({
//       success: true,
//       message: "Account Status Updated",
//       data: doctor,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: "Error in Account Status",
//       error,
//     });
//   }
// };

  
export const changeStatus = async (req, res) => {
    try {
      const { doctorId, status } = req.body;
  
      
      const doctor = await doctorModel.findByIdAndUpdate(
        doctorId,
        { status },
        { new: true } 
      );
  
      
      const user = await userModel.findById(doctor.userId);
  
  
      const notification = user.notification || [];
      notification.push({
        type: "doctor-account-request-updated",
        message: `Your Doctor Account Request Has ${status}`,
        onClickPath: "/notification",
      });

      user.isDoctor = status === "approved" ? true : false;
      
      user.notification = notification;
      await user.save();
  
      res.status(200).send({
        success: true,
        message: "Account Status Updated",
        data: doctor,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error in Account Status",
        error,
      });
    }
  };
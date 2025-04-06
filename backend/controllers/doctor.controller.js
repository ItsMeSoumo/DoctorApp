import doctorModel from "../models/doctorModel.js"

export const getDoctorInfo = async(req, res) => {
    try{
        const doctor = await doctorModel.findOne({userId: req.body.userId})
            res.status(200).send({
                success: true,
                data: {doctor}
            })
        
    } catch(error){
        res.status(500).send({
            message:'Doctor info error',
            success: false,
            error
        })
    }
}

export const updateDoctorInfo = async(req, res) => {
    try{
        const doctor = await doctorModel.findOneAndUpdate({userId: req.body.userId}, req.body)
            res.status(200).send({
                success: true,
                message: "Doctor info updated",
                data: doctor
            })
        
    } catch(error){
        res.status(500).send({
            message:'Doctor info error',
            success: false,
            error
        })
    }
}

import mongoose from "mongoose"; 

const doctorSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    firstName:{
        type: String,
        required:[true, 'first name is require']
    },

    lastName:{
        type: String,
        required:[true, 'last name is require']
    },

    email:{
        type:String,
        required: [true, 'email is required']   
    },
    password:{
        type:String,
        required: [true, 'password is required']
    },
    specialization:{
        type: String,
        required: [true, 'required']
    },
    experience:{
        type: String,
        required: [true, 'experience is required']
    },
    fees:{
        type: Number,
        required:[true]
    },
    location: {
        type: String,
        default: ''  // Optional field with empty string as default
    },
    timings:{
        type: Object,
        required: [true, 'timming is required']
    },
     status:{
       type: String,
       default:'pending'
     },

},{timestamps:true})

const doctorModel = mongoose.model('doctors', doctorSchema)
export default doctorModel;
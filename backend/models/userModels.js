import mongoose from "mongoose"; 

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required:[true, 'name is require']
    },
    email:{
        type:String,
        required: [true, 'email is required']   
    },
    password:{
        type:String,
        required: [true, 'password is required']
    },
    phone: {
        type: String,
        required: false
    },
    gender: {
        type: String,
        required: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isDoctor: {
        type: Boolean,
        default: false
    },
    notification: {
        type: Array,
        default: []
    },
    seenNotification: {
        type: Array,
        default: []
    },
    reports: {
        type: Array,
        default: []
    }
})

const userModel = mongoose.models.users || mongoose.model('users', userSchema)
export default userModel;
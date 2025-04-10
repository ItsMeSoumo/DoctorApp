import mongoose from "mongoose"; 

const appointmentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'doctors',
        required: true,
    },
    doctorInfo: {
        type: Object,
        required: true,
    },
    userInfo: { 
        type: Object,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    attachment: {
        type: String,
        default: null,
    },
    status: {
        type: String,
        required: true,
        default: "pending",
    },
}, {timestamps: true});

const appointmentModel = mongoose.model("Appointment", appointmentSchema);
export default appointmentModel;

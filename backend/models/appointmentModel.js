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
        validate: {
            validator: function(v) {
                return /^\d{4}-\d{2}-\d{2}$/.test(v);
            },
            message: props => `${props.value} is not a valid date format! Use YYYY-MM-DD`
        }
    },
    time: {
        type: String,
        required: true,
        // validate: {
        //     validator: function(v) {
        //         return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
        //     },
        //     message: props => `${props.value} is not a valid time format! Use HH:mm`
        // }
    },
    status: {
        type: String,
        required: true,
        default: "pending",
    },
    isOnlineVisit: {
        type: Boolean,
        default: false
    },
    attachment: {
        type: String,
        default: null,
    },
    reportUploaded: {
        type: Boolean,
        default: false
    }
}, {timestamps: true});

const appointmentModel = mongoose.model("Appointment", appointmentSchema);
export default appointmentModel;

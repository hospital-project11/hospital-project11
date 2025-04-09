import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        trim: true, 
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: { 
        type: String, 
        required: true },
    phone: {
        type: String,
        default: '',
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        default: 'male',
    },
    profileImage: { 
        type: String,
        default: '',
    },
    role: {
        type: String,
        enum: ['admin', 'doctor', 'patient'],
        default: 'patient',
    },
    createdAt: { type: Date, default: Date.now },
    isDeleted: { 
        type: Boolean, 
        default: false 
    },
});

export default mongoose.models.User || mongoose.model('User', userSchema);

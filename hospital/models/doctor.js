// app/models/doctor.js
import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    specialization: { type: String, required: true },
    category: { type: String },
    experience: { type: Number },
    bio: { type: String },
    price: { type: Number, required: true },
    availableSlots: [Date],
});

export default mongoose.models.Doctor || mongoose.model('Doctor', doctorSchema);

// app/models/appointment.js
import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
    {
        doctorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Doctor',
            required: true,
        },
        patientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        appointmentDate: { type: Date, required: true },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'cancelled'],
            default: 'pending',
        },
        diagnosis: {
            type: String,
            default: '',
        },
        payment: {
            amount: { type: Number, required: true },
            method: {
                type: String,
                enum: ['card', 'paypal', 'cash'],
                default: 'card',
            },
            status: {
                type: String,
                enum: ['pending', 'paid', 'failed'],
                default: 'pending',
            },
            paidAt: { type: Date },
        },
        createdAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

const Appointment =
    mongoose.models.Appointment || mongoose.model('Appointment', appointmentSchema);

export default Appointment;

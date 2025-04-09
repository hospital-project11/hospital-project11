import mongoose from "mongoose";
import Appointment from "../../models/appointment";
import { connectToDatabase } from "../../../lib/mongodb"; // تأكد من أن مسار الاتصال صحيح

export default async function handler(req, res) {
    if (req.method === "POST") {
        try {
            await connectToDatabase();

            const { appointmentId, paymentMethod } = req.body;

            // جلب بيانات الموعد من قاعدة البيانات
            const appointment = await Appointment.findById(appointmentId).populate(
                "patientId doctorId"
            );
            if (!appointment)
                return res.status(404).json({ message: "Appointment not found" });

            appointment.payment.method = paymentMethod;
            appointment.payment.status = "pending";
            appointment.payment.paidAt = new Date();

            await appointment.save();

            return res.status(200).json({
                patientName: appointment.patientId.name,
                price: appointment.payment.amount,
                paymentMethods: ["cash", "paypal", "card"],
                paymentStatus: appointment.payment.status,
                appointmentId: appointment._id,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    } else {
        res.status(405).json({ message: "Method Not Allowed" });
    }
}
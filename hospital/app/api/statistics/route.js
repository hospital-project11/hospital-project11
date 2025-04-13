import { connectDB } from "@/lib/mongodb";
import Appointment from "@/models/appointment";
import User from "@/models/user";
import Doctor from "@/models/doctor";
import Contact from "@/models/contact";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();

  try {
    // Total number of users
    const totalUsers = await User.countDocuments();

    // Total number of appointments
    const totalAppointments = await Appointment.countDocuments();

    // Total number of contacts
    const totalContacts = await Contact.countDocuments();

    // Total number of doctors
    const totalDoctors = await Doctor.countDocuments();

    // Fetch most and least appointments for doctors
    const doctorAppointments = await Appointment.aggregate([
      { $group: { _id: "$doctorId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const mostAppointmentsDoctor = doctorAppointments[0];
    const leastAppointmentsDoctor = doctorAppointments[doctorAppointments.length - 1];

    // Fetch most and least appointments for patients
    const patientAppointments = await Appointment.aggregate([
      { $group: { _id: "$patientId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const mostAppointmentsPatient = patientAppointments[0];
    const leastAppointmentsPatient = patientAppointments[patientAppointments.length - 1];

    // Sum total prices for appointments
    const totalPrice = await Appointment.aggregate([
      { $group: { _id: null, totalAmount: { $sum: "$payment.amount" } } },
    ]);

    const totalAppointmentPrice = totalPrice[0]?.totalAmount || 0;

    // Appointment status breakdown (pending, confirmed, done, cancelled)
    const appointmentStatus = await Appointment.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        totalAppointments,
        totalContacts,
        totalDoctors,
        mostAppointmentsDoctor,
        leastAppointmentsDoctor,
        mostAppointmentsPatient,
        leastAppointmentsPatient,
        totalAppointmentPrice,
        appointmentStatus,
      },
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch statistics' }, { status: 500 });
  }
}

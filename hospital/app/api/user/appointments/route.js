// app/api/appointments/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Appointment from "@/models/appointment";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get("patientId");

    if (!patientId) {
      return NextResponse.json(
        { error: "Patient ID is required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Find appointments for this patient and populate the doctor information
    const appointments = await Appointment.find({ patientId })
      .populate("doctorId", "name specialization")
      .sort({ appointmentDate: -1 });
      console.log("Appointments found:", appointments);
    return NextResponse.json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointments" },
      { status: 500 }
    );
  }
  
}

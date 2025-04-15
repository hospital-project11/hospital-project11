// app/api/user/feedback/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Appointment from "@/models/appointment";

export async function POST(request) {
  try {
    // Connect to the database
    await connectDB();

    // Get request body
    const { appointmentId, feedback, rating } = await request.json();

    // Validate input
    if (!appointmentId || !feedback) {
      return NextResponse.json(
        { error: "Appointment ID and feedback are required" },
        { status: 400 }
      );
    }

    // Find the appointment
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }

    // Check if appointment status is "done"
    if (appointment.status !== "done") {
      return NextResponse.json(
        { error: "Feedback can only be submitted for completed appointments" },
        { status: 400 }
      );
    }

    // Update the appointment with feedback and rating
    appointment.feedback = feedback;

    // If rating is provided, store it in the rating field
    if (rating) {
      appointment.rating = rating;
    }

    await appointment.save();
    return NextResponse.json(
      { message: "Feedback submitted successfully", appointment },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error submitting feedback:", error);
    return NextResponse.json(
      { error: "An error occurred while submitting feedback" },
      { status: 500 }
    );
  }
}

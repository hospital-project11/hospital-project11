import { connectDB } from "@/lib/mongodb";
import Appointment from "@/models/appointment";

export async function GET(req, { params }) {
  const { id } = params; 

  if (!id) {
    return new Response(
      JSON.stringify({ success: false, message: "id (patientId) is required" }),
      { status: 400 }
    );
  }

  await connectDB();

  try {
    const appointments = await Appointment.find({ patientId: id }).populate('doctorId', 'name');

    if (appointments.length === 0) {
      return new Response(
        JSON.stringify({ success: false, message: "No appointments found for this patient." }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data: appointments }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Failed to fetch appointments' }),
      { status: 500 }
    );
  }
}

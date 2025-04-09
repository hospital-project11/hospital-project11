import { connectDB } from "@/lib/mongodb";
import Appointment from "@/models/appointment";

export async function GET(req, { params }) {
  // Access dynamic parameter from params
  const { id } = params; // 'id' is the dynamic route parameter from the folder name [id]

  // Make sure id exists
  if (!id) {
    return new Response(
      JSON.stringify({ success: false, message: "id (patientId) is required" }),
      { status: 400 }
    );
  }

  await connectDB();

  try {
    // Fetch appointments where the id matches the patientId
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
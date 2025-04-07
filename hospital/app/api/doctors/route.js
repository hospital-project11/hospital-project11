import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Appointment from '@/models/appointment'; 
import jwt from 'jsonwebtoken'; 
import { cookies } from 'next/headers'; 
import mongoose from 'mongoose';
const getDoctorIdFromToken = async () => {
  const cookieStore = await cookies(); // Get cookies asynchronously
  const token = cookieStore.get('token')?.value; // Extract token from cookies

  if (!token) {
    throw new Error('Token is required');
  }

  try {
    // Decode the token using the JWT secret
    const decoded = jwt.decode(token); // Decode token to get payload
    return decoded?.userId; // Return userId from the decoded payload
  } catch (error) {
    throw new Error('Failed to decode token');
  }
};

export async function POST(request) {
  try {
    await connectDB();

    // Extract doctorId (userId) from JWT token
    const doctorUserId = await getDoctorIdFromToken(); // This is the userId of the doctor from JWT
    console.log('Doctor userId extracted from JWT:', doctorUserId); // Log doctor userId for debugging

    if (!doctorUserId) {
      return NextResponse.json({ success: false, error: 'Doctor not logged in' }, { status: 400 });
    }

    // Find the doctorId in the doctors collection based on the userId (userId is stored as userId in doctors)
    const doctor = await mongoose.model('Doctor').findOne({ userId: new mongoose.Types.ObjectId(doctorUserId) });
    
    if (!doctor) {
      return NextResponse.json({ success: false, error: 'Doctor not found' }, { status: 400 });
    }

    const doctorId = doctor._id; // Get the doctorId from the doctors collection
    console.log('Doctor ID from doctors collection:', doctorId); // Log doctorId for debugging

    // Get the appointment data from the request
    const body = await request.json();
    const { date, time } = body;

    if (!date || !time || !doctorId) {
      return NextResponse.json(
        { success: false, error: 'doctorId, date, and time are required' },
        { status: 400 }
      );
    }

    const appointmentDate = new Date(`${date}T${time}:00`);

    // Ensure that the doctorId is stored as an ObjectId in the appointments collection
    const newAppointment = await Appointment.create({
      doctorId: new mongoose.Types.ObjectId(doctorId), // Use doctorId from doctors collection as ObjectId
      appointmentDate,
      status: 'pending',
      payment: {
        amount: 0,
      },
    });

    return NextResponse.json({ success: true, appointment: newAppointment });
  } catch (error) {
    console.error('POST /appointments error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    await connectDB();

    // Step 1: Extract the userId from the JWT token
    const userId = await getDoctorIdFromToken();
    console.log('User ID (from JWT) extracted:', userId); // Log for debugging

    if (!userId) {
      return NextResponse.json({ success: false, error: 'Doctor not logged in' }, { status: 400 });
    }

    // Step 2: Find the doctorId in the doctors collection based on the userId
    const doctor = await mongoose.model('Doctor').findOne({ userId: new mongoose.Types.ObjectId(userId) });
    console.log('Doctor found:', doctor); // Log the found doctor for debugging

    if (!doctor) {
      return NextResponse.json({ success: false, error: 'Doctor not found' }, { status: 400 });
    }

    const doctorId = doctor._id; // The actual doctorId in the doctors collection
    console.log('Doctor ID from doctors collection:', doctorId); // Log doctorId for debugging

    // Step 3: Convert doctorId to MongoDB ObjectId for querying the appointments collection
    const doctorObjectId = new mongoose.Types.ObjectId(doctorId);
    console.log('Doctor ObjectId for querying appointments:', doctorObjectId); // Log ObjectId for debugging

    // Step 4: Query the appointments collection based on the doctorId
    const appointments = await Appointment.find({ doctorId: doctorObjectId })
      .populate('doctorId')
      .populate('patientId');

    console.log('Appointments fetched:', appointments); // Log the fetched appointments

    if (!appointments || appointments.length === 0) {
      return NextResponse.json({ success: true, appointments: [] });
    }

    return NextResponse.json({ success: true, appointments });
  } catch (error) {
    console.error('GET appointments error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}












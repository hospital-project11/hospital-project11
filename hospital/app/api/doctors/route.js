import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Appointment from '@/models/appointment';
import Doctor from '@/models/doctor';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const getAuthenticatedDoctor = async () => {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) throw new Error('Authentication required');

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  await connectDB();
  
  const doctor = await Doctor.findOne({ userId: decoded.userId });
  if (!doctor) throw new Error('Doctor profile not found');

  return doctor;
};

export async function GET() {
  try {
    const doctor = await getAuthenticatedDoctor();
    
    const appointments = await Appointment.find({ doctorId: doctor._id })
      .populate('patientId', 'name email')
      .sort({ appointmentDate: 1 });

    return NextResponse.json({
      success: true,
      appointments,
      doctor: {
        _id: doctor._id,
        specialization: doctor.specialization,
        price: doctor.price
      }
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.message.includes('Authentication') ? 401 : 500 }
    );
  }
}

export async function POST(request) {
  try {
    const doctor = await getAuthenticatedDoctor();
    const { date, time } = await request.json();

    if (!date || !time) throw new Error('Date and time are required');

    const appointmentDate = new Date(`${date}T${time}:00`);
    if (isNaN(appointmentDate.getTime())) throw new Error('Invalid date/time');

    const newAppointment = await Appointment.create({
      doctorId: doctor._id,
      patientId: null, // Explicitly set to null
      appointmentDate,
      status: 'pending', // Matches model default
      payment: {
        amount: doctor.price || 0,
        method: 'card',
        status: 'pending'
      },
      diagnosis: '' // Explicitly set empty string
    });

    return NextResponse.json(
      { success: true, appointment: newAppointment },
      { status: 201 }
    );

  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
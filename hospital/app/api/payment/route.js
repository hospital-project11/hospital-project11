import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Appointment from '@/models/appointment';
import jwt from 'jsonwebtoken';  
import { cookies } from 'next/headers';  

const getPatientIdFromToken = () => {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;
  
  if (!token) {
    throw new Error('Authentication required');
  }
  
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
  return decoded.userId; 
};

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { appointmentId, price } = body;
    
    if (!appointmentId || !price) {
      return NextResponse.json(
        { success: false, error: 'Missing appointmentId or price' },
        { status: 400 }
      );
    }

    const patientId = getPatientIdFromToken();
    
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      {
        status: 'confirmed',
        patientId: patientId,  
        'payment.amount': price,
        'payment.method': 'paypal',
        'payment.status': 'paid',
        'payment.paidAt': new Date(),
      },
      { new: true }
    )
      .populate('patientId', 'name email phone') 
      .populate({
        path: 'doctorId',
        populate: {
          path: 'userId',
          select: 'name email',
        },
        select: 'specialization price',
      });

    if (!updatedAppointment) {
      return NextResponse.json(
        { success: false, error: 'Appointment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      appointment: updatedAppointment,
    });
    
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

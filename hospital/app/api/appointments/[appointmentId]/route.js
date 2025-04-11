import { connectDB } from '@/lib/mongodb';
import Appointment from '@/models/appointment';
import User from '@/models/user';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    await connectDB();

    const { appointmentId } = await params;
    
    if (!appointmentId) {
      return NextResponse.json(
        { success: false, error: 'Appointment ID is required' },
        { status: 400 }
      );
    }

    const appointment = await Appointment.findById(appointmentId)
      .populate({
        path: 'patientId',
        model: 'User',
        select: 'name email phone'
      })
      .populate({
        path: 'doctorId',
        populate: {
          path: 'userId',
          model: 'User',
          select: 'name email phone'
        }
      });

    if (!appointment) {
      return NextResponse.json(
        { success: false, error: 'Appointment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      appointment
    });

  } catch (error) {
    console.error('Error fetching appointment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch appointment details' },
      { status: 500 }
    );
  }
}
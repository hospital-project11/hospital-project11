// app/api/appointments/[appointmentId]/route.js
import { connectDB } from '@/lib/mongoose';
import Appointment from '@/models/appointment';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const { appointmentId } = params;
    
    // Validate appointmentId format
    if (!appointmentId || !mongoose.Types.ObjectId.isValid(appointmentId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid appointment ID format' },
        { status: 400 }
      );
    }

    // Find the appointment with populated data
    const appointment = await Appointment.findById(appointmentId)
      .populate({
        path: 'patientId',
        select: 'name email phone',
        model: 'User'
      })
      .populate({
        path: 'doctorId',
        populate: {
          path: 'userId',
          select: 'name email phone',
          model: 'User'
        }
      })
      .lean(); // Convert to plain JavaScript object

    if (!appointment) {
      return NextResponse.json(
        { success: false, error: 'Appointment not found' },
        { status: 404 }
      );
    }

    // Transform the data structure if needed
    const transformedAppointment = {
      ...appointment,
      patientId: appointment.patientId || null,
      doctorId: appointment.doctorId || null
    };

    return NextResponse.json({
      success: true,
      appointment: transformedAppointment
    });

  } catch (error) {
    console.error('Error fetching appointment:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
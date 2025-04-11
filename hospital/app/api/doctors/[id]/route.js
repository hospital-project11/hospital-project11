import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Appointment from '@/models/appointment';
import Doctor from '@/models/doctor';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = params;

    // Authentication
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verify token and get doctor
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const doctor = await Doctor.findOne({ userId: decoded.userId });
    
    if (!doctor) {
      return NextResponse.json(
        { success: false, error: 'Doctor not found' },
        { status: 404 }
      );
    }

    // Get request body
    const body = await request.json();
    const { status, diagnosis } = body;

    // Validate status
    const validStatuses = ['pending', 'confirmed', 'cancelled','done'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status value' },
        { status: 400 }
      );
    }

    // Find and update appointment
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return NextResponse.json(
        { success: false, error: 'Appointment not found' },
        { status: 404 }
      );
    }

    // Verify doctor owns the appointment
    if (appointment.doctorId.toString() !== doctor._id.toString()) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized to update this appointment' },
        { status: 403 }
      );
    }

    // Prepare update data
    const updateData = {};
    if (status) updateData.status = status;
    if (diagnosis !== undefined) updateData.diagnosis = diagnosis;

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).populate('patientId', 'name email phone');

    return NextResponse.json({
      success: true,
      appointment: updatedAppointment
    });

  } catch (error) {
    console.error('Error updating appointment:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
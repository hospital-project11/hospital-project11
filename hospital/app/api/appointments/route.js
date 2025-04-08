import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Appointment from '@/models/appointment';
import Doctor from '@/models/doctor';
import User from '@/models/user';

export async function GET(request) {
    try {
      await connectDB();
  
      const { searchParams } = new URL(request.url);
      const date = searchParams.get('date'); 
  
      let query = {
        status: 'pending',
        appointmentDate: { $gte: new Date() },
      };
  
      // If a date is provided, filter by appointmentDate
      if (date) {
        const start = new Date(date);
        const end = new Date(date);
        end.setHours(23, 59, 59, 999); // Set the end of the day
        query.appointmentDate = { $gte: start, $lte: end }; // Filter between the date range
      }
  
      // Populate the correct reference field ('doctorId') and the doctor's details
      const appointments = await Appointment.find(query)
        .populate({
          path: 'doctorId',  // Correct field that references the Doctor model
          model: 'Doctor',  // Reference the Doctor model
          select: 'specialization price availableSlots',  // Select fields from the Doctor model
          populate: {
            path: 'userId',  // Populate the 'userId' inside the Doctor model to get the doctor's name
            model: 'User',  // Ensure the 'User' model is populated
            select: 'name',  // Select the doctor's name from the User model
          },
        });
  
      return NextResponse.json({ appointments });
    } catch (error) {
      console.error('Error fetching appointments:', error);
      return NextResponse.json({ message: 'Failed to fetch appointments' }, { status: 500 });
    }
  }

export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();  
    const appointment = new Appointment({
      doctorId: data.doctorId,
      patientId: data.patientId,
      appointmentDate: new Date(data.appointmentDate),  
      status: data.status,
      payment: data.payment,
    });

    await appointment.save();  
    return NextResponse.json({ message: 'Appointment added successfully', appointment });
  } catch (error) {
    console.error('Error adding appointment:', error);
    return NextResponse.json({ message: 'Failed to add appointment' }, { status: 500 });
  }
}

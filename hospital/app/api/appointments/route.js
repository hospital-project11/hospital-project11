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
      const doctorName = searchParams.get('name'); 
  
      let query = {
        status: 'pending',
        appointmentDate: { $gte: new Date() },
        'payment.status': { $ne: 'paid' },
      };
  
      if (date) {
        const start = new Date(date);
        const end = new Date(date);
        end.setHours(23, 59, 59, 999); 
        query.appointmentDate = { $gte: start, $lte: end }; 
      }
  
      if (doctorName) {
        query['doctorId.userId.name'] = { $regex: doctorName, $options: 'i' };  
      }
  
      const appointments = await Appointment.find(query)
        .populate({
          path: 'doctorId',  
          model: 'Doctor',  
          select: 'specialization price availableSlots', 
          populate: {
            path: 'userId', 
            model: 'User',  
            select: 'name',  
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

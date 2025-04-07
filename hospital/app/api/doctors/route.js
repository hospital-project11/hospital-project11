import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Doctor from '@/models/doctor';

export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();  
    
    const doctor = new Doctor({
      userId: data.userId,
      specialization: data.specialization,
      category: data.category,
      experience: data.experience,
      bio: data.bio,
      price: data.price,
      availableSlots: data.availableSlots,
    });

    await doctor.save();  

    return NextResponse.json({ message: 'Doctor added successfully', doctor });
  } catch (error) {
    console.error('Error adding doctor:', error);
    return NextResponse.json({ message: 'Failed to add doctor' }, { status: 500 });
  }
}

// Adding the GET handler for doctors
export async function GET(request) {
  try {
    await connectDB();

    // Fetch the doctors from the database
    const doctors = await Doctor.find();
    
    return NextResponse.json(doctors);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return NextResponse.json({ message: 'Failed to fetch doctors' }, { status: 500 });
  }
}

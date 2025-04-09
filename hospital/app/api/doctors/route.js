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

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') || null;
    const dateRange = searchParams.get('dateRange') || null;
    const search = searchParams.get('search') || null;
    
    // Validate pagination parameters
    if (page < 1 || isNaN(page)) {
      return NextResponse.json(
        { success: false, error: 'Invalid page parameter' },
        { status: 400 }
      );
    }
    
    if (limit < 1 || limit > 50 || isNaN(limit)) {
      return NextResponse.json(
        { success: false, error: 'Invalid limit parameter' },
        { status: 400 }
      );
    }
    
    const skip = (page - 1) * limit;
    const doctor = await getAuthenticatedDoctor();
    
    // Build filter criteria
    const filterCriteria = { doctorId: doctor._id };
    
    // Add status filter if provided
    if (status && status !== 'all') {
      filterCriteria.status = status;
    }
    
    // Add date range filter if provided
    if (dateRange) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (dateRange === 'today') {
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        filterCriteria.appointmentDate = { 
          $gte: today, 
          $lt: tomorrow 
        };
      } else if (dateRange === 'week') {
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);
        filterCriteria.appointmentDate = { 
          $gte: today, 
          $lt: nextWeek 
        };
      } else if (dateRange === 'month') {
        const nextMonth = new Date(today);
        nextMonth.setMonth(today.getMonth() + 1);
        filterCriteria.appointmentDate = { 
          $gte: today, 
          $lt: nextMonth 
        };
      }
    }
    
    // Search by patient name if provided
    let patientSearch = {};
    if (search) {
      // We'll need to perform an aggregation to search by patient name
      patientSearch = {
        $or: [
          { 'patientData.name': { $regex: search, $options: 'i' } },
          { 'patientData.email': { $regex: search, $options: 'i' } }
        ]
      };
    }

    // Get total count for pagination metadata
    const totalCount = await Appointment.countDocuments(filterCriteria);
    
    // Create aggregation pipeline
    const pipeline = [
      { $match: filterCriteria },
      // Lookup patient data
      {
        $lookup: {
          from: 'patients', // Use your actual collection name for patients
          localField: 'patientId',
          foreignField: '_id',
          as: 'patientData'
        }
      },
      { $unwind: { path: '$patientData', preserveNullAndEmptyArrays: true } },
      // Apply patient search filter if provided
      ...(search ? [{ $match: patientSearch }] : []),
      // Sort by appointment date
      { $sort: { appointmentDate: 1 } },
      // Apply pagination
      { $skip: skip },
      { $limit: limit },
      // Project only needed fields
      {
        $project: {
          _id: 1,
          doctorId: 1,
          patientId: 1,
          appointmentDate: 1,
          status: 1,
          payment: 1,
          diagnosis: 1,
          'patientData.name': 1,
          'patientData.email': 1
        }
      }
    ];

    // Execute the aggregation
    const appointments = await Appointment.aggregate(pipeline);
    
    // Format the appointments to match the expected structure
    const formattedAppointments = appointments.map(apt => {
      // If patient data is present, format it as expected by the frontend
      if (apt.patientData) {
        apt.patientId = {
          _id: apt.patientId,
          name: apt.patientData.name,
          email: apt.patientData.email
        };
      }
      delete apt.patientData;
      return apt;
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      success: true,
      appointments: formattedAppointments,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNextPage,
        hasPrevPage
      },
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
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Appointment from '@/models/appointment';
import Doctor from '@/models/doctor';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const getAuthenticatedDoctor = async () => {
  const cookieStore = await cookies();
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
    let patientId = searchParams.get('patientId');  // Get patientId from query params

    // Ensure patientId is provided
    if (!patientId) {
      return NextResponse.json({ success: false, error: 'Patient ID is required' }, { status: 400 });
    }

    // Convert patientId to ObjectId if it's a valid ObjectId string
    if (!mongoose.Types.ObjectId.isValid(patientId)) {
      return NextResponse.json({ success: false, error: 'Invalid Patient ID' }, { status: 400 });
    }
    
    patientId = new mongoose.Types.ObjectId(patientId);  // Convert to ObjectId using `new`

    // Validate pagination parameters
    if (page < 1 || isNaN(page)) {
      return NextResponse.json({ success: false, error: 'Invalid page parameter' }, { status: 400 });
    }

    if (limit < 1 || limit > 50 || isNaN(limit)) {
      return NextResponse.json({ success: false, error: 'Invalid limit parameter' }, { status: 400 });
    }

    const skip = (page - 1) * limit;
    
    // Build the filter criteria (filter by patientId)
    const filterCriteria = { patientId };

    // Get total count for pagination metadata
    const totalCount = await Appointment.countDocuments(filterCriteria);

    // Create aggregation pipeline to fetch the appointments
    const pipeline = [
      { $match: filterCriteria },  // Match documents with the correct patientId
      { $sort: { appointmentDate: -1 } },  // Sort by appointment date (newest first)
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          _id: 1,
          doctorId: 1,
          patientId: 1,
          appointmentDate: 1,
          status: 1,
          diagnosis: 1,
        }
      }
    ];

    // Execute the aggregation pipeline
    const appointments = await Appointment.aggregate(pipeline);

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      success: true,
      appointments,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNextPage,
        hasPrevPage,
      },
    });

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

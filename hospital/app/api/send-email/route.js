import nodemailer from 'nodemailer';
import User from '@/models/user';
import { connectDB } from '@/lib/mongodb';

export async function POST(req) {
  try {
    await connectDB();
    const { doctorId } = await req.json();

    

    // Fetch user email by ID
    const doctor = await User.findById(doctorId);
    if (!doctor) {
      return Response.json({ success: false, error: 'User not found ' }, { status: 404 });
    }

    const to = doctor.email;
    // Create a transporter using SMTP (e.g., Gmail or any service)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // your email address
        pass: process.env.EMAIL_PASS, // your email password or app-specific password
      },
    });

    const mailOptions = {
      from: `"Lumera" <${process.env.EMAIL_USER}>`,
      to,
      subject: `New Appointment Scheduled `,
      html: `
        <p>Dear Dr. ${doctor.name},</p>

        <p>We are pleased to inform you that a new appointment has been successfully scheduled.</p>
        <p>Please make the necessary preparations. You can manage appointments from your dashboard.</p>

        <p>Thank you for your continued dedication and care.</p>

        <p>Best regards,<br/>
        <strong>Your Hospital Team</strong></p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return Response.json({ success: true, message: 'Email sent successfully.' });
  } catch (error) {
    console.error('Error sending email:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

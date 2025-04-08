import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Contact from '@/models/contact';  

export async function POST(request) {
    try {
        await connectDB();

        const { name, email, subject, message } = await request.json();

        const contactMessage = new Contact({
            name,
            email,
            subject,
            message,
        });

        await contactMessage.save();

        return NextResponse.json({ message: 'Message sent successfully!' }, { status: 200 });
    } catch (error) {
        console.error('Error sending message:', error);
        return NextResponse.json({ message: 'Failed to send message' }, { status: 500 });
    }
}

import { connectDB } from '../../../lib/mongodb';
import Contact from '../../../models/contact';  

export async function GET(req) {
  try {
    await connectDB(); 
    const contacts = await Contact.find({});
    return new Response(JSON.stringify(contacts), { status: 200 });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    
    return new Response(JSON.stringify({ error: 'Failed to fetch contacts' }), {
      status: 500,
    });
  }
}

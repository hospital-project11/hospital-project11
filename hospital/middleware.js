// const jwt = require('jsonwebtoken');
// const Cookie = require('js-cookie');

// const authenticate = (req, res, next) => {
//   const token = req.cookies.token;

//   if (!token) {
//     return res.status(401).json({ message: 'Access denied. No token provided.' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (error) {
//     return res.status(400).json({ message: 'Invalid token.' });
//   }
// };

// module.exports = authenticate;




import { jwtVerify } from 'jose';
import { NextResponse } from 'next/server';

export async function middleware(request) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return new Response('Access denied. No token provided.', { status: 401 });
  }

  try {

    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
    
    request.user = payload;

    const role = payload.role;
    const url = new URL(request.url);

    // If the user is not admin in /admin-dashboard
    if (url.pathname.startsWith('/admin-dashboard') && role !== 'admin') {
      // Redirect to Unauthorized page
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

   // If the user is not a doctor in /doctor-dashboard
    if (url.pathname.startsWith('/doctor-dashboard') && role !== 'doctor') {
     
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    return NextResponse.next();  // If the role is verified successfully
  } catch (error) {
    console.error("Token verification failed:", error);
    return new Response('Invalid token.', { status: 400 });
  }
}

export const config = {
  matcher: ['/admin-dashboard/:path*', '/doctor-dashboard/:path*'],
};



























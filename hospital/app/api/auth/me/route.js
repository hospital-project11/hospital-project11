// import { jwtVerify } from 'jose';

// export async function GET(req) {
//   const token = req.cookies.get('token')?.value;

//   if (!token) return new Response(JSON.stringify({ loggedIn: false }), { status: 200 });

//   try {
//     const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
//     return new Response(JSON.stringify({ loggedIn: true, role: payload.role }), { status: 200 });
//   } catch (err) {
//     return new Response(JSON.stringify({ loggedIn: false }), { status: 200 });
//   }
// }


//عشان يتاكد من التوكن
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return new Response(JSON.stringify({ loggedIn: false }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
    return new Response(JSON.stringify({
      loggedIn: true,
      role: payload.role,
      userId: payload.userId
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("JWT verification failed:", error);
    return new Response(JSON.stringify({ loggedIn: false }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
}

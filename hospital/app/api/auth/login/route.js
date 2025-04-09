// export const dynamic = "force-dynamic";

// import { connectDB } from "@/lib/mongodb";
// import User from "@/models/user";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import { cookies } from "next/headers";

// export async function POST(req) {
//   try {
//     await connectDB();
//     const { email, password } = await req.json();

//     if (!email || !password) {
//       return new Response(JSON.stringify({ message: "All fields are required" }), { status: 400 });
//     }

//     const user = await User.findOne({ email });
//     if (!user) {
//       return new Response(JSON.stringify({ message: "Invalid email or password" }), { status: 401 });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return new Response(JSON.stringify({ message: "Invalid email or password" }), { status: 401 });
//     }

//     const token = jwt.sign(
//       { userId: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     const cookieStore = await cookies(); 
//     cookieStore.set("token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       maxAge: 7 * 24 * 60 * 60,
//       path: "/",
//     });
//     return new Response(JSON.stringify({ message: "Login successful", role: user.role }), { status: 200 });

//   } catch (error) {
//     console.error("Login error:", error);
//     return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
//   }
// }


export const dynamic = "force-dynamic";

import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response(JSON.stringify({}), { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return new Response(JSON.stringify({}), { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return new Response(JSON.stringify({}), { status: 401 });
    }

    const token = jwt.sign(
      { userId: user._id.toString(), role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    cookies().set({
      name: "token",
      value: token,
      // httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60, 
      path: "/",
      sameSite: "strict",
    });

    return new Response(JSON.stringify({role: user.role }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });

  } catch (error) {
    console.error("Login error:", error);
    return new Response(JSON.stringify({}), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}


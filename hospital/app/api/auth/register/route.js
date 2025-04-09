// import { connectDB } from "@/lib/mongodb";
// import User from "@/models/user";
// import bcrypt from "bcryptjs";

// export async function POST(req) {
//   try {
//     await connectDB();
//     const { name, email, password } = await req.json();

//     if (!name || !email || !password) {
//       return new Response(JSON.stringify({}), { status: 400 }); // حذف رسالة الـ "All fields are required"
//     }

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return new Response(JSON.stringify({}), { status: 409 }); // حذف رسالة الـ "Email already exists"
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newUser = new User({
//       name,
//       email,
//       password: hashedPassword,
//       // role: ما نحطها، هي default = 'patient'
//     });

//     await newUser.save();

//     return new Response(JSON.stringify({}), { status: 201 }); // حذف رسالة الـ "User created successfully"
//   } catch (error) {
//     console.error(error);
//     return new Response(JSON.stringify({}), { status: 500 }); // حذف رسالة الـ "Server Error"
//   }
// }


import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await connectDB();
    const { name, email, password } = await req.json();


    if (!name || !email || !password) {
      return new Response(JSON.stringify({}), { status: 400 });
    }


    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({}), { status: 409 });
    }


    const hashedPassword = await bcrypt.hash(password, 10);


    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      // role: ما نحطها، هي default = 'patient'
    });

    await newUser.save();

    return new Response(JSON.stringify({}), {
      status: 201,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({}), {
      status: 500,
    });
  }
}
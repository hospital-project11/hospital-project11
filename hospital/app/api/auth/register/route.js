// import { connectDB } from "@/lib/mongodb";
// import User from "@/models/user";
// import bcrypt from "bcryptjs";

// export async function POST(req) {
//   try {
//     await connectDB();
//     const { name, email, password } = await req.json();


//     if (!name || !email || !password) {
//       return new Response(JSON.stringify({}), { status: 400 });
//     }


//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return new Response(JSON.stringify({}), { status: 409 });
//     }


//     const hashedPassword = await bcrypt.hash(password, 10);


//     const newUser = new User({
//       name,
//       email,
//       password: hashedPassword,
//     });

//     await newUser.save();

//     return new Response(JSON.stringify({}), {
//       status: 201,
//     });
//   } catch (error) {
//     console.error(error);
//     return new Response(JSON.stringify({}), {
//       status: 500,
//     });
//   }
// }

import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import Joi from "joi";

// Define the registration schema
const registrationSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export async function POST(req) {
  try {
    await connectDB();

    const { name, email, password } = await req.json();

    // Validate incoming data with Joi
    const { error } = registrationSchema.validate({ name, email, password });

    if (error) {
      return new Response(
        JSON.stringify({ message: error.details[0].message }),
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ message: 'User already exists' }), { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return new Response(JSON.stringify({ message: 'User created successfully' }), {
      status: 201,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
    });
  }
}
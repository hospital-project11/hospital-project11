import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import Doctor from "@/models/doctor";
import bcrypt from "bcryptjs";

export async function GET() {
  await connectDB();

  try {
    const users = await User.find();
    return Response.json(users);
  } catch (error) {
    return Response.json({ error: "فشل في جلب المستخدمين" }, { status: 500 });
  }
}

export async function POST(request) {
  await connectDB();

  const {
    name,
    email,
    password,
    phone,
    gender,
    role,
    specialization,
    price,
    experience,
    bio,
    category,
    availableSlots,
  } = await request.json();

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // 1. Create the new user
    const newUser = new User({
      name,
      email,
      password : hashedPassword,
      phone,
      gender,
      role,
    });

    // Save the new user
    const savedUser = await newUser.save();

    // 2. If the user is a doctor, create a new doctor record
    if (role === "doctor") {
      const newDoctor = new Doctor({
        userId: savedUser._id,
        specialization,
        price,
        experience: experience || 0,
        bio: bio || "",
        category: category || "",
        availableSlots: availableSlots || [],
      });

      // Save the doctor record
      await newDoctor.save();
    }

    return Response.json({ message: "تم إنشاء المستخدم والدكتور بنجاح", savedUser });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "فشل في إنشاء المستخدم" }, { status: 500 });
  }
}

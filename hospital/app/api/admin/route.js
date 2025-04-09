import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import Doctor from "@/models/doctor";

export async function GET() {
  await connectDB();

  try {
    const users = await User.find();
    return Response.json(users);
  } catch (error) {
    return Response.json({ error: "فشل في جلب المستخدمين" }, { status: 500 });
  }
}

export async function PUT(request) {
  await connectDB();

  const {
    userId,
    newRole,
    specialization,
    price,
    experience,
    bio,
    category,
    availableSlots,
  } = await request.json();

  try {
    // تحديث الدور في جدول المستخدمين
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role: newRole },
      { new: true }
    );

    // إذا أصبح المستخدم دكتورًا، أنشئ له سجل جديد في doctors
    if (newRole === "doctor") {
      const doctorExists = await Doctor.findOne({ userId });

      if (!doctorExists) {
        await Doctor.create({
          userId,
          specialization,
          price,
          experience: experience || 0,
          bio: bio || "",
          category: category || "",
          availableSlots: availableSlots || [],
        });
      }
    }

    return Response.json({ message: "تم التحديث بنجاح", updatedUser });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "فشل التحديث" }, { status: 500 });
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
    role,  // either 'patient' or 'doctor'
    specialization,
    price,
    experience,
    bio,
    category,
    availableSlots,
  } = await request.json();

  try {
    // 1. Create the new user
    const newUser = new User({
      name,
      email,
      password,
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

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

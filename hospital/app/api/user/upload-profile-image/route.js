import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";
import { ObjectId } from "mongodb";
import { connectDB } from "@/lib/mongodb";
import User from "../../../../models/user";

const uploadDir = path.join(process.cwd(), "public/uploads/profile-images");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export async function POST(req) {
  try {
    const formData = await req.formData();

    const file = formData.get("profileImage");
    const userId = req.headers.get("user-id");

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!userId || !ObjectId.isValid(userId)) {
      return NextResponse.json(
        { error: "Invalid or missing user ID" },
        { status: 400 }
      );
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    const ext = file.name.split(".").pop();
    const fileName = `${uuidv4()}.${ext}`;
    const filePath = path.join(uploadDir, fileName);
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    fs.writeFileSync(filePath, fileBuffer);

    const relativePath = `/uploads/profile-images/${fileName}`;

    await connectDB();

    const result = await User.updateOne(
      { _id: userId },
      { $set: { profileImage: relativePath } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updatedUser = await User.findById(userId); // ✅ تم التعديل هنا

    return NextResponse.json({
      success: true,
      filePath: relativePath,
      user: updatedUser,
    });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

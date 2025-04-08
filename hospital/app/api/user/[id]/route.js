// app/api/user/[id]/route.js
import { NextResponse } from "next/server";
// import connectDB from "@/lib/mongodb";
import { connectDB } from "@/lib/mongodb";

import User from "../../../../models/user";

export async function GET(req, { params }) {
  await connectDB();
  const { id } = params;

  try {
    const user = await User.findById(id).select("-password");
    if (!user)
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  await connectDB();
  const { id } = params;
  const data = await req.json();

  try {
    const updatedUser = await User.findByIdAndUpdate(id, data, {
      new: true,
    }).select("-password");
    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

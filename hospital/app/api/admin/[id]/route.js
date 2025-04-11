import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";

export async function DELETE(req, { params }) {
    const { id } = params;
  
    if (!id) {
      return new Response(JSON.stringify({ message: "User ID is required" }), {
        status: 400,
      });
    }
  
    await connectDB();
  
    try {
      const deletedUser = await User.findByIdAndUpdate(
        id,
        { isDeleted: true },
        { new: true }
      );
  
      if (!deletedUser) {
        return new Response(JSON.stringify({ message: "User not found" }), {
          status: 404,
        });
      }
  
      return new Response(JSON.stringify({ message: "User deleted successfully" }), {
        status: 200,
      });
    } catch (error) {
      console.error(error);
      return new Response(JSON.stringify({ message: "Failed to delete user" }), {
        status: 500,
      });
    }
  }

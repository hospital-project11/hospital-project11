"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
  
    try {
      const res = await axios.post("/api/auth/login", form, {
        headers: { "Content-Type": "application/json" },
      });
  
      if (res.status === 200) {
        alert("Successful login! 🎉");
  
        // ✅ Route according to the role, or to home if it is in a known role
        if (res.data.role === "admin") {
          router.push("/admin-dashboard");
        } else if (res.data.role === "doctor") {
          router.push("/doctor-dashboard");
        } else {
          router.push("/");
        }
      } else {
        alert(res.data.message || "Login failed ❌");
        setMessage(res.data.message || "Login failed");
      }
    } catch (err) {
      alert("An error occurred while logging in.");
      setMessage(
        err.response?.data?.message || "Something went wrong"
      );
    }
  };
  

  return (
    <section className="py-10 bg-gray-50">
      <div className="max-w-md mx-auto bg-white shadow-md rounded p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Login
          </button>
        </form>
        {message && (
          <p className="mt-4 text-center text-sm text-red-500">{message}</p>
        )}
      </div>
    </section>
  );
}


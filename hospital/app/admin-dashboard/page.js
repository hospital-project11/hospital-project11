"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("all");

  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState("");
  const [doctorData, setDoctorData] = useState({
    specialization: "",
    price: "",
    experience: "",
    bio: "",
  });

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/admin");
      setUsers(res.data);
    } catch (error) {
      console.error("فشل في جلب المستخدمين", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers =
    filter === "all" ? users : users.filter((user) => user.role === filter);

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setDoctorData({
      specialization: "",
      price: "",
      experience: "",
      bio: "",
    });
  };

  const handleSave = async () => {
    try {
      const payload = {
        userId: selectedUser._id,
        newRole,
      };

      if (newRole === "doctor") {
        payload.specialization = doctorData.specialization;
        payload.price = doctorData.price;
        payload.experience = doctorData.experience;
        payload.bio = doctorData.bio;
      }

      await axios.put("/api/admin", payload);

      // تحديث القائمة
      fetchUsers();
      setSelectedUser(null);
    } catch (error) {
      console.error("فشل في تحديث الدور", error);
    }
  };

  return (
    <div className="p-4 bg-[#F2EFE7] min-h-screen">
      <h1 className="text-2xl font-bold text-[#006A71] mb-4">
        لوحة تحكم المدير
      </h1>

      {/* أزرار الفلترة */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setFilter("all")}
          className="px-4 py-2 rounded bg-[#006A71] text-white"
        >
          الكل
        </button>
        <button
          onClick={() => setFilter("doctor")}
          className="px-4 py-2 rounded bg-[#48A6A7] text-white"
        >
          الأطباء
        </button>
        <button
          onClick={() => setFilter("patient")}
          className="px-4 py-2 rounded bg-[#9ACBD0] text-white"
        >
          المرضى
        </button>
      </div>

      {/* جدول المستخدمين */}
      <div className="overflow-x-auto rounded shadow">
        <table className="w-full bg-white text-sm">
          <thead className="bg-[#006A71] text-white">
            <tr>
              <th className="p-2">الاسم</th>
              <th className="p-2">الإيميل</th>
              <th className="p-2">الهاتف</th>
              <th className="p-2">الدور</th>
              <th className="p-2">إجراء</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id} className="text-center border-b">
                <td className="p-2">{user.name}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">{user.phone || "-"}</td>
                <td className="p-2">{user.role}</td>
                <td className="p-2">
                  <button
                    className="bg-[#006A71] text-white px-3 py-1 rounded"
                    onClick={() => handleEditClick(user)}
                  >
                    تعديل الدور
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal التعديل */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-[#006A71]">
              تعديل دور المستخدم
            </h2>

            <label className="block mb-2 font-medium">الدور الجديد:</label>
            <select
              className="w-full border rounded p-2 mb-4"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
            >
              <option value="patient">مريض</option>
              <option value="doctor">دكتور</option>
              <option value="admin">مدير</option>
            </select>

            {newRole === "doctor" && (
              <>
                <label className="block mb-1 font-medium">التخصص:</label>
                <input
                  type="text"
                  className="w-full border rounded p-2 mb-2"
                  value={doctorData.specialization}
                  onChange={(e) =>
                    setDoctorData({
                      ...doctorData,
                      specialization: e.target.value,
                    })
                  }
                  required
                />

                <label className="block mb-1 font-medium">سعر المعاينة:</label>
                <input
                  type="number"
                  className="w-full border rounded p-2 mb-2"
                  value={doctorData.price}
                  onChange={(e) =>
                    setDoctorData({ ...doctorData, price: e.target.value })
                  }
                  required
                />

                <label className="block mb-1 font-medium">
                  الخبرة (سنوات):
                </label>
                <input
                  type="number"
                  className="w-full border rounded p-2 mb-2"
                  value={doctorData.experience}
                  onChange={(e) =>
                    setDoctorData({ ...doctorData, experience: e.target.value })
                  }
                />

                <label className="block mb-1 font-medium">
                  السيرة الذاتية:
                </label>
                <textarea
                  className="w-full border rounded p-2 mb-2"
                  value={doctorData.bio}
                  onChange={(e) =>
                    setDoctorData({ ...doctorData, bio: e.target.value })
                  }
                />
              </>
            )}

            <div className="flex justify-end mt-4 gap-3">
              <button
                className="px-4 py-2 bg-[#9ACBD0] text-white rounded"
                onClick={() => setSelectedUser(null)}
              >
                إلغاء
              </button>
              <button
                className="px-4 py-2 bg-[#006A71] text-white rounded"
                onClick={handleSave}
              >
                حفظ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

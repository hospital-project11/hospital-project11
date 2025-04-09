"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar"; // استيراد السايد بار

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("all");

  const [selectedUser, setSelectedUser] = useState(null);

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

  const handleDeleteClick = async (userId) => {
    try {
      await axios.delete(`/api/admin/${userId}`);
      fetchUsers(); // تحديث القائمة بعد الحذف
    } catch (error) {
      console.error("فشل في حذف المريض", error);
    }
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
  };

  return (
    <div className="flex">
      <Sidebar /> {/* عرض السايد بار */}
      <div className="p-4 bg-[#F2EFE7] min-h-screen w-full">
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
                    {user.role === "patient" ? (
                      <>
                        <button
                          className="bg-[#006A71] text-white px-3 py-1 rounded"
                          onClick={() => handleViewDetails(user)}
                        >
                          تفاصيل الحالة الصحية
                        </button>
                        <button
                          className="bg-red-500 text-white px-3 py-1 rounded ml-2"
                          onClick={() => handleDeleteClick(user._id)}
                        >
                          حذف
                        </button>
                      </>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* عرض تفاصيل الحالة الصحية للمريض */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4 text-[#006A71]">
                تفاصيل الحالة الصحية - {selectedUser.name}
              </h2>

              {/* إضافة تفاصيل الحالة الصحية هنا */}
              <div>
                <p>
                  <strong>التشخيص:</strong> {selectedUser.healthCondition}
                </p>
                <p>
                  <strong>العلاج:</strong> {selectedUser.treatment}
                </p>
                <p>
                  <strong>الملاحظات:</strong> {selectedUser.notes}
                </p>
              </div>

              <div className="flex justify-end mt-4 gap-3">
                <button
                  className="px-4 py-2 bg-[#9ACBD0] text-white rounded"
                  onClick={() => setSelectedUser(null)}
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

export default function Sidebar() {
  return (
    <div className="bg-[#006A71] text-white w-64 h-full p-6">
      <h2 className="text-2xl font-bold mb-6">لوحة التحكم</h2>
      <ul>
        <li className="mb-4">
          <a href="#" className="hover:bg-[#48A6A7] p-2 rounded block">
            الصفحة الرئيسية
          </a>
        </li>
        <li className="mb-4">
          <a href="#" className="hover:bg-[#48A6A7] p-2 rounded block">
            المستخدمين
          </a>
        </li>
        <li className="mb-4">
          <a href="#" className="hover:bg-[#48A6A7] p-2 rounded block">
            الإعدادات
          </a>
        </li>
      </ul>
    </div>
  );
}

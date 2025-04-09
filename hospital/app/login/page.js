// "use client";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import axios from "axios";

// export default function LoginPage() {
//   const router = useRouter();
//   const [form, setForm] = useState({ email: "", password: "" });
//   const [message, setMessage] = useState("");

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage("");
  
//     try {
//       const res = await axios.post("/api/auth/login", form, {
//         headers: { "Content-Type": "application/json" },
//       });
  
//       if (res.status === 200) {
//         alert("Successful login! 🎉");
  
//         // ✅ Route according to the role, or to home if it is in a known role
//         if (res.data.role === "admin") {
//           router.push("/admin-dashboard");
//         } else if (res.data.role === "doctor") {
//           router.push("/doctor-dashboard");
//         } else {
//           router.push("/");
//         }
//       } else {
//         alert(res.data.message || "Login failed ❌");
//         setMessage(res.data.message || "Login failed");
//       }
//     } catch (err) {
//       alert("An error occurred while logging in.");
//       setMessage(
//         err.response?.data?.message || "Something went wrong"
//       );
//     }
//   };
  

//   return (
//     <section className="py-10 bg-gray-50">
//       <div className="max-w-md mx-auto bg-white shadow-md rounded p-6">
//         <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={form.email}
//             onChange={handleChange}
//             required
//             className="w-full px-4 py-2 border rounded"
//           />
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={form.password}
//             onChange={handleChange}
//             required
//             className="w-full px-4 py-2 border rounded"
//           />
//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
//           >
//             Login
//           </button>
//         </form>
//         {message && (
//           <p className="mt-4 text-center text-sm text-red-500">{message}</p>
//         )}
//       </div>
//     </section>
//   );
// }




// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import axios from "axios";
// import Link from "next/link";

// export default function LoginPage() {
//   const router = useRouter();
//   const [form, setForm] = useState({ email: "", password: "" });
//   const [message, setMessage] = useState("");

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage("");
  
//     try {
//       const res = await axios.post("/api/auth/login", form, {
//         headers: { "Content-Type": "application/json" },
//       });
  
//       if (res.status === 200) {
//         alert("Successful login! 🎉");
  
//         // ✅ Route according to the role, or to home if it is in a known role
//         if (res.data.role === "admin") {
//           router.push("/admin-dashboard");
//         } else if (res.data.role === "doctor") {
//           router.push("/doctor-dashboard");
//         } else {
//           router.push("/");
//         }
//       } else {
//         alert(res.data.message || "Login failed ❌");
//         setMessage(res.data.message || "Login failed");
//       }
//     } catch (err) {
//       alert("An error occurred while logging in.");
//       setMessage(
//         err.response?.data?.message || "Something went wrong"
//       );
//     }
//   };


"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify"; 
import 'react-toastify/dist/ReactToastify.css'; 
import { signIn } from "next-auth/react";


export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const res = await axios.post("http://localhost:3000/api/auth/login", form, {
        headers: { "Content-Type": "application/json" },
      });
  
      if (res.status === 200) {
        toast.success("Successful login! 🎉");
  
        
        setTimeout(() => {
          if (res.data.role === "admin") {
            router.push("/admin-dashboard");
          } else if (res.data.role === "doctor") {
            router.push("/doctor-dashboard");
          } else {
            router.push("/");
          }
        }, 1500); 
      } else {
        toast.error("Login failed ❌");
      }
    } catch (err) {
      toast.error("An error occurred while logging in.");
    }
  };

  

  return (
    <>
    <ToastContainer />
    <section className="py-10 bg-[#006A71] sm:py-16 lg:py-24">
      <div className="max-w-6xl px-4 mx-auto sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:items-stretch md:grid-cols-2 gap-x-12 lg:gap-x-30 gap-y-10">
          <div className="flex flex-col justify-between lg:py-5">
            <div>
              <h2 className="text-3xl font-bold leading-tight text-white sm:text-4xl lg:leading-tight lg:text-5xl">
                Experience Clear Vision & Care with Lumera Eye Clinic!
              </h2>
              <p className="max-w-xl mx-auto mt-4 text-base leading-relaxed text-white">
                At Lumera, we provide comprehensive eye care services, including routine check-ups, advanced treatments, and cutting-edge technology for better vision.
              </p>
              <img
                className="relative z-10 max-w-xs mx-auto -mb-16 md:hidden"
                src="https://cdn.rareblocks.xyz/collection/celebration/images/contact/4/curve-line-mobile.svg"
                alt=""
              />
              <img
                className="hidden w-full translate-x-24 translate-y-8 md:block"
                src="https://cdn.rareblocks.xyz/collection/celebration/images/contact/4/curve-line.svg"
                alt=""
              />
            </div>
            <div className="hidden md:mt-auto md:block">
              <blockquote className="mt-[60px]">
                <p className="text-lg leading-relaxed text-white">
                  Lumera Eye Clinic is your trusted partner for all your eye care needs. Whether you're looking for a routine eye exam, advanced treatments, or laser eye surgery, our team is here to guide you.
                </p>
              </blockquote>
            </div>
          </div>

          <div className="flex items-center justify-center px-4 py-10 bg-white sm:px-6 lg:px-8 sm:py-16 lg:py-24 rounded-[50px]">
            <div className="xl:w-full xl:max-w-sm 2xl:max-w-md xl:mx-auto">
              <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl">
                Welcome back to <span className="text-[#48A6A7] font-bold">Lumera</span>
              </h2>
              <p className="mt-2 text-base text-gray-600">
                Don't have an account?{" "}
                <Link
                  href="/register"
                  className="font-medium text-blue-800 transition-all duration-200 hover:text-blue-700 focus:text-blue-700 hover:underline"
                >
                  Register
                </Link>
              </p>
              <form onSubmit={handleSubmit} className="mt-8">
                <div className="space-y-5">
                  <div>
                    <label htmlFor="email" className="text-base font-medium text-gray-900">
                      Email address
                    </label>
                    <div className="mt-2.5 relative text-gray-400 focus-within:text-gray-600">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg
                          className="w-5 h-5"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                          />
                        </svg>
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        className="block w-full py-4 pl-10 pr-4 text-black placeholder-gray-500 transition-all duration-200 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:border-blue-600 focus:bg-white caret-blue-600"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="password" className="text-base font-medium text-gray-900">
                      Password
                    </label>
                    <div className="mt-2.5 relative text-gray-400 focus-within:text-gray-600">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg
                          className="w-5 h-5"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
                          />
                        </svg>
                      </div>
                      <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        className="block w-full py-4 pl-10 pr-4 text-black placeholder-gray-500 transition-all duration-200 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:border-blue-600 focus:bg-white caret-blue-600"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center w-full px-4 py-4 text-base font-semibold text-white transition-all duration-200 border border-transparent rounded-md bg-black focus:outline-none hover:opacity-80 focus:opacity-80"
                    >
                      Login
                    </button>
                  </div>
                </div>
              </form>
           
              <div className="mt-3 space-y-3">

              <button
  onClick={async () => {
    try {
      await signIn("google", { callbackUrl: "/" });
      toast.success("Signed in with Google successfully! 🎉");
    } catch (err) {
      toast.error("Failed to sign in with Google ❌");
    }
  }}
  type="button"
  className="relative inline-flex items-center justify-center w-full px-4 py-4 text-base font-semibold text-gray-700 transition-all duration-200 bg-white border-2 border-gray-200 rounded-md hover:bg-gray-100 focus:bg-gray-100 hover:text-black focus:text-black focus:outline-none"
>
  <div className="absolute inset-y-0 left-0 p-4">
    <svg
      className="w-6 h-6 text-red-600"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.907 8.907 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z" />
    </svg>
  </div>
  Sign in with Google
</button>

              </div>
              <p className="mt-5 text-sm text-gray-600">
                This site is protected by reCAPTCHA and the Google{" "}
                <a
                  href="https://www.realpage.com/legal/privacy-policy/"
                  title=""
                  className="text-blue-800 transition-all duration-200 hover:underline hover:text-blue-700"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </a>{" "}
                &amp;{" "}
                <a
                  href="https://istd.gov.jo/ebv4.0/root_storage/en/eb_list_page/general_sales_tax_law_and_its_amendments_2023-1.pdf"
                  title=""
                  className="text-blue-800 transition-all duration-200 hover:underline hover:text-blue-700"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Terms of Service
                </a>
              </p>
            </div>
          </div>


        </div>
      </div>
    </section>
    </>
  );
}









   {/* {message && (
                <p className={`mt-4 text-center text-sm ${message.includes("successfully") ? "text-green-500" : "text-red-500"}`}>
                  {message}
                </p>
              )} */}






                        {/* <div className="md:hidden">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className="w-6 h-6 text-yellow-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <blockquote className="mt-6">
              <p className="text-lg leading-relaxed text-white">
                You made it so simple. My new site is so much faster and easier to
                work with than my old site. I just choose the page, make the change
                and click save.
              </p>
            </blockquote>
            <div className="flex items-center mt-8">
              <img
                className="flex-shrink-0 object-cover w-10 h-10 rounded-full"
                src="https://cdn.rareblocks.xyz/collection/celebration/images/contact/4/avatar.jpg"
                alt=""
              />
              <div className="ml-4">
                <p className="text-base font-semibold text-white">Jenny Wilson</p>
                <p className="mt-px text-sm text-gray-400">Product Designer</p>
              </div>
            </div>
          </div> */}
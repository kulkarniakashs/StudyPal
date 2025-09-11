"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "../components/LoadingSpinner";
import { signIn } from "next-auth/react";
export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error , setError] = useState("");
  const [loading, setloading] = useState(false);
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"form" | "otp">("form");
  const router = useRouter();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    // Send OTP
    setloading(true);
    const res = await fetch("/api/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.email }),
    });
    setloading(false);

    if (res.ok) {
      setStep("otp");
    } else {
      alert("Error sending OTP");
    }
  };

  const verifyOtp = async () => {
    setError("")
    setloading(true)
    const res = await fetch("/api/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, otp }),
    });
    const data = await res.json();
    if (data.success) {
      alert("Account created successfully!");
      await signIn("credentials", {
        callbackUrl : '/chat', // prevent default redirect
        email: form.email,
        password: form.password,
      });
    } else {
      console.log(data.error)
      setError(data.error.message);
      setloading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div>
        {step === "form" ? (
          <form
            onSubmit={handleSignup}
            className="bg-white p-8 rounded-2xl shadow-lg w-96 space-y-4"
          >
            <h2 className="text-2xl text-gray-500 font-bold text-center">Sign Up</h2>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              className="w-full text-black px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 placeholder-gray-500"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 text-black py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 placeholder-gray-500"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-2 text-black border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 placeholder-gray-500"
              required
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border text-black rounded-lg focus:outline-none focus:ring focus:ring-blue-300 placeholder-gray-500"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className={`w-full  text-white py-2 rounded-lg  placeholder-gray-500 ${loading ? "bg-blue-300" : "bg-blue-500 hover:bg-blue-700 cursor-pointer"}`}
            >
              Send OTP
            </button>
          </form>
        ) : (
          <>
            {!loading ? <div className="bg-white p-8 rounded-2xl shadow-lg w-96 space-y-4">
              <h2 className="text-2xl font-bold text-gray-800 text-center">Verify OTP</h2>
              {error && <p className="text-red-500 text-center">{error}</p>}
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-2 text-black border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 placeholder-gray-500"
                required
              />
              <button
                onClick={verifyOtp}
                className={`w-full  text-white py-2 rounded-lg  placeholder-gray-500 ${loading ? "bg-green-300" : "bg-green-500 hover:bg-green-700 cursor-pointer"}`}
              >
                Verify & Create Account
              </button>
            </div> : <LoadingSpinner />}
          </>
        )}
      </div>
    </div>
  );
}

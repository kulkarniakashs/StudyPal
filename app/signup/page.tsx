"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
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
    const res = await fetch("/api/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.email }),
    });

    if (res.ok) {
      setStep("otp");
    } else {
      alert("Error sending OTP");
    }
  };

  const verifyOtp = async () => {
    const res = await fetch("/api/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, otp }),
    });

    if (res.ok) {
      alert("Account created successfully!");
      router.push('/chat')
    } else {
      alert("Invalid OTP");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
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
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 placeholder-gray-500"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 placeholder-gray-500"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 placeholder-gray-500"
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 placeholder-gray-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 placeholder-gray-500"
          >
            Send OTP
          </button>
        </form>
      ) : (
        <div className="bg-white p-8 rounded-2xl shadow-lg w-96 space-y-4">
          <h2 className="text-2xl font-bold text-center">Verify OTP</h2>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 placeholder-gray-500"
            required
          />
          <button
            onClick={verifyOtp}
            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
          >
            Verify & Create Account
          </button>
        </div>
      )}
    </div>
  );
}

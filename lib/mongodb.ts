// lib/mongodb.js
import mongoose from "mongoose";

const MONGODB = process.env.MONGODB;

if (!MONGODB) {
  throw new Error("⚠️ Please add your MongoDB URI to .env.local");
}

// Global is used here to maintain a single connection instance across hot reloads in dev
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB || "", {
      bufferCommands: false, // disable mongoose buffering
    }).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

import mongoose, { Schema, model, models } from "mongoose";
import { role } from "../types";
import { Boldonse } from "next/font/google";

const MessageSchema = new Schema({
  role: {
    type: String,
    enum: Object.values(role), // only allows "user" or "bot"
    required: true,
  },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export const ChatSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  messages: [MessageSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  title: { type: String },
  share : {type : Boolean , default : false}
});

const Chat = models.Chat || model("Chat", ChatSchema);
export default Chat;


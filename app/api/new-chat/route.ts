import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { GoogleGenAI } from "@google/genai";
import ChatModel from "@/lib/models/Chat";
import { role, Chat } from "@/lib/types";
import { connectDB } from "@/lib/mongodb";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API });

export async function POST(req: Request) {
    await connectDB();
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: { message: "Invalid Credentials" } }, { status: 400 });
    const { question } = await req.json();
    if (!question) return NextResponse.json({ error: { message: "Invalid Request Question is missing" } }, { status: 400 });

    let new_chat = new ChatModel({
        user: session?.user.id,
        updatedAt: Date.now(),
        title: question,
        messages: [
        ]
    })

    try {
        let chat_created = await new_chat.save();
        let response_chat : Chat = {
            id : chat_created._id,
            createdAt : chat_created.createdAt,
            updatedAt : chat_created.updatedAt,
            messages : chat_created.messages,
            title : chat_created.title
        }
        return NextResponse.json({
            chat : response_chat
        },{status: 200});
    } catch (error) {
        return NextResponse.json({
        error: {
            message: "Couldn't create a chat"
        }
    }, {
        status: 500
    });
    }
}
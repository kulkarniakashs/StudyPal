import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import Chat from "@/lib/models/Chat";
import { connectDB } from "@/lib/mongodb";
import { chatDetails } from "@/lib/types";
export async function GET(req: Request) {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json(
            {error : {
                message : "Invalid Credentials"
            }},
            {status : 401}
        )
    }
    let chatList = await Chat.find({user : session.user.id}).select("title updatedAt _id")
    
    chatList = chatList.map((chatDetail => {
        return {
            id : chatDetail._id,
            title : chatDetail.title,
            updatedAt : chatDetail.updatedAt
        } as chatDetails
    }))
    let chatarray = Object.values(chatList)
    chatarray.sort((a, b)=>b.updatedAt.getTime() - a.updatedAt.getTime());
    return new NextResponse(JSON.stringify({
        chatList : chatarray
    }), {
        headers: {
            "Content-Type": "application/json"
        },
        status: 200
    })
}
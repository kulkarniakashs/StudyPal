import { getServerSession } from "next-auth";
import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import ChatModel from "@/lib/models/Chat";
import { Chat } from "@/lib/types";

export async function POST(req: Request) {
    let data = await req.json();
    console.log("reverse",data);
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json(
            {
                error: {
                    message: "Invalid Credentials"
                }
            },
            { status: 401 }
        )
    }
    let chatDetailsArray = await ChatModel.find({ _id: data.id }).select("_id title updatedAt createdAt messages");
    if (chatDetailsArray[0]) {
        let chatDetail : Chat = {
            id : chatDetailsArray[0]._id.toString(),
            createdAt : chatDetailsArray[0].createdAt,
            updatedAt : chatDetailsArray[0].updatedAt,
            messages : chatDetailsArray[0].messages,
            title : chatDetailsArray[0].title
        }
        // console.log(chatDetail);
        return NextResponse.json({ chatDetail }, { status: 200 })
    }
    return NextResponse.json(
            {
                error: {
                    message: "Something went wrong"
                }
            },
            { status: 500 }
    )  
}
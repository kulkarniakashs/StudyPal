"use server"
import { connectDB } from "./mongodb"
import ChatModel from "./models/Chat";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
export enum action  {
    "delete",
    "share"
}

export async function dropdownmenu(act: action, chatid : string){
    const session = await getServerSession(authOptions);
    await connectDB();
    try {
        switch (act) {
            case action.delete:
                await ChatModel.deleteOne({_id : chatid, user : session?.user.id});
                return true;
            case action.share:
                await ChatModel.updateOne({_id : chatid, user : session?.user.id},{$set : {share : true}});
                return true;
            default:
                break;
        }
    }catch(e){
        console.log("error in action",e);
        return false;
    }
};

export async function rename(id : string, newtitle : string){
    await connectDB();
    const session = await getServerSession(authOptions);
    try {
        await ChatModel.updateOne({_id : id, user : session?.user.id},{"$set" : {title : newtitle}});
        return true;
    } catch (e) {
        return false;
    }
}

export async function copychat(id : string){
    await connectDB();
    const session = await getServerSession(authOptions);
    try {
        let data = await ChatModel.findById(id);
        if(data.share == false) return false;
        if(!session?.user.id) return false
        let res = await ChatModel.create({
            user : session?.user.id,
            messages : data.messages,
            title : data.title
        })
        return res._id.toString();
    }catch(e){
        console.log(e);
        return "";
    }
}
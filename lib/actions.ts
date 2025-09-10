"use server"
import { connectDB } from "./mongodb"
import ChatModel from "./models/Chat";
import { title } from "process";
import { tree } from "next/dist/build/templates/app-page";

export enum action  {
    "delete",
    "share"
}

export async function dropdownmenu(act: action, chatid : string){
    await connectDB();
    try {
        switch (act) {
            case action.delete:
                await ChatModel.deleteOne({_id : chatid});
                return true;
            case action.share:
                await ChatModel.updateOne({_id : chatid},{$set : {share : true}});
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
    try {
        await ChatModel.updateOne({_id : id},{"$set" : {title : newtitle}});
        return true;
    } catch (e) {
        return false;
    }
}
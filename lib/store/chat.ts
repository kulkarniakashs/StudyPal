import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Chat, chatMessageList, details, message, role } from "../types";

const chatSlice = createSlice({
    name : 'chat',
    initialState : {
        chatMessageList : {} as chatMessageList,
        detail: {
            
        } as details,
        error : '' 
    },
    reducers: {
        addChat : (state, action : PayloadAction<Chat>)=>{
           state.chatMessageList[action.payload.id] = action.payload.messages;
           state.detail[action.payload.id] = {createdAt : action.payload.createdAt, updatedAt : action.payload.updatedAt, title : action.payload.title}
        },
        addMessage : (state, action : PayloadAction<{groupid : string, message : message}>)=>{
          state.chatMessageList[action.payload.groupid] =  state.chatMessageList[action.payload.groupid].concat([action.payload.message]);
        },
        streamMessage : (state, action : PayloadAction<{groupid : string , message : string}>)=>{
            let n = state.chatMessageList[action.payload.groupid].length;
            if(n == 0) return;
            console.log("in store",state.chatMessageList[action.payload.groupid][n -1].role, role.bot)
            if(state.chatMessageList[action.payload.groupid][n -1].role == role.user){
                state.chatMessageList[action.payload.groupid].push({
                    content : action.payload.message,
                    role : role.bot,
                } as message)
            }
            else {
                state.chatMessageList[action.payload.groupid][n -1].content += action.payload.message;
            }
        },
        deleteChat : (state, action : PayloadAction<{chatid : string}>)=>{
            delete state.chatMessageList[action.payload.chatid];
            delete state.detail[action.payload.chatid];
        },
        renameChat : (state, action : PayloadAction<{chatid : string, newtitle : string}>)=>{
            state.detail[action.payload.chatid].title = action.payload.newtitle;
        }
    },
})

export const {addChat, addMessage, streamMessage, deleteChat, renameChat} = chatSlice.actions;
export default chatSlice.reducer;
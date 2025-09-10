// chatSlice.js
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { chatDetails, chatList, ChatListState } from "../types"
import { action } from "../actions";

const chatListSlice = createSlice({
  name: "chatList",
  initialState: {
    chats: [],
    loading: false,
    error: undefined ,
  } as ChatListState,
  reducers: {
    addChatEntry: (state, action : PayloadAction<chatDetails>) => {
       state.chats = [{id: action.payload.id, title : action.payload.title, updatedAt : action.payload.updatedAt},...state.chats]
      //  state.chats.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    },  
    fetchChatList : (state, action : PayloadAction<chatList>)=>{
      state.chats = action.payload;
    },
    filterChat : (state, action : PayloadAction<{chatid : string}>)=>{
      state.chats = state.chats.filter((chat)=>{
        return chat.id !== action.payload.chatid;
      })
    },
    renameChatinList : (state,action: PayloadAction<{chatid : string,newtitle : string}>)=>{
      const c = state.chats.find(ch => ch.id === action.payload.chatid);
      if(c){
        c.title = action.payload.newtitle;
      }
    }
  },
  
});

export const {fetchChatList, addChatEntry, filterChat, renameChatinList} = chatListSlice.actions
export default chatListSlice.reducer;

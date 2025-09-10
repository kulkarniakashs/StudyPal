import { configureStore } from "@reduxjs/toolkit";
import chatListReducer from "@/lib/store/chatList"
import Chat from './chat'
const store = configureStore<{
  chatList : ReturnType<typeof chatListReducer>,
  Chat : ReturnType<typeof Chat>
}>({
  reducer: {
    chatList : chatListReducer,
    Chat : Chat,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiPlus, FiSearch, FiMessageSquare } from "react-icons/fi";
import UserProfile from "./UserProfile";
import type {AppDispatch, RootState} from "@/lib/store/store"
import { useRouter } from "next/navigation";
import axios from "axios";
import { fetchChatList } from "@/lib/store/chatList";

export default function Sidebar() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const dispatch = useDispatch<AppDispatch>()
  const chats = useSelector((state : RootState)=> state.chatList.chats)

  const filteredChats = chats.filter(chat =>
    chat.title.toLowerCase().includes(search.toLowerCase())
  );
  const handleNewChat = () => {
    router.push('/chat')
  };

  const fetchChatListsFromApi = async () => {
    let res = await axios.get("/api/get-chat-list");
    // console.log(res)
    dispatch(fetchChatList(res.data.chatList));
  }

  useEffect(() => {
      fetchChatListsFromApi();
  }, [])

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col p-4">
      {/* New Chat Button */}
      <button
        onClick={handleNewChat}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg mb-4 transition"
      >
        <FiPlus size={20} /> New Chat
      </button>

      {/* Search Input */}
      <div className="relative mb-4">
        <FiSearch className="absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search chats..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-3 py-2 rounded-lg bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length > 0 ? (
          filteredChats.map((chat) => (
            <div
              key={chat.id}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-nowrap hover:bg-gray-800 cursor-pointer"
              onClick={() => { 
                router.push(`/chat/${chat.id}`
                ) }}
            >
              <FiMessageSquare size={18} />
              <span className="overflow-clip max-w-[85%]">{chat.title}</span>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-sm">No chats found</p>
        )}
      </div>
      <UserProfile />
    </div>
  );
}

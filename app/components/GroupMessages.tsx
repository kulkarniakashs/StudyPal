"use client"
import { message, role } from "@/lib/types";
import MarkdownViewer from "./ParseMarkdown";
import { useRef, useEffect, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import { useParams } from "next/navigation";
import axios from "axios";
import { addChat } from "@/lib/store/chat";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { memo } from "react";

const GroupMessages = memo(function GroupMessages() {
  const dispatch = useDispatch();
  const params = useParams();
  let id = 0;
  const ref = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState<message[]>([])
  const data = useSelector((state : RootState)=>state.Chat.chatMessageList)
  const [chatId,setchatId] = useState("");
  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);
  
  useEffect(()=>{
    if(params.chatid){
      let id = Array.isArray(params.chatid) ? params.chatid[0] : params.chatid;
      setchatId(id);
    }
  },[params])

  useEffect(()=>{
    if(chatId != ""){
      if(Array.isArray(data[chatId])){
        setMessages(data[chatId]);
      }
      else{
        let res = axios.post('/api/chat-details', {id : chatId});
        res.then((res)=>{
          dispatch(addChat(res.data.chatDetail));
        })
      }
    }
  },[data,chatId])

  return (
    <>
    {params.chatid && <div className="flex-1 overflow-y-auto p-4 flex flex-col h-full space-y-2 w-full">
      {messages.length === 0 ? (
        // <p className="text-gray-400 text-center mt-10">No messages yet</p>
        <LoadingSpinner />
      ) : (
        messages.map((msg, index) => (
          <div
            ref={index == messages.length - 1 ? ref : null}
            key={(id++).toString()}
            className={`p-3 rounded-lg  break-words  ${role.user != msg.role
                ? "text-white self-start max-w-[80%]"
                : "bg-gray-600 text-white self-end max-w-[50%]"
              }`}
          >
            {/* <p>{msg.content}</p> */}
            {role.bot != msg.role ? <div>{msg.content}</div> : <MarkdownViewer markdownText={msg.content} />}
            {/* <span className="text-gray-300 text-xs">{msg.timestamp.toString()}</span> */}
          </div>
        ))
      )}
    </div>}
    </>
  );
})

export default GroupMessages;

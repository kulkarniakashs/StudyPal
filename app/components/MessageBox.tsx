"use client";
import { useState, useRef, useEffect } from "react";
import { FiSend } from "react-icons/fi";
import { useParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { memo } from "react";
import { addChat, addMessage, streamMessage } from "@/lib/store/chat";
import { Chat, chatDetails, role } from "@/lib/types";
import { addChatEntry } from "@/lib/store/chatList";
import { useRouter } from "next/navigation";

const MessageBox = memo(function MessageBox() {
  const [Loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dispatch = useDispatch();
  const param = useParams();
  const router = useRouter();
  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // reset height
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        150 // max height in px
      )}px`;
    }
  }, [message]);

  // useEffect(() => {
  //   console.log("message box rerendred");
  // })

  const ask_question = async (question: string, chatid: string) => {
    const res = await fetch("/api/question", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: question, chatid: chatid }),
    });
    if (!res.body) return;
    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    let done = false;
    
    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      if (value) {
        const chunk = decoder.decode(value);
        const message = chunk.replace(/^data: /, "").trim();
        console.log(message);
        dispatch(streamMessage({ groupid: chatid, message: message}));
      }
    }
  }

  const handleSend = async () => {
    if (param.chatid) {
      const chatid = Array.isArray(param.chatid) ? param.chatid[0] : param.chatid;
      setLoading(true);
      dispatch(addMessage({groupid : chatid, message : {content : message , role : role.user}}));
      setMessage("");
      await ask_question(message, chatid);
      setLoading(false);
    }
    else {
      setLoading(true);
      let res = await fetch('/api/new-chat', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: message })
      });
      const data = await res.json();
      let chatDetail = data.chat as Chat;
      chatDetail.messages = [{role : role.user, content : message}]
      dispatch(addChat(chatDetail));
      dispatch(addChatEntry(chatDetail as chatDetails))
      router.replace(`/chat/${chatDetail.id}`);
      setMessage("")
      console.log("after rerendering");
      await ask_question(message, chatDetail.id);
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (Loading == false) handleSend();
    }
  };

  return (
    <div className={`w-full items-center flex justify-center ${param.chatid ? "": "h-full"}`}>
      <div className="w-full max-w-2xl p-4">
        <div className="bg-gray-800 rounded-2xl p-3 flex items-end">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={Loading == false ? "Type a message..." : "Loading"}
            className="flex-1 resize-none overflow-y-auto max-h-40 bg-transparent outline-none text-white p-2 text-sm"
          />
          {Loading == false && <button
            disabled={Loading}
            onClick={handleSend}
            className="ml-2 p-2 rounded-full bg-blue-600 hover:bg-blue-700 transition"
          >
            <FiSend size={18} className="text-white" />
          </button>}
        </div>
      </div>
    </div>
  );
})
export default MessageBox;
"use client";
import { useState, useRef, useEffect } from "react";
import { FiSend } from "react-icons/fi";
import { useParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { memo } from "react";
import { addChat, addMessage, renameChat, streamMessage } from "@/lib/store/chat";
import { Chat, chatDetails, message, request, request_type, response, response_type, role } from "@/lib/types";
import { addChatEntry, renameChatinList } from "@/lib/store/chatList";
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

  const ask_question = async (request: request) => {
    console.log("request, ", request)
    const res = await fetch("/api/question", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });
    if (!res.body) return;
    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    let done = false;
    let chatid = "";
    if (request.request_type == request_type.question) chatid = request.chatid;
    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      if (value) {
        const chunk = decoder.decode(value);
        const ans_obj: response = JSON.parse(chunk);
        console.log(ans_obj);
        if (ans_obj.response_type == response_type.chat_id) {
          chatid = ans_obj.chat_id;
          let m : message[] = [{content : request.question , role : role.user}];
          dispatch(addChat({createdAt : (new Date()).toISOString(), id : chatid , title : "New Chat", messages : m, updatedAt : new Date().toISOString()}));
          dispatch(addChatEntry({id : chatid , title : "New Chat", updatedAt : (new Date()).toISOString()}));
          router.replace(`/chat/${chatid}`);
        }
        else if (ans_obj.response_type === response_type.content) { dispatch(streamMessage({ groupid: chatid, message: ans_obj.content })); }
        else if (ans_obj.response_type === response_type.chat_title) {
          dispatch(renameChatinList({ chatid, newtitle: ans_obj.chat_title }));
          dispatch(renameChat({ chatid, newtitle: ans_obj.chat_title }));
        }
      }
    }
  }

  const handleSend = async () => {
    setLoading(true);
    if (param.chatid) {
      const chatid = Array.isArray(param.chatid) ? param.chatid[0] : param.chatid;
      dispatch(addMessage({ groupid: chatid, message: { content: message, role: role.user } }));
      setMessage("");
      await ask_question({request_type : request_type.question,question : message, chatid : chatid });
    }
    else {
      setMessage("");
      await ask_question({request_type : request_type.new_chat, question : message});
    }
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (Loading == false) handleSend();
    }
  };

  return (
    <div className={`w-full items-center flex justify-center ${param.chatid ? "" : "h-full"}`}>
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
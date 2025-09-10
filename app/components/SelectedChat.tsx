'use client';
import { useEffect, useState } from "react";

interface Message {
  sender: "user" | "bot";
  content: string;
  timestamp: string;
}

interface Props {
  chatId: string | null;
}

export default function SelectedChat({ chatId }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (!chatId) return;
    fetch(`/api/chats/${chatId}`)
      .then((res) => res.json())
      .then((data) => setMessages(data.messages));
  }, [chatId]);

  if (!chatId) return <div className="p-4">Select a chat to view messages</div>;

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      {messages.map((msg, i) => (
        <div
          key={i}
          className={`my-2 p-2 rounded ${
            msg.sender === "user" ? "bg-blue-100 self-end" : "bg-gray-200 self-start"
          }`}
        >
          <p>{msg.content}</p>
          <span className="text-xs text-gray-500">
            {new Date(msg.timestamp).toLocaleTimeString()}
          </span>
        </div>
      ))}
    </div>
  );
}

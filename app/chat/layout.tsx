"use client"
import Sidebar from "@/app/components/ClassList";
import { useEffect } from "react";
import { ChatInterface } from "../components/ChatInterface";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    useEffect(()=>{
        console.log("sidebar layout")
    })
  return (
    <div className="flex flex-row">
        <Sidebar/>
        {/* {children} */}
        <ChatInterface/>
    </div>
  );
}
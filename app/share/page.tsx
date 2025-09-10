"use client"
import { useEffect, useState } from "react";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({apiKey : "AIzaSyBg8lH6qoT1UpboPY-Qh5wVLmCT3EQBfwk"});
export default function Home() {
    const [fullText, setFulltext] = useState("");
    async function main() {
        const response = await ai.models.generateContentStream({
            model: "gemini-2.5-flash",
            contents: "Explain how AI works (give response in from marked format)",
        });
    
        for await (const chunk of response) {
            if(fullText + chunk.text != fullText) setFulltext(e=>fullText + chunk.text) ;// Incrementally accumulate the text
            console.log(fullText); // Can update frontend UI here
        }
    }   
    useEffect(()=>{main()},[])
    return (
        <div>
            {/* {fullText && <RichMessageRenderer content={fullText ? fullText : "{}"} />} */}
        </div>
    )
}
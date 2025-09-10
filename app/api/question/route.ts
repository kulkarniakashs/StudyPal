// app/api/gemini/stream/route.js (Next.js app directory)
import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import ChatModel from "@/lib/models/Chat";
import { message, role } from "@/lib/types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API });
export async function POST(req: Request) {
    const { question, chatid } = await req.json();
    if (!question || !chatid) return NextResponse.json({ error: { message: "not sufficint data" } }, { status: 400 })
    let response = "";
    let messagess = await ChatModel.find({ _id: chatid }).select("messages").lean();
    let messages = messagess[0].messages;
    messages.reverse();
    let history: { role: string, parts: { text: string }[] }[] = []
    console.log("m" ,messages[0])
    if (messages.length > 0) {
        for (let i = 0; i <= messages.length -1 ; i++) {
            history.push({
                role: `${role.bot == messages[i].role ? "model" : "user"}`,
                parts: [{
                    text: messages[i].content
                }]
            })
        }
    }
    const stream = new ReadableStream({
        async start(controller) {
            const chat = await ai.chats.create({
                model: "gemini-2.5-flash",
                history: history.reverse(),
                config: {
                    systemInstruction: `You are an expert assistant specialized in providing clear, structured answers in Markdown format. For every user question, respond only in Markdown. Use appropriate formatting such as:

- Headings (#, ##, ###)
- Bullet or numbered lists
- Bold and italic text for emphasis
- Code blocks for examples
- Tables where applicable
- Links if needed

Do not include any explanatory text outside of Markdown. The output must be ready to render as Markdown.`
                }
            });

            const responseStream = chat.sendMessageStream({
                message: question
            })

            try {
                for await (const chunk of await responseStream) {
                    const textChunk = chunk.text;
                    response = response + chunk.text;
                    controller.enqueue(new TextEncoder().encode(`data: ${textChunk}\n\n`));
                }
                await ChatModel.updateOne({ _id: chatid }, { "$push": { messages: [{ content: question, role: role.user }, { content: response, role: role.bot }] }, updatedAt: (new Date).toISOString() }, { upsert: true })
            } catch (err) {
                console.error("Stream error:", err);
            }

            controller.close();
        },
    });

    return new NextResponse(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
        },
    });
}

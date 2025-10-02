// app/api/gemini/stream/route.js (Next.js app directory)
import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import ChatModel from "@/lib/models/Chat";
import { ObjectId } from "mongodb";
import { role, request, response, request_type, response_type } from "@/lib/types";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API });
export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    const que_obj = await req.json() as request;
    let response = "";
    let history: { role: string, parts: { text: string }[] }[] = []
    let chat_id = "";
    if (que_obj.request_type == request_type.question) {
        if (!que_obj.question || !que_obj.chatid) return NextResponse.json({ error: { message: "not sufficint data" } }, { status: 400 })
        chat_id = que_obj.chatid;
        let messagess = await ChatModel.find({ _id: que_obj.chatid }).select("messages").lean();
        let messages = messagess[0].messages;
        messages.reverse();
        console.log("m", messages[0])
        if (messages.length > 0) {
            for (let i = 0; i <= messages.length - 1; i++) {
                history.push({
                    role: `${role.bot == messages[i].role ? "model" : "user"}`,
                    parts: [{
                        text: messages[i].content
                    }]
                })
            }
        }
    } else {
        const _id = new ObjectId()
        chat_id = _id.toHexString();
    }
    const stream = new ReadableStream({
        async start(controller) {
            if (que_obj.request_type == request_type.new_chat) {
                controller.enqueue(new TextEncoder().encode(JSON.stringify({ response_type: response_type.chat_id, chat_id: chat_id } as response) + '\n'))
            }
            const ask_question = new Promise<void>(async (resolve, reject) => {
                const chat = ai.chats.create({
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
                    message: que_obj.question
                })

                try {
                    for await (const chunk of await responseStream) {
                        const textChunk = chunk.text;
                        response = response + chunk.text;
                        // console.log(textChunk);
                        controller.enqueue(new TextEncoder().encode(JSON.stringify({ response_type: response_type.content, content: textChunk } as response) + '\n'));
                    }
                } catch (err) {
                    console.error("Stream error:", err);
                }
                await ChatModel.updateOne({ _id: chat_id }, { "$push": { messages: [{ content: que_obj.question, role: role.user }, { content: response, role: role.bot }] }, updatedAt: (new Date).toISOString() }, { upsert: true })
                resolve();
            })

            const generate_title = new Promise<void>(async (resolve, reject) => {
                if (que_obj.request_type == request_type.question) resolve();

                const response = await ai.models.generateContent({
                    model: "gemini-2.5-flash",
                    contents: `Generate a concise chat title (4–5 words only) that summarizes the following question:

Question: ${que_obj.question}

Rules:
- Keep it short (max 5 words).
- Use clear, descriptive wording.
- Do not include punctuation or extra text.
- Avoid generic words like "chat" or "question".
- Only output the title, nothing else.`,
                });
                let title: string | undefined = response.candidates?.[0]?.content?.parts?.[0]?.text;
                if (title) {
                    console.log(title);
                    controller.enqueue(new TextEncoder().encode(JSON.stringify({ response_type: response_type.chat_title, chat_title: title } as response)));
                    let ch = new ChatModel({
                        _id : chat_id,
                        user: session?.user.id || "",
                        updatedAt: Date.now(),
                        title: title,
                        messages: [
                        ]
                    })
                    try {
                        await ch.save();
                    }catch(e){
                        console.log(e);
                    }
                }
                resolve();
            })

            await Promise.all([generate_title, ask_question]);
            await ChatModel.updateOne({ _id: chat_id }, { "$push": { messages: [{ content: que_obj.question, role: role.user }, { content: response, role: role.bot }] }, updatedAt: (new Date).toISOString() }, { upsert: true })
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

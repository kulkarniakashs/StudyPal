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
    if (!session) return;
    const que_obj = await req.json() as request;
    console.log(que_obj);
    let response = "";
    let title: string | undefined
    let history: { role: string, parts: { text: string }[] }[] = []
    let chat_id = "";
    if (que_obj.request_type == request_type.question) {
        if (!que_obj.question || !que_obj.chatid) return NextResponse.json({ error: { message: "not sufficint data" } }, { status: 400 })
        chat_id = que_obj.chatid;
        let messagess = await ChatModel.find({ _id: que_obj.chatid }).select("messages").lean();
        let messages = messagess[0].messages;
        console.log("msg", messages);
        messages.reverse();
        // console.log("m", messages[0])
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
            const safeEnqueue = (chunk: string) => {
                try {
                    controller.enqueue(new TextEncoder().encode(chunk + "\n"));
                } catch (e) {
                    console.warn("Controller already closed, skipping enqueue");
                }
            };

            if (que_obj.request_type == request_type.new_chat) {
                safeEnqueue(JSON.stringify({ response_type: response_type.chat_id, chat_id: chat_id } as response))
            }
            // console.log(history);
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
                        safeEnqueue(JSON.stringify({ response_type: response_type.content, content: textChunk } as response))
                    }
                } catch (err) {
                    console.error("Stream error:", err);
                }
                resolve();
            })


            if (que_obj.request_type == request_type.new_chat) {
                            const generate_title = new Promise<void>(async (resolve, reject) => {
                const response = await ai.models.generateContent({
                    model: "gemini-2.5-flash",
                    contents: `Generate a concise chat title (4 to 5 words only) that summarizes the following question:

Question: ${que_obj.question}

Rules:
- Keep it short (max 5 words).
- Use clear, descriptive wording.
- Do not include punctuation or extra text.
- Avoid generic words like "chat" or "question".
- Only output the title, nothing else.`,
                });
                title = response.candidates?.[0]?.content?.parts?.[0]?.text;
                if (title) {
                    console.log(title);
                    safeEnqueue(JSON.stringify({ response_type: response_type.chat_title, chat_title: title } as response) + '\n')
                }
                resolve();
            })
                console.log("new Chat")
                await Promise.all([generate_title, ask_question]);
            }
            else await ask_question
            try {
                if (request_type.new_chat == que_obj.request_type) {
                    let ch = new ChatModel({
                        _id: chat_id,
                        user: session?.user.id || "",
                        updatedAt: Date.now(),
                        title: title,
                        messages: [{ content: que_obj.question, role: role.user }, { content: response, role: role.bot }]
                    })
                    await ch.save();
                }
                else {
                    await ChatModel.updateOne({ _id: chat_id }, { "$push": { messages: [{ content: que_obj.question, role: role.user }, { content: response, role: role.bot }] }, updatedAt: (new Date).toISOString() }, { upsert: true })
                }
            } catch (e) {
                console.log(e);
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

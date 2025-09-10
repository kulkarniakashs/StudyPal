import { connectDB } from "@/lib/mongodb";
import ChatModel from "@/lib/models/Chat";
import { message, role } from "@/lib/types";
import MarkdownViewer from "@/app/components/ParseMarkdown";
import LoadingSpinner from "@/app/components/LoadingSpinner";

export default async function Page({ params }: { params: { id: string } }) {
    await connectDB();
    let chatid = params.id;
    const data = await ChatModel.findById(chatid);
    return (
        <div>
            <GroupTitle title={data.title} updatedAt={data.updatedAt} />
            <GroupMessages messages={data.messages} />
        </div>
    )
}

function GroupTitle({ title, updatedAt }: { title: string, updatedAt: string }) {
    return (<>
        <div className="bg-gray-800 p-7 border-b border-black w-full">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-white text-2xl font-bold">{title}</h1>
                    <p className="text-gray-400 text-sm">Last update: {(new Date(updatedAt)).toLocaleString()}</p>
                </div>
            </div>
        </div>
    </>
    );
}

function GroupMessages({ messages }: { messages: message[] }) {
    let id = 0;
    return (
        <>
            <div className="flex-1 overflow-y-auto p-4 flex flex-col h-full space-y-2 w-full">
                {messages.length === 0 ? (
                    // <p className="text-gray-400 text-center mt-10">No messages yet</p>
                    <LoadingSpinner />
                ) : (
                    messages.map((msg, index) => (
                        <div
                            key={(id++).toString()}
                            className={`p-3 rounded-lg  break-words  ${role.user != msg.role
                                ? "text-white self-start max-w-[80%]"
                                : "bg-gray-600 text-white self-end max-w-[50%]"
                                }`}
                        >
                            {role.bot != msg.role ? <div>{msg.content}</div> : <MarkdownViewer markdownText={msg.content} />}
                        </div>
                    ))
                )}
            </div>
        </>
    );
}
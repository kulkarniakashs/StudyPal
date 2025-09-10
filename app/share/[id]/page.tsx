import { connectDB } from "@/lib/mongodb";
import ChatModel from "@/lib/models/Chat";
import { message, role } from "@/lib/types";
import MarkdownViewer from "@/app/components/ParseMarkdown";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import ContinueButton from "@/app/components/ContinueButton";

export default async function Page({ params }: { params: { id: string } }) {
    await connectDB();
    let { id } =  await params;
    console.log(id);
    let data: any = await ChatModel.findById(id).lean();
    return (
        <div className="h-screen">
            {data && data.share ? (
                <div className="flex flex-col h-full">
                    <GroupTitle title={data.title} updatedAt={data.updatedAt.toString()} />
                    <div className="flex-1 overflow-auto"><GroupMessages messages={data.messages} /></div>
                    <ContinueButton chatid={id}/>
                </div>
            ) : (<div className="w-full h-full flex justify-center items-center"><h1>Page Not Found</h1></div>)}
        </div>
    )
}

function GroupTitle({ title, updatedAt }: { title: string, updatedAt: string }) {
    return (
        <div className="bg-gray-800 p-7 border-b border-black w-full">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-white text-2xl font-bold">{title}</h1>
                    <p className="text-gray-400 text-sm">Last update: {(new Date(updatedAt)).toLocaleString()}</p>
                </div>
            </div>
        </div>
    );
}

function GroupMessages({ messages }: { messages: message[] }) {
    let id = 0;
    return (
            <div className="p-4 flex-1 flex flex-col space-y-2">
                {messages.length === 0 ? (
                    // <p className="text-gray-400 text-center mt-10">No7 messages yet</p>
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
    );
}
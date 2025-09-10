import GroupTitle from "./GroupTitle";
import GroupMessages from "./GroupMessages";
import MessageBox from "./MessageBox";
export function ChatInterface() {
    return (
        <div className={`w-full h-screen flex flex-col justify-between`}>
            <GroupTitle  />
            <GroupMessages/>
            <MessageBox/>
        </div>
    )
}
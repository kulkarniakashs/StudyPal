import { useSelector } from "react-redux";
import LoadingSpinner from "./LoadingSpinner";
import { memo, useEffect, useState, useRef } from "react";
import { RootState } from "@/lib/store/store";
import { useParams } from "next/navigation";
import DropdownMenu from "./DropDownMenu";
import { CiEdit } from "react-icons/ci";
import { FaCheckCircle } from "react-icons/fa";
import { rename } from "@/lib/actions";
import  {useDispatch } from "react-redux";
import { renameChatinList } from "@/lib/store/chatList";
import { renameChat } from "@/lib/store/chat";
export default memo(function GroupTitle() {
    const data1 = useSelector((state: RootState) => state.Chat.detail);
    const params = useParams()
    const [data, setdata] = useState<{ title: string, updatedAt: string }>();
    const [update, setUpdate] = useState(false);
    const ref = useRef<HTMLInputElement>(null)
    const dispatch = useDispatch();
    useEffect(() => {
        if (params.chatid && data1) {
            let id = Array.isArray(params.chatid) ? params.chatid[0] : params.chatid;
            if (data1[id]) setdata({ title: data1[id].title, updatedAt: data1[id].updatedAt });
        }
        console.log
    }, [params, data1])
    return (<>
        {params.chatid && <div className="bg-gray-800 p-7 border-b border-black w-full">
            {(data) ?
                <div className="flex justify-between items-center">
                    <div>
                        <div className="flex gap-2 items-center">
                            {update ? <input
                                type="text"
                                value={data.title}
                                ref={ref}
                                onChange={(e) => {
                                    setdata({title : e.target.value, updatedAt : data.updatedAt});
                                }}
                                className="text-2xl w-fit flex items-center"
                            /> :
                                <h1 className="text-white text-2xl font-bold">{data.title}</h1>
                            }
                            <div onClick={() => {
                                if(!update){
                                    if(ref)ref.current?.focus();
                                }
                                else{
                                    let chatid = Array.isArray(params.chatid) ? params.chatid[0] : params.chatid; 
                                    if(chatid){
                                        dispatch(renameChatinList({chatid : chatid, newtitle : data.title}));
                                        dispatch(renameChat({chatid : chatid, newtitle : data.title}));
                                        rename(chatid, data.title).then(res =>{
                                            if(!res) alert("couldn't rename");
                                        })
                                    }
                                }
                                setUpdate(!update);
                            }}>
                                {update ? <FaCheckCircle  size={30}/> : <CiEdit size={30}/>}
                            </div>
                        </div>
                        <p className="text-gray-400 text-sm">Last update: {(new Date(data.updatedAt)).toLocaleString()}</p>
                    </div>
                    <div><DropdownMenu /></div>
                </div> : <LoadingSpinner />}
        </div>}
    </>
    );
})
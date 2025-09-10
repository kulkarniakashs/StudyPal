"use client"
import { useState } from "react";
import { GrLinkNext } from "react-icons/gr";
import LoadingSpinner from "./LoadingSpinner";
import { copychat } from "@/lib/actions";
import { useRouter } from "next/navigation";
export default function ContinueButton({chatid}: {chatid : string}) {
    const [Loading, setLoading] = useState(false);
    const router = useRouter();
    return (<>{ chatid &&
        <div className="w-full flex justify-center items-center p-3 ">
            {!Loading ? <div className="bg-white text-xl text-black px-10 py-3 mx-2 rounded-2xl flex gap-2 items-center"
                onClick={() => {
                    setLoading(true);
                    let res = copychat(chatid);
                    res.then(res=>{
                        if(res){
                            console.log("reseq",res);
                            router.push(`/chat/${res}`);
                            setLoading(false);
                        }
                        else{
                            setLoading(false);
                            alert("Something Went Wrong Try Again");
                        }
                    })
                }}
            >
                <h1>Continue</h1>
                <GrLinkNext />
            </div> : <LoadingSpinner/>}
        </div>}
        </>
    )
}
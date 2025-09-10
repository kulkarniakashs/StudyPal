"use client"
import { useState, useRef, useEffect, useCallback, act } from 'react';
import { BsThreeDotsVertical } from "react-icons/bs";
import ConfirmationModal from "@/app/components/ConfirmationModal";
import { useParams, useRouter } from 'next/navigation';
import { dropdownmenu } from '@/lib/actions';
import {action} from "@/lib/types"
import { useDispatch } from 'react-redux';
import { filterChat } from '@/lib/store/chatList';
type DropdownOption = {
  label: string;
  value: action;
};

const DropdownMenu: React.FC = () => {
  const options : DropdownOption[] = [{label : "Delete", value : action.delete}, {label: "Share", value : action.share}];
  const [chatid, setChatid] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<DropdownOption | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const params = useParams();
  const dispatch =  useDispatch();
  const router = useRouter()
  const onOptionConfirm =useCallback(async(option : DropdownOption)=>{
    if(option){
      let b = await dropdownmenu(option.value, chatid);
      switch(option.value){
        case action.delete:
          if(b){
            router.replace('/chat');
            dispatch(filterChat({chatid: chatid}));
          }
          else{
            alert("Couldn't delete");
          }
          break;
        case action.share:
          if(b){
            await navigator.clipboard.writeText(`${window.location.hostname}:3000/share/${chatid}`)
          }
          else{
            alert("couldn't share");
          }
        default: 
          break;
      }
    }
  },[chatid])

  useEffect(()=>{
    if(params.chatid){
      let chatid = Array.isArray(params.chatid) ? params.chatid[0] : params.chatid;
      setChatid(chatid); 
    }
  },[params])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOptionClick = useCallback((option: DropdownOption) => {
    setSelectedOption(option);
    setIsModalOpen(true);
    setIsDropdownOpen(false);
  },[]);

  const handleConfirm = useCallback(() => {
    if (selectedOption) {
      onOptionConfirm(selectedOption);
    }
    setIsModalOpen(false);
    setSelectedOption(null);
  },[onOptionConfirm, selectedOption]);

  const handleCancel = useCallback(() => {
    setIsModalOpen(false);
    setSelectedOption(null);
  },[]);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        aria-expanded={isDropdownOpen}
        className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-white rounded-md cursor-pointer hover:bg-black"
      >
        <BsThreeDotsVertical/>
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 w-48 mt-2 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg">
          <div className="py-1">
            {options.map((option) => (
              <button
                key={option.value}
                className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => handleOptionClick(option)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedOption && <ConfirmationModal
        isOpen={isModalOpen}
        title={`${selectedOption.value == action.delete ? "Are you sure ?" : "Share and Copy link"}`}
        message={`${selectedOption.value == action.delete ? "Chat will be deleted Permantly" : `${window.location.hostname}/share/${chatid}`}`}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        chatid = {chatid}
      />}
    </div>
  );
};

export default DropdownMenu;


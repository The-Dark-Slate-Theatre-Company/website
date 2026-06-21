import { useEffect, useState } from "react"
import { query } from "firebase/database";
import { collection, getDocs, where } from "firebase/firestore";
import { db } from "../../../firebase";

import { DependentContent } from "../../../components/admin-dependent-content/DependentContent";
import { GetUserData, SetUserData } from "../../../firebase_functions/UserData";
import { Mail, MailOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FormatMessage } from "./MessageFormatter";


export function Inbox() {

  const [messages, setMessages] = useState(null);
  const [user, setUser] = useState(null);
  const [inboxLastChecked, setInboxLastChecked] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    async function getMessages() {
      const q = query(collection(db, 'mail'), where('delivery.info.accepted', 'array-contains', 'darkslatetheatre@gmail.com'))
      const snaps = await getDocs(q);
      const data = snaps.docs.map((s) => {return {uid: s.id, ...s.data()}});
      const sortedData = data.sort((a,b) => b.delivery.endTime.seconds - a.delivery.endTime.seconds);
      setMessages(sortedData);
    }
    async function getUserData() {
      const userData = await GetUserData();
      setUser(userData);
      setInboxLastChecked(userData.inbox_last_checked ? userData.inbox_last_checked : 0);

      // Update the inbox last checked to the current time
      const timestamp = Math.floor(Date.now() / 1000);
      SetUserData(userData.uid, {inbox_last_checked: timestamp});
    }
    getMessages();
    getUserData();
  }, []);
  
  console.log(messages);


  return (
    <DependentContent dependencies={[messages, user, inboxLastChecked]} >
      {(messages && (inboxLastChecked !== null)) &&
        <div className='w-full flex flex-col gap-2 rounded-sm overflow-hidden'>
          {
            messages.map((x, i) => {
              const m = FormatMessage(x);
              console.log(m);
              const isNew = x.delivery.startTime.seconds > inboxLastChecked
              return (
                <div key={`${m.uid}`} onClick={() => navigate(`/admin/inbox/${m.uid}`)} style={{fontWeight: isNew ? '600' : '100'}} className='w-full bg-[#101010] px-4 py-3 grid items-center not-md:text-sm grid-cols-[1fr_10fr_15fr] md:grid-cols-[1fr_10fr_15fr_20fr_5fr] gap-8 cursor-pointer hover:bg-[#151515] transition-colors'>
                  {
                    isNew 
                    ? <Mail size={25} style={{color: m.category.colour}} />
                    : <MailOpen size={25} style={{color: m.category.colour}} />
                  }
                  <p className='text-[#aaa] text-nowrap overflow-hidden text-ellipsis'>{m.name}</p>
                  <p className='text-nowrap overflow-hidden text-ellipsis'><span style={{color: m.category.colour}}>[{m.category.name}]</span> {m.subject}</p>
                  <p className='not-md:hidden text-nowrap overflow-hidden text-ellipsis text-[#999] text-sm'>{m.message}</p>
                  <p className='not-md:hidden text-end'>{m.date}</p>
                </div>
              )
            })
          }
        </div>
      }
    </DependentContent>
  )

}
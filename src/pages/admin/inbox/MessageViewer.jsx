import { useEffect, useState } from "react";
import { DependentContent } from "../../../components/admin-dependent-content/DependentContent";
import { useLocation } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import { FormatMessage } from "./MessageFormatter";

export function MessageViewer() {

  const [m, setM] = useState(null);
  const location = useLocation();
  const uid = location.pathname.split('/')[location.pathname.split('/').length - 1];

  useEffect(() => {
    async function getMessage() {
      const docRef = doc(db, 'mail', uid);
      const snap = await getDoc(docRef);
      const data = {uid: snap.id, ...snap.data()};
      const message = FormatMessage(data);
      setM(message);
    }
    getMessage();
  }, [])


  return (
    <DependentContent dependency={m} >
      { m &&
        <div className='w-full flex flex-col'>
          <div className='relative w-full flex justify-between items-center mb-8 mt-6'>
            <p className='absolute top-0 -translate-y-full text-sm' style={{color: m.category.colour}}>{m.category.name}</p>
            <p title={m.subject} className='text-nowrap overflow-hidden text-ellipsis text-xl md:text-2xl'>{m.subject}</p>
            <p className='shrink-0 text-[#aaa] text-lg md:text-xl'>{m.date}</p>
          </div>
          <div className='bg-[#101010] px-3 py-2 mb-8 rounded-sm border border-white/20 text-sm tracking-wider'>
            <p><b className='uppercase text-[#999] mr-2'>From:</b> {m.name} {m.company ? `(at ${m.company})` : ''}</p>
            <p><b className='uppercase text-[#999] mr-2'>Email:</b> <a className='underline cursor-pointer hover:brightness-80' href={`mailto:${m.email}`}>{m.email}</a></p>
            <p><b className='uppercase text-[#999] mr-2'>Phone:</b> {m.phone ? m.phone : <span className='text-[#555]'>no phone provided</span>}</p>
          </div>

          {
            m.message.split('\n').map((p) => 
              <p className='text-lg tracking-wide mb-2 text-[#ccc] px-2 leading-6'>
                {p}
              </p>
            )
          }
        </div>
      }
    </DependentContent>
  )

}
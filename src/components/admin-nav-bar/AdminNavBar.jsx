import { ChevronRight, LockKeyhole, LockKeyholeOpen } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export function AdminNavBar() {

  const [locked, setLocked] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname.split('/').filter(Boolean);

  const handleNavigate = (i) => {
    if(i === path.length - 1) return;
    let to = '';
    path.forEach((p, j) => {
      if(j <= i) to = `${to}/${p}`
    });
    navigate(to);
  }

  return (
    <div className='relative w-[calc(90%+28px)] max-w-308 mb-8 bg-[#151515] rounded-sm px-3 pb-2 pt-4.75 flex flex-wrap gap-4 uppercase tracking-wide'>
      {
        path.map((p, i) => {
          const last = !(i < path.length - 1);
          const textClass = `${last ? 'select-none border-transparent' : `border-[#333] transition-all ${locked ? 'opacity-25 cursor-default' : 'hover:text-white hover:border-white cursor-pointer'}`} -mt-2 text-[#aaa] border-b-2 px-1`

          const longP = p.replaceAll('-', ' ');
          const shortP = longP.length > 8 ? `${longP.substring(0, 8).trimEnd()}...` : longP;

          return (
            <div key={i} onClick={() => { if(!locked) handleNavigate(i) }} className='flex gap-4 items-center'>
              <p className={`${textClass} not-md:hidden`}>{longP}</p>
              <p className={`${textClass} md:hidden`}>{shortP}</p>
              {!last ? <ChevronRight size={20} className='text-[#777] -mt-2' /> : null}
            </div>
          )
        }
        )
      }
      <div className='absolute h-full top-0 rounded-r-sm z-10 right-0 mr-1 bg-[#151515] w-11 flex justify-center items-center'>
        <AnimatePresence>
          {
            locked && 
            <motion.div
              initial={{opacity: 0, scale: 0.2}}
              animate={{opacity: 1, scale: 1}}
              exit={{opacity: 0, scale: 0.2}}
              transition={{duration: 0.5, type: 'spring'}}
              className='absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-9 h-9 bg-[#ecf0f1] rounded-full'
            />
          }
        </AnimatePresence>
        <div onClick={() => setLocked(!locked)} className={`${locked ? 'text-black rotate-0' : 'text-[#aaa] rotate-360'} relative z-10 transition-all duration-200 hover:brightness-110 cursor-pointer`}>
          {
            locked 
            ? <LockKeyhole size={20} />
            : <LockKeyholeOpen size={20} />
          }
        </div>
      </div>
    </div>
  )

}
import { ChevronRight } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export function AdminNavBar() {

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
    <div className='w-[calc(90%+28px)] max-w-308 mb-8 bg-[#151515] rounded-sm px-3 pb-2 pt-4.75 flex flex-wrap gap-4 uppercase tracking-wide'>
      {
        path.map((p, i) => {
          const last = !(i < path.length - 1);
          const textClass = `${last ? 'select-none border-transparent' : 'hover:text-white border-[#333] hover:border-white cursor-pointer transition-colors'} -mt-2 text-[#aaa] border-b-2 px-1`

          const longP = p.replaceAll('-', ' ');
          const shortP = longP.length > 8 ? `${longP.substring(0, 8).trimEnd()}...` : longP;

          return (
            <div key={i} onClick={() => handleNavigate(i)} className='flex gap-4 items-center'>
              <p className={`${textClass} not-md:hidden`}>{longP}</p>
              <p className={`${textClass} md:hidden`}>{shortP}</p>
              {!last ? <ChevronRight size={20} className='text-[#777] -mt-2' /> : null}
            </div>
          )
        }
        )
      }
    </div>
  )

}
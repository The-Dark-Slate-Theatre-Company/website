import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react"
import { db } from "../../../firebase";
import { DependentContent } from "../../../components/admin-dependent-content/DependentContent";
import { useLocation, useNavigate } from "react-router-dom";
import { CalendarCheck, CalendarClock, CirclePlus, Eye, EyeClosed, SquareArrowUpRight } from "lucide-react";
import { AddListItemButton } from "../../../components/admin-draggable-list/AddListItemButton";


export function ShowsAdmin() {

  const [shows, setShows] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function getShows() {
      const q = query(collection(db, 'shows'), orderBy('sorting_index', 'desc'));
      const snaps = await getDocs(q);
      const data = snaps.docs.map((d) => d.data());
      setShows(data);
    }
    getShows();
  }, [])

  return (
    <DependentContent dependency={shows}>
      {
        shows && 
        <>
          <div className='-mt-4'>
            <AddListItemButton onClick={() => navigate('/admin/shows/new-show')}>New Show</AddListItemButton>
          </div>
          <div className='w-full gap-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
            {
              shows.map((s) => <ShowTile key={s.uid} s={s} />)
            }
          </div>
        </>
      }
    </DependentContent>
  )

}


function ShowTile({s}) {

  const navigate = useNavigate();

  const thumbnail = getThumbnailSrc(s);

  return (
    <div onClick={() => navigate(`/admin/shows/${s.uid}`)} className='relative w-full bg-[#101010] rounded-sm p-2 cursor-pointer hover:bg-[#151515] transition-colors overflow-hidden'>
      <div className='w-full aspect-7/8 overflow-hidden flex justify-center items-center rounded-xs border-white/20 border'>
        {
          thumbnail 
          ? <img src={thumbnail} className='w-full h-full object-cover' />
          : <div className='w-full h-full bg-[#151515]' />
        }
      </div>
      <div className='flex justify-between items-center'>
        <p className='mt-2 px-1 text-nowrap overflow-hidden text-ellipsis text-[#ccc]'>{s.name}</p>
        {
          s.public && <SquareArrowUpRight onClick={(e) => { e.stopPropagation(); window.open(`${window.location.origin}/shows/${s.uid}`, "_blank")}} className='text-[#555] hover:text-[#ccc]' size={20} />
        }
      </div>
      <div title={`${s.public ? 'Public' : 'Private'}. ${s.currently_showing ? 'Has upcoming performances' : 'No upcoming performances'}.`} className='absolute top-0 right-0 px-2 py-1 bg-[#202020] rounded-bl-sm drop-shadow-[0_0_8px_#000000cc] flex items-center gap-1'>
        {
          s.currently_showing 
          ? <CalendarClock size={20} className='text-[#e67e22]' />
          : <CalendarCheck size={20} className='text-[#3498db]' />
        }
        {
          s.public 
          ? <Eye size={20} className='text-[#2ecc71]' />
          : <EyeClosed size={20} className='text-[#e74c3c]' />
        }
      </div>
    </div>
  )
}


function getThumbnailSrc(s) {
  if(s.currently_showing) {
    return (
      s.whats_on.photos.small.url.length ? s.whats_on.photos.small.url
      : s.whats_on.photos.medium.url.length ? s.whats_on.photos.medium.url
      : s.whats_on.photos.large.url.length ? s.whats_on.photos.large.url : null
    )
  }
  return s.past_show.thumbnail.url ?? null;
}
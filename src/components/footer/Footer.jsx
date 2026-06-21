import Instagram from '../../assets/social-logos/instagram.svg';
import Facebook from '../../assets/social-logos/facebook.svg';
import TikTok from '../../assets/social-logos/tiktok.svg';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';


export function Footer() {

  const [resources, setResources] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function getResources() {
      const docRef = doc(db, 'site-data', 'resources');
      const snap = await getDoc(docRef);
      const data = snap.data().items;
      setResources(data);
    }
    getResources();
  }, [])

  return (
    <div className='w-full border-t border-t-[#222] mt-8 flex flex-col items-center'>

      <div className='w-[90%] max-w-300 mt-8 flex justify-between gap-8 not-md:justify-center'>
        <div className='flex gap-4'>
          <SocialIcon src={Instagram} href='https://instagram.com/darkslatetheatre' />
          <SocialIcon src={Facebook} href='https://www.facebook.com/darkslatetheatre' />
          <SocialIcon src={TikTok} href='https://www.tiktok.com/@darkslatetheatre' />
        </div>

        <div className='flex flex-col gap-2 not-md:hidden min-w-80'>
          {
            resources.map((r, i) => 
              <a className='underline text-sm text-start text-(--accent) hover:brightness-80 transition-all' key={i} href={r.link} target='_blank'>{r.name}</a>
            )
          }
        </div>

        <button onClick={() => navigate('/contact')} className='border-b-2 px-4 pb-2 border-transparent hover:border-(--accent) cursor-pointer transition-all'>Get In Touch</button>
      </div>

      <p className='w-[75%] text-center text-sm text-[#aaa] mt-8 mb-4'>Copyright © 2026 The Dark Slate Theatre Company. Website by Thomas McCarthy</p>

    </div>
  )

}


function SocialIcon({src, href}) {
  return (
    <a href={href} target='_blank' className='opacity-90 hover:brightness-80 transition-all'>
      <img src={src} className='w-7' />
    </a>
  )
}
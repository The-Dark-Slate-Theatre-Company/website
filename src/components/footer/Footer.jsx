import Instagram from '../../assets/social-logos/instagram.svg';
import Facebook from '../../assets/social-logos/facebook.svg';
import TikTok from '../../assets/social-logos/tiktok.svg';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';


export function Footer({resourcesOverride=null}) {

  const [resources, setResources] = useState(resourcesOverride ?? []);
  const navigate = useNavigate();

  useEffect(() => {
    async function getResources() {
      if(!resourcesOverride) {
        const docRef = doc(db, 'site-data', 'resources');
        const snap = await getDoc(docRef);
        const data = snap.data().items;
        setResources(data);
      }
    }
    getResources();
  }, [])

  return (
    <div className='w-full border-t border-t-[#222] mt-8 flex flex-col items-center'>

      <div className='w-[90%] max-w-300 mt-8 flex justify-between gap-8 not-md:justify-center'>
        <div className='flex gap-4'>
          <SocialIcon disabled={resourcesOverride !== null} src={Instagram} href='https://instagram.com/darkslatetheatre' />
          <SocialIcon disabled={resourcesOverride !== null} src={Facebook} href='https://www.facebook.com/darkslatetheatre' />
          <SocialIcon disabled={resourcesOverride !== null} src={TikTok} href='https://www.tiktok.com/@darkslatetheatre' />
        </div>

        <div className='flex flex-col gap-0.5 not-md:hidden min-w-80'>
          {
            resources.map((r, i) => 
              <a className='underline text-sm text-start text-(--accent) hover:brightness-80 transition-all' key={i} href={r.link} target='_blank'>{r.name}</a>
            )
          }
        </div>

        <button onClick={() => {if(!resourcesOverride) navigate('/contact')}} className='border-b-2 px-4 pb-2 border-transparent hover:border-(--accent) cursor-pointer transition-all'>Get In Touch</button>
      </div>

      <div className='flex justify-center flex-wrap gap-1 md:hidden w-[50%] mt-6'>
        {
          resources.map((r, i) => 
            <div className='flex gap-1'>
              <a className='border-b text-xs text-start text-(--accent)' key={i} href={r.link} target='_blank'>{r.name}</a>
              {(i !== resources.length - 1) && <p className='text-xs text-[#aaa]'>•</p>}
            </div>
          )
        }
      </div>

      <p className='w-[75%] text-center text-sm text-[#aaa] mt-4 md:mt-8 mb-4'>Copyright © 2026 The Dark Slate Theatre Company. Website by Thomas McCarthy</p>

    </div>
  )

}


function SocialIcon({src, href, disabled}) {

  if(disabled) return (
    <div className='opacity-90'>
      <img src={src} className='w-7' />
    </div>
  )

  return (
    <a href={href} target='_blank' className='opacity-90 hover:brightness-80 transition-all'>
      <img src={src} className='w-7' />
    </a>
  )
}
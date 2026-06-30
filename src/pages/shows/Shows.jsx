import { useEffect, useState } from "react";
import { Page } from "../../components/page/Page";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { AnimatePresence, motion } from "motion/react";
import { FireAshBackground } from "./FireAshBackground";



export function Shows() {

  const [whatsOn, setWhatsOn] = useState(null);
  const [pastShows, setPastShows] = useState(null);

  useEffect(() => {
    async function getShows() {
      const docsRef = collection(db, 'shows');
      const snaps = await getDocs(docsRef);
      const data = snaps.docs.map(doc => doc.data());
      setWhatsOn(data.filter((x) => {return !x.past}));
      setPastShows(data.filter((x) => {return x.past}));
    }
    getShows();
  }, []);


  return (
    <>
      <FireAshBackground visible={(whatsOn && pastShows)} />
      <div className='relative z-1 min-h-[calc(100dvh-160px)]'>
        <Page>
          <motion.p 
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{duration: 0.5, delay: 0.1}}
            className='text-center -mb-3 md:text-lg tracking-widest uppercase text-(--accent)'
          >
            Shows
          </motion.p>

          <AnimatePresence mode='wait'>
            <motion.div key={(whatsOn && pastShows) ? 'shows' : 'loader'} initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} transition={{duration: 0.6}}>
            {
              (whatsOn && pastShows) 
              ? <>
                  {
                    whatsOn.length 
                    ? <WhatsOn shows={whatsOn} />
                    : null
                  }
                  { (whatsOn.length && pastShows.length) ? <div className='h-8' /> : null }
                  {
                    pastShows.length 
                    ? <PastShows shows={pastShows} />
                    : null
                  }
                </>
              : <PageSkeleton override={whatsOn && pastShows} />
            }
            </motion.div>
          </AnimatePresence>
        </Page>
      </div>
    </>
  )
}



function WhatsOn({shows}) {
  return (
    <div>
      <ShowPageTitle>What's On</ShowPageTitle>
      <div className='w-full flex flex-col gap-5 items-center mt-6'>
        {
          shows.map((s, i) => <WhatsOnTile key={i} show={s} />)
        }
      </div>
    </div>
  )
}


function PastShows({shows}) {

  return (
    <div>
      <ShowPageTitle>Past Shows</ShowPageTitle>
      <p className='text-center mt-6 md:text-lg text-[#aaa] leading-5.5 md:leading-6'>
        Stories we've told. Worlds we've built.<br/>
        Thank you to the audiences, artists, and everyone who made them possible.
      </p>
      <div className='w-full flex justify-center mt-10'>
        <div className='flex gap-3 flex-wrap justify-center w-70 md:w-140 lg:w-210'>
        {
          shows.map((s, i) => 
            <div key={i} className='w-full border-2 border-(--accent) bg-black/80 rounded-sm md:max-w-[calc(50%-12px)] lg:max-w-[calc(33%-8px)]'>
              <PastShowTile show={s} />
            </div>
          )
        }
        </div>
      </div>
    </div>
  )
}


function ShowPageTitle({children}) {
  return (
    <div className='relative w-full flex justify-center pb-2 mt-4 2xl:mt-6'>
      <h1 className='text-6xl not-md:text-5xl font-donau tracking-widest pb-5'>{children}</h1>
      <hr className='absolute bottom-0 w-full max-w-25 border border-(--accent)' />
    </div>
  )
}


function PageSkeleton({override}) {

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if(!override) setVisible(true)
    }, 750)

    return () => clearTimeout(timeout);
  }, [])

  if(!visible) return <div className='min-h-130.75' />;

  return (
    <motion.div initial={{opacity: 0}} animate={{opacity: 1}} transition={{duration: 1}} className='relative w-full min-h-130.75 flex justify-center mt-6'>
      <div className='absolute w-full max-w-100 h-20 z-10 bg-[#151515] animate-pulse rounded-sm' />
    </motion.div>
  )
}


function WhatsOnTile({show: s}) {

  const [backgroundLoaded, setBackgroundLoaded] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);

  console.log(s);
  return (
    <div className='group relative w-full flex justify-center items-center aspect-7/8 sm:aspect-2/1 xl:aspect-3/1 border-2 border-black/50 rounded-sm bg-black/60 overflow-hidden drop-shadow-[0_0_12px_#ffffff0a]'>
      <div className='absolute -z-10 w-full h-full bg-black animate-pulse' />
      <img loading='lazy' onLoad={() => setBackgroundLoaded(true)} style={{opacity: (backgroundLoaded && logoLoaded) ? 1 : 0}} src={s.whats_on.photos.background.url} className='group-hover:brightness-120 transition-all duration-1000 w-full h-full object-cover' />
      <img loading='lazy' onLoad={() => setLogoLoaded(true)} style={{opacity: (backgroundLoaded && logoLoaded) ? 1 : 0}} src={s.whats_on.photos.logo.url} className='absolute w-100 transition-opacity duration-1000' />
    </div>
  )
}


function PastShowTile({show: s}) {

  const [thumbnailLoaded, setThumbnailLoaded] = useState(false);

  const startYear = s.run.first_performance.split('/')[2];
  const endYear = s.run.last_performance.split('/')[2];
  let productionYear = (
    startYear === endYear ? startYear : `${startYear} - ${endYear}`
  );

  return (
    <div className='group cursor-pointer flex flex-col items-center p-1.5'>
      <div className='relative w-full rounded-xs aspect-7/8 overflow-hidden flex justify-center items-center'>
        <div className='absolute -z-10 w-full h-full bg-[#101010] animate-pulse' />
        <img loading='lazy' onLoad={() => setThumbnailLoaded(true)} style={{opacity: thumbnailLoaded ? 1 : 0}} className='group-hover:brightness-120 transition-all duration-1000 w-full h-full object-cover' src={s.photos.thumbnail.url} />
      </div>
      <h1 className='text-xl uppercase tracking-wide border-b border-transparent mb-0.5 mt-2 group-hover:text-(--accent) group-hover:border-b-(--accent) transition-all duration-400'>{s.name}</h1>
      <p className='text-sm tracking-widest text-(--accent) mb-2'>{productionYear}</p>
    </div>
  )
}
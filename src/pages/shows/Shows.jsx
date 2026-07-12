import { useEffect, useRef, useState } from "react";
import { Page } from "../../components/page/Page";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import { AnimatePresence, motion } from "motion/react";
import { FireAshBackground } from "./FireAshBackground";
import { useTailwindScreen } from "../../components/tailwind-screen/TailwindScreen";
import { ChevronsRight, MoveRight } from "lucide-react";
import { useNavigate } from "react-router-dom";



export function Shows() {

  const [whatsOn, setWhatsOn] = useState(null);
  const [pastShows, setPastShows] = useState(null);

  useEffect(() => {
    async function getShows() {
      const docsRef = query(collection(db, 'shows'), where('public', '==', true), orderBy('sorting_index', 'desc'));
      const snaps = await getDocs(docsRef);
      const data = snaps.docs.map(doc => doc.data());
      setWhatsOn(data.filter((x) => {return x.currently_showing}));
      setPastShows(data.filter((x) => {return !x.currently_showing}));
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
                  { (pastShows.length && whatsOn.length) ? <div className='h-16' /> : null }
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
      <div className='w-full flex justify-center mt-10 mb-10'>
        <div className='flex gap-3 flex-wrap justify-center w-70 md:w-140 lg:w-210'>
        {
          shows.map((s, i) => <PastShowTile key={i} show={s} /> )
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


export function WhatsOnTile({show: s, disabled=false}) {

  console.log(s);

  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();

  // Get the different images for different sizes of screen
  const lgSrc = s.whats_on.photos.large.url?.length ? s.whats_on.photos.large.url : null;
  const mdSrc = s.whats_on.photos.medium.url?.length ? s.whats_on.photos.medium.url : lgSrc;
  const smSrc = s.whats_on.photos.small.url?.length ? s.whats_on.photos.small.url : mdSrc;

  const dropShadowClass = loaded ? 'drop-shadow-[0_-5px_12px_#ffffff10]' : '';
  const bottomBorderClass = s.whats_on.banner.length ? ' border-b-0' : 'rounded-b-sm border-b-2';

  function WhatsOnImage({src, visibleClass}) {
    if(src){
      return (
        <img 
          src={src} 
          loading='lazy' 
          onLoad={() => requestAnimationFrame(() => setLoaded(true))} 
          className={`
            w-full h-full object-cover
            transition-all duration-1000
            ${loaded ? "opacity-100" : "opacity-0"}
            group-hover:brightness-115
            ${visibleClass}
          `}
        />
      )
    }
    return <div className='bg-[#202020] w-full h-full object-cover' />
  }

  return (
    <div onClick={() => { if(!disabled) navigate(`/shows/${s.uid}`)} } className={`${dropShadowClass} group relative w-[90%] min-[1650px]:w-full bg-black/60 overflow-hidden cursor-pointer`}>
      <div className={`${bottomBorderClass} w-full flex justify-center items-center aspect-7/8 sm:aspect-2/1 xl:aspect-2.5/1 border-2 border-black/50 group-hover:border-(--accent) rounded-t-sm transition-colors duration-250`}>
        <WhatsOnImage src={lgSrc} visibleClass='not-xl:hidden' />
        <WhatsOnImage src={mdSrc} visibleClass='not-sm:hidden xl:hidden' />
        <WhatsOnImage src={smSrc} visibleClass='sm:hidden' />
      </div>
      {
        s.whats_on.banner.length 
        ? <div className='p-2 flex justify-center items-center transition-all duration-250 uppercase tracking-wider font-bold bg-(--accent) text-black rounded-b-sm'>
            {s.whats_on.banner}
            <div className='w-0 group-hover:w-8 overflow-hidden flex justify-end items-center opacity-0 group-hover:opacity-100 transition-all duration-400'>
              <ChevronsRight className='shrink-0' />
            </div>
          </div>
        : null
      }
    </div>
  )
}


export function PastShowTile({show: s, disabled=false}) {

  const [thumbnailLoaded, setThumbnailLoaded] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  let startYear = Infinity;
  let endYear = 0;
  s.performances.forEach((p) => {
    const from = parseInt(p.from.split('-')[0]);
    const to = parseInt(p.to.split('-')[0]);
    if(from < startYear) startYear = from;
    if(to > endYear) endYear = to;
  })

  let productionYear;
  if(startYear === Infinity) productionYear = null
  else productionYear = (
    startYear === endYear ? startYear : `${startYear} - ${endYear}`
  );

  const timeoutRef = useRef();

  function handleMouseEnter() {
    timeoutRef.current = setTimeout(() => setExpanded(true), 300);
  }

  function handleMouseLeave() {
    clearTimeout(timeoutRef.current);
    setExpanded(false);
  }

  return (
    <div className='relative min-h-93 w-full md:max-w-[calc(50%-12px)] lg:max-w-[calc(33%-8px)]'>
      <div 
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => { if(!disabled) navigate(`/shows/${s.uid}`) }}
        className={`absolute w-full border-2 border-(--accent) bg-black/60 backdrop-blur-xs rounded-sm drop-shadow-none hover:scale-105 hover:drop-shadow-[0_12px_10px_#000000aa] hover:bg-black transition-all duration-500`}
      >
        <div className='group cursor-pointer flex flex-col items-center p-1.5'>
          <div className='relative w-full rounded-xs aspect-7/8 overflow-hidden flex justify-center items-center'>
            <div className='absolute -z-10 w-full h-full bg-[#101010] animate-pulse' />
            { s.past_show.thumbnail.url
              ? <img loading='lazy' onLoad={() => setThumbnailLoaded(true)} style={{opacity: thumbnailLoaded ? 1 : 0}} className='group-hover:brightness-120 transition-all duration-1000 w-full h-full object-cover' src={s.past_show.thumbnail.url} />
              : <div className='w-full h-full object-cover bg-[#151515]' />
            }
          </div>
          <h1 className='text-xl uppercase tracking-wide border-b border-transparent mb-0.5 mt-2 group-hover:text-(--accent) group-hover:border-b-(--accent) transition-all duration-400'>{s.name}</h1>
          {productionYear
            ? <p className='text-sm tracking-widest text-(--accent) mb-2'>{productionYear}</p>
            : <div className='mb-7' />
          }
          
          <div className={`overflow-hidden text-sm text-[#ccc] px-2 text-center transition-all ease-in-out ${
            expanded ? 'max-h-40 opacity-100 pb-2 duration-1000' : 'max-h-0 opacity-0 duration-500'
          }`}>
            {s.past_show.short_description}
          </div>
        </div>
      </div>
    </div>
  )
}
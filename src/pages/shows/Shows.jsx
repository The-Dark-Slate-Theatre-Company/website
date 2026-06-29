import { useEffect, useState } from "react";
import { Page } from "../../components/page/Page";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { AnimatePresence, motion } from "motion/react";



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
    <Page>
      <motion.p 
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        transition={{duration: 0.5, delay: 0.1}}
        className='text-center md:text-lg tracking-widest uppercase text-(--accent)'
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
                ? <PastShows shows={whatsOn} />
                : null
              }
            </>
          : <PageSkeleton override={whatsOn && pastShows} />
        }
        </motion.div>
      </AnimatePresence>
      
    </Page>
  )
}



function WhatsOn({shows}) {
  return (
    <div>
      <ShowPageTitle>What's On</ShowPageTitle>
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

  if(!visible) return null;

  return (
    <motion.div initial={{opacity: 0}} animate={{opacity: 1}} transition={{duration: 1}} className='relative w-full flex justify-center mt-6'>
      <div className='absolute w-full max-w-100 h-20 z-10 bg-[#151515] animate-pulse rounded-sm' />
    </motion.div>
  )
}
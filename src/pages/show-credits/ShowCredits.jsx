import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { Page } from "../../components/page/Page";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Title } from "../show-viewer/sections/title/Title";
import { CreditSection } from "../show-viewer/sections/credits/Credits";


export function ShowCredits() {

  const [active, setActive] = useState(0);
  const [credits, setCredits] = useState(null);

  const { show } = useOutletContext();
  const { showId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if(!show) return;
    if(show.credits.length < 2) navigate(`/shows/${showId}`);
    else {
      const sortedCredits = show.credits.sort((a,b) => Number(b.most_recent) - Number(a.most_recent));
      setCredits(sortedCredits);
    }
  }, [show]);
  
  return (
    <Page>
      <AnimatePresence>
        {
          (show && credits)
          ? <motion.div initial={{opacity: 0}} animate={{opacity: 1}} transition={{duration: 0.2}} className='w-full flex flex-col items-center'>
              <p className='w-full text-center text-(--accent) uppercase font-bold tracking-widest -mb-9'>Credits</p>
              <Title section={{style: 'title', label: show.name}} />
              <button onClick={() => navigate(`/shows/${showId}`)} className='text-[#ccc] hover:text-white cursor-pointer transition-all flex gap-2 items-center'>
                <p>see show page</p>
              </button>
              
              <CreditNav credits={credits} active={active} setActive={setActive} />
              <hr className='w-full mb-20 mt-15 border-[#444]'/>
              <AnimatePresence mode='wait'>
                <motion.div className='w-full' key={active} initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: 40}} transition={{duration: 0.2,}}>
                  <div className='w-full mb-10 flex flex-col items-center gap-12'>
                    <CreditSection large section={show.credits[active].exec} />
                    <CreditSection label='Performing Company' section={show.credits[active].cast} />
                    <CreditSection label='Production Team' section={show.credits[active].crew} />
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          : null
        }
      </AnimatePresence>
    </Page>
  )

}


function CreditNav({credits, active, setActive}) {
  return (
    <div className='flex flex-wrap justify-center rounded-xs overflow-hidden mt-8'>
      {
        credits.map((c, i) => {
            const selected = (active === i);
            return (
              <div className={`
                  px-6 py-2 transition-all 
                  ${selected ? 'bg-(--accent) text-black font-bold select-none' : 'bg-[#181818] text-white cursor-pointer hover:bg-[#222]'}
                `}
                onClick={() => setActive(i)}
              >
                <p>{c.label || 'Latest'}</p>
              </div>
            )
          }
        )
      }
    </div>
  )
}
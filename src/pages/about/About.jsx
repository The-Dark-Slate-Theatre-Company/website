import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { Page } from "../../components/page/Page";
import { db } from "../../firebase";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { ImageBanner } from "../../components/image-banner/ImageBanner";

import TopImage from '../../assets/images/about-us.png';
import { TeamCard } from "./TeamCard";


export function About() {

  const [team, setTeam] = useState({});
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    async function getTeam() {
      const snapshot = await getDocs(collection(db, 'users-public'));
      let team = {};
      snapshot.docs.forEach((d) => {
        const data = d.data();
        team[data.uid] = {...data};
      })
      setTeam(team);
    }
    getTeam();
  }, []);

  console.log(team);

  return (
    <>
      <AnimatePresence>
        {
          selected && 
          <motion.div
            key='team-card'
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.1}}
            className='fixed z-100 inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center'
            onClick={() => setSelected(null)}
          >
            <TeamCard of={selected} setSelected={setSelected} />
          </motion.div>
        }
      </AnimatePresence>

      <ImageBanner src={TopImage} />

      <Page>
        <h1 className='text-4xl tracking-widest border-b border-[#555] pb-2 mb-8'>About Us</h1>
        <p className='text-lg tracking-wide'>
          Taking influence from film noir, German Expressionism, and immersive theatre, The Dark Slate Theatre Company creates original productions that focus on atmosphere, design, and world-building.<br/><br/>
          Founded in York in 2023, we are interested in stories that draw audiences into carefully crafted worlds where environment and narrative work hand in hand. From intimate character dramas to immersive experiences, our work explores the strange and the macabre, the broken yet lovable.<br/><br/>
          At the heart of the company is a highly collaborative approach to theatre-making. We work with performers, designers, and technicians of all backgrounds and experiences to create ambitious work that puts storytelling at its centre.
        </p>

        <h1 className='text-4xl tracking-widest border-b border-[#555] pb-2 mt-20 mb-8'>Meet the Team</h1>
        <div className='w-full flex justify-center'>
          <div className='w-full lg:w-[90%] grid md:grid-cols-5 gap-3'>
            <TeamTile of={team['tm']} setSelected={setSelected} />
            <TeamTile of={team['am']} setSelected={setSelected} />
            <TeamTile of={team['rt']} setSelected={setSelected} />
            <TeamTile of={team['av']} setSelected={setSelected} />
            <TeamTile of={team['jw']} setSelected={setSelected} />
          </div>
        </div>
      </Page>
    </>
  )
}



function TeamTile({of: member, setSelected}) {

  return (
    <AnimatePresence mode='wait'>
      {
        member 
        ? 
          <motion.div 
            key={member['uid']} 
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{duration: 0.1}}
            onClick={() => setSelected(member)} 
            className="group relative overflow-hidden rounded-sm p-4 flex flex-col items-center cursor-pointer transition-colors duration-250"
          >
            <div className="absolute inset-0 bg-(--accent) origin-bottom scale-y-0 transition-transform duration-300 group-hover:scale-y-100" />
            <div className="relative z-10 flex flex-col items-center w-full">
              <div className="z-10 w-full aspect-square max-w-60 mb-4">
                {member.headshot.url ? (
                  <img src={member.headshot.url} className="w-full h-full object-cover rounded-sm group-hover:scale-90 transition-transform duration-250" />
                ) : (
                  <div />
                )}
              </div>
              <p className="w-full mb-1 text-center text-white group-hover:text-black uppercase font-bold tracking-wide leading-4 transition-colors duration-300">
                {member.name}
              </p>
              <p className="w-full text-center text-[#aaa] group-hover:text-black text-sm leading-4 transition-colors duration-300">
                {member.role}
              </p>
            </div>
          </motion.div>

        : 
          <motion.div 
            key='loading' 
            initial={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.1}}
            className="relative overflow-hidden rounded-sm p-4 flex flex-col items-center bg-[#101010] animate-pulse"
          >
            <div className="relative flex flex-col items-center w-full">
              <div className="w-full aspect-square max-w-60 mb-4" />
              <p className="w-full mb-1 leading-4 opacity-0">Name</p>
              <p className="w-full leading-4 opacity-0" >Role</p>
            </div>
          </motion.div>
      }
    </AnimatePresence>
  )
}
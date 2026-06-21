import { X } from "lucide-react"
import { motion } from "motion/react"

export function TeamCard({of: member, setSelected}) {
  return (
    <motion.div 
      initial={{opacity: 0, scale: 0.8}}
      animate={{opacity: 1, scale: 1}}
      transition={{duration: 0.2}}
      className='relative w-[95%] max-w-200 bg-[#101010] p-8 rounded-xs drop-shadow-[0_0_4px_#000000dd] flex not-md:flex-col gap-8' 
      onClick={(e) => e.stopPropagation()}
    >
      <X onClick={() => setSelected(null)} className='absolute text-[#555] right-4 top-4 cursor-pointer' />
      <div className='w-full md:max-w-45 not-md:flex not-md:justify-center'>
        <div className='w-full not-md:max-w-60 aspect-square overflow-hidden shrink-0'>
          <img className='w-full object-cover' src={member.headshot.url} />
        </div>
      </div>
      <div className='w-full'>
        <h1 className='text-3xl tracking-wider uppercase'>{member.name}</h1>
        <h2 className='font-donau tracking-widest text-[#999]'>{member.founder ? 'Founder & ' : ''}<span className='text-(--accent)'>{member.role}</span></h2>
        <hr className='my-4 opacity-10' />
        <p className='tracking-wide md:text-lg text-[#ccc]'>{member.bio}</p>
      </div>
    </motion.div>
  )
}
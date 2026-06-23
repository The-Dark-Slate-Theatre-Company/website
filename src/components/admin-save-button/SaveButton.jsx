import { AnimatePresence, motion } from "motion/react";


export function SaveButton({visible, saving, handleSave}) {

  return (
    <AnimatePresence>
      {
        visible && 
        <motion.div 
          initial={{opacity: 0, bottom: -40}} 
          animate={{opacity: 1, bottom: 0}} 
          exit={{opacity: 0, bottom: -40}} 
          className='fixed left-0 bottom-0 z-10 bg-linear-to-t from-black to-transparent w-full flex justify-center'
        >
          <button onClick={handleSave} disabled={saving} className='min-w-50 not-lg:mb-4 mb-8 bg-(--accent) text-black uppercase font-bold tracking-wide text-xl px-12 py-2 rounded-sm drop-shadow-[0_0_2px_white] animate-[glow_2.5s_ease-in-out_infinite] not-disabled:cursor-pointer not-disabled:hover:scale-98 transition-all disabled:bg-[#555] disabled:animate-none disabled:drop-shadow-none'>
            {saving ? 'saving...' : 'save'}
          </button>
        </motion.div>
      }
    </AnimatePresence>
  )

}
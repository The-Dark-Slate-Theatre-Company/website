
// Dependent content only shows once the provided parameter/s are not null

import { AnimatePresence, motion } from "motion/react";

export function DependentContent({dependency=true, dependencies=[], children}) {

  const allDependencies = [dependency, ...dependencies];
  const complete = allDependencies.every((item) => item !== null && item !== undefined);

  return (
    <AnimatePresence mode='wait'>
      {
        complete 

        ? (<motion.div key='content' initial={{opacity: 0}} animate={{opacity: 1}} transition={{duration: 0.1}}>
            {children}
          </motion.div>)

        : (<motion.div key='loading' initial={{opacity: 0, scale: 0.9}} animate={{opacity: 1, scale: 1}} exit={{opacity: 0, scale: 0.8}} transition={{duration: 0.1}} className='w-full h-60 flex justify-center items-center'>
            <div className="w-8 h-8 border-2 border-[#444] border-t-white rounded-full animate-spin" />
          </motion.div>)
      }
    </AnimatePresence>
  )

}
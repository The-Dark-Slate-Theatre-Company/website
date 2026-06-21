import { motion, useScroll, useTransform } from "framer-motion";
import { useState } from "react";

export function ImageBanner({ src }) {

  const [loaded, setLoaded] = useState(false);

  const { scrollY } = useScroll();

  const y = useTransform(scrollY, [0, 1000], [0, 500]);

  return (
    <>
      <div className='-z-100 absolute w-full h-100 top-20 overflow-hidden opacity-40 md:opacity-80'>
        <motion.div
          style={{ y }}
          className='absolute inset-0 h-[120%]'
        >
          <img src={src} style={{opacity: loaded ? 1 : 0}} loading='lazy' onLoad={() => setLoaded(true)} className='w-full h-full object-cover transition-opacity duration-750' />
        </motion.div>

        <div className='absolute bottom-0 w-full h-full bg-linear-to-t from-black to-transparent' />
      </div>

      <div className='h-15 md:h-60' />
    </>
  );
}
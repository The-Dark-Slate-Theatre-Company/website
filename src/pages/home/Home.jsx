import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

import logo from '../../assets/logo/dark-slate-logo.svg';
import headerImage from '../../assets/images/marco.png';
import aboutUsImage from '../../assets/images/about-us.jfif';
import { MoveRight } from "lucide-react";
import { useNavigate } from "react-router-dom";


export function Home() {

  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 500]);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div className="relative h-screen overflow-hidden flex justify-center items-center">
        <motion.img
          src={headerImage}
          style={{ y }}
          className="absolute inset-0 w-full h-[120%] object-cover not-md:blur-sm"
        />
        <motion.img
          src={logo}
          className={`absolute w-[85%] max-w-140 transition-all duration-500 delay-100 ${scrolled ? 'scale-90 opacity-20' : 'scale-100 opacity-100'}`}
        />
      </div>


      <div className='w-full flex justify-center my-16'>

        <div className='relative w-[90%] max-w-300 min-h-100 flex flex-col justify-center overflow-hidden'>

          <div className='flex flex-col gap-8'>
            <h1 className='uppercase tracking-widest text-3xl not-md:text-center md:text-4xl pb-4 border-b border-(--accent)'>
              <span className='text-(--accent) text-sm md:text-lg not-md:mr-0.5 font-donau'>Welcome to</span> the Dark Slate
            </h1>
            <div className='w-full max-w-200 not-md:flex flex-col items-center'>
              <p className='text-lg md:text-xl tracking-wide text-[#eee] leading-8'>
                Taking influence from film noir, expressionism, and immersive theatre, The Dark Slate Theatre Company 
                aims to create bold, atmospheric productions with a keen focus on story, design, and world-building. We specialise in 
                original work that explores the strange and the macabre, crafting fully realised worlds and unforgettable experiences.
              </p>

              <div onClick={() => navigate('/about')} className='group pb-2 px-1 md:w-40 mt-8 flex gap-3 items-center cursor-pointer transition-all duration-200 border-b-2 border-(--accent) md:border-transparent hover:border-(--accent) hover:gap-5'>
                <p className='tracking-wide text-lg not-md:uppercase'>Find Out More</p>
                <MoveRight className='text-[#555] group-hover:text-white transition-colors not-md:hidden' />
              </div>
            </div>
          </div>

          <div className='absolute right-0 top-0 -z-10 w-full h-full max-w-200'>
            {/*GRADIENT OVERLAY*/}
            <div className='not-lg:hidden absolute w-full h-full bg-linear-to-r from-black to-transparent' />
            {/*GRADIENT BORDERS*/}
            <div className='absolute z-100 left-0 w-16 h-full bg-linear-to-l from-transparent to-black not-lg:hidden' />
            <div className='absolute z-100 right-0 w-16 h-full bg-linear-to-r from-transparent to-black' />
            <div className='absolute z-100 bottom-0 w-full h-16 bg-linear-to-b from-transparent to-black' />
            {/*IMAGE*/}
            <img src={aboutUsImage} className='not-lg:opacity-20 w-full h-full object-cover' />
          </div>
        </div>

      </div>
    </>
  );
}
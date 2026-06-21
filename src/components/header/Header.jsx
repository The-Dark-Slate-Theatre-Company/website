import { useEffect, useState } from "react";

import logoAccent from '../../assets/graphics/logo-accent.svg';
import { useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";


export function Header() {

  const navigate = useNavigate();
  const location = useLocation();
  const page = location.pathname.split('/').pop() || '/';

  const [scrolled, setScrolled] = useState(page !== "/");

  const [mobileNavOpen, setMobileNavOpen] = useState(false);


  useEffect(() => {
    const handleScroll = () => {
      setScrolled(page !== "/" || window.scrollY > 300);
    };

    handleScroll(); // Run immediately
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [page]);


  const logoClass = scrolled ? 'tracking-widest opacity-100' : 'tracking-tighter opacity-0'
  const bgClass = scrolled ? 'bg-[#000] border-(--accent) drop-shadow-[0_4px_8px_black]' : 'bg-transparent border-transparent'

  const mobileNavIconBaseClass = 'transition-all duration-500 origin-right cursor-pointer hover:brightness-80'
  const mobileNavIconVariableClass = scrolled ? 'scale-100 text-(--accent) mr-5' : 'scale-150 text-[#ccc] mr-6'

  return (
    <> 
      <div className={`select-none fixed z-100 top-0 w-full h-20 px-8 flex justify-center md:justify-between items-center border-b transition-all duration-500 ${bgClass}`}>
        
        <div className={`group font-donau flex items-center gap-4 text-xl transition-all duration-500 delay-200 origin-left text-[#555] ${logoClass}`}>
          <img src={logoAccent} className='w-20 opacity-40 md:hidden' />
          <h2 className='border-b not-md:hidden group-has-[h1:hover]:border-transparent transition-colors duration-500'>The</h2>
          <h1 onClick={() => navigate('/')} className={`text-4xl text-white border-b border-transparent mt-px md:hover:border-white ${scrolled ? 'cursor-pointer' : ''} transition-colors`}>Dark Slate</h1>
          <h2 className='border-b not-md:hidden group-has-[h1:hover]:border-transparent transition-colors duration-500'>Theatre Company</h2>
          <img src={logoAccent} className='w-20 opacity-40 rotate-180 md:hidden' />
        </div>

        <div className='flex items-center gap-12 not-md:hidden'>
          <NavOption to='/about'   page={page}>About</NavOption>
          <NavOption to='/contact' page={page}>Contact</NavOption>
        </div>

        <AnimatePresence mode='wait'>
          <motion.div 
            key={mobileNavOpen}
            initial={{opacity: 0, scale: 1}}
            animate={{opacity: 1, scale: 1}}
            exit={{opacity: 0, scale: 1}}
            whileTap={{scale: 0.6}}
            transition={{duration: 0.25}}
            className='md:hidden absolute right-0 flex justify-center items-center'
          >
            {
              mobileNavOpen 
              ? <X size={20} onClick={() => setMobileNavOpen(false)} className={`${mobileNavIconVariableClass} ${mobileNavIconBaseClass}`} />
              : <Menu size={20} onClick={() => setMobileNavOpen(true)} className={`${mobileNavIconVariableClass} ${mobileNavIconBaseClass}`} />
            }
          </motion.div>
        </AnimatePresence>

      </div>

      <MobileNavMenu open={mobileNavOpen} setOpen={setMobileNavOpen}>
        <NavOption to='/about'>About</NavOption>
        <NavOption to='/contact'>Contact</NavOption>
      </MobileNavMenu>
    </>


  );

}



function NavOption({to, page, children}) {

  const navigate = useNavigate();

  const selectedClass = (`/${page}` === to) ? 'text-(--accent) border-b border-(--accent)' : 'border-b border-transparent';

  return (
    <div onClick={() => navigate(to)} className={`${selectedClass} md:mt-0.5 border-b text-2xl not-md:w-3/4 not-md:text-center not-md:p-4 not-md:border-(--accent) md:text-lg cursor-pointer hover:brightness-80 transition-all duration-200`}>
      {children}
    </div>
  )

}



function MobileNavMenu({open, setOpen, children}) {
  return (
    <AnimatePresence>
      {
        open && 
        <motion.div
          initial={{height: 0}}
          animate={{height: '100dvh'}}
          exit={{height: 0}}
          transition={{duration: 0.2}}
          onClick={() => setOpen(false)}
          className='md:hidden fixed inset-0 z-90 origin-top bg-black/80 backdrop-blur-xs overflow-hidden'
        >
          <div className='w-full flex flex-col items-center gap-4 mt-30'>
            {children}
          </div>
        </motion.div>
      }
    </AnimatePresence>
  )
}
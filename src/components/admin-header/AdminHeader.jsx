import { signOut } from "firebase/auth";
import { getFunctions, httpsCallable } from "firebase/functions";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react"
import { auth } from "../../firebase";
import { LogOut, RotateCcwKey } from "lucide-react";

export function AdminHeader({user, publicUser}) {

  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const sendPasswordReset = httpsCallable(getFunctions(), 'sendPasswordReset');


  useEffect(() => {
    function handleClickOutside(event) {
      if(menuRef.current && !menuRef.current.contains(event.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => { document.removeEventListener("mousedown", handleClickOutside); };
  }, []);


  const handleLogout = async() => {
    try {
      await signOut(auth);
      
    } catch(err) {
      console.error(err);
      alert('An error occurred. Please try again')
    }
  }


  const handlePasswordReset = async() => {
    try {
      await sendPasswordReset({email: user.email});
      alert(`Sent reset password link to ${user.email}`);
    } catch(err) {
      console.error(err);
      alert('An error occurred. Please try again');
    }
  }


  return (
    <div className='fixed z-100 w-full px-6 py-4 top-0 bg-linear-to-b from-black to-transparent items-center flex justify-end md:justify-between'>
      <div className='flex gap-4 items-center not-md:hidden'>
        <h1 className='font-donau text-4xl tracking-wider'>Dark Slate</h1>
        <p className='uppercase tracking-wider text-[#aaa]'>Admin Portal</p>
      </div>
      <div className='relative flex items-center gap-4'>
        <p className='text-lg tracking-wide'>Hello, {user.name}</p>
        <div style={{filter: open ? 'saturate(0) brightness(0.5)' : 'saturate(1)'}} onClick={() => setOpen(true)} className='group w-14 aspect-square overflow-hidden rounded-full border-2 border-white/20 hover:border-(--accent) cursor-pointer transition-colors'>
          <img className='group-hover:brightness-75 transition-all w-full object-cover rounded-full' src={publicUser.headshot.url} />
        </div>
        <AnimatePresence>
          {
            open && 
            <motion.div ref={menuRef} className='absolute right-2 w-40 bg-[#151515] top-full rounded-sm flex flex-col drop-shadow-[0_-4px_8px_black] overflow-hidden' initial={{opacity: 0, height: 0}} animate={{opacity: 1, height: 56}} exit={{opacity: 0, height: 0}} transition={{duration: 0.2}}>
              <MenuOption onClick={() => handleLogout()} icon={<LogOut size={18} />}>Sign Out</MenuOption>
              <MenuOption onClick={() => handlePasswordReset()} icon={<RotateCcwKey size={18} />}>Reset Password</MenuOption>
            </motion.div>
          }
        </AnimatePresence>
      </div>
    </div>
  )

}


export function MenuOption({icon, onClick, children}) {
  return (
    <div onClick={onClick} className='w-full px-3 py-1 flex items-center justify-between text-sm cursor-pointer hover:bg-[#202020] transition-colors'>
      {children}
      {icon}
    </div>
  )
}
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate, useOutlet } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { AnimatePresence, motion } from "motion/react";
import { AdminHeader } from "../components/admin-header/AdminHeader";
import { AdminNavBar } from "../components/admin-nav-bar/AdminNavBar";
import { GetPublicUserData, GetUserData } from "../firebase_functions/UserData";


export function AdminLayout() {

  const [user, setUser] = useState(null);
  const [publicUser, setPublicUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();
  const outlet = useOutlet();


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async(currentUser) => {
      if(currentUser) {
        // Get private user
        const privateData = await GetUserData(currentUser.uid);
        setUser(privateData);

        // Get public user
        const publicData = await GetPublicUserData(privateData.public_uid);
        setPublicUser(publicData);
      } 
      else {
        setUser(null);
        setPublicUser(null);
      }
      setCheckingAuth(false);
    });

    return () => unsubscribe();
  }, []);


  useEffect(() => {
    if(!checkingAuth && (!user || !publicUser)) navigate('/login', {replace: true, state: { from: location }});
  }, [checkingAuth, user, publicUser, navigate]);



  return (
    <AnimatePresence mode='wait'>
      {
        (!user || !publicUser) 
         
        ? 
          <motion.div key='loading' initial={{opacity: 1, scale: 1}} exit={{opacity: 0, scale: 0.8}} transition={{duration: 0.25, delay: 0.2}} className='fixed inset-0 flex justify-center items-center'>
            <div className="w-8 h-8 border-2 border-[#444] border-t-(--accent) rounded-full animate-spin" />
          </motion.div>

        :
          <motion.div key='layout' initial={{opacity: 0}} animate={{opacity: 1}} transition={{duration: 0.25}} className='relative w-full'>
            
            <AdminHeader user={user} publicUser={publicUser} />

            <div className='md:mt-35 mt-30 w-full flex flex-col items-center'>
              <AnimatePresence mode='wait'>
                {
                  location.pathname.split('/').filter(Boolean).length > 1 && 
                  <motion.div key='admin-nav-bar' className='w-full flex flex-col items-center overflow-hidden not-md:-mt-6' initial={{opacity: 0, height: 0}} animate={{opacity: 1, height: 'auto'}} exit={{opacity: 0, height: 0}} transition={{duration: 0.2}}>
                    <AdminNavBar />
                  </motion.div>
                }
              </AnimatePresence>
              <AnimatePresence mode='wait'>
                <motion.div key={location.pathname} className='w-[90%] max-w-300' initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} transition={{duration: 0.1}}>
                  {outlet}
                </motion.div>
              </AnimatePresence>
            </div>

          </motion.div>
      }
    </AnimatePresence>
  )
}
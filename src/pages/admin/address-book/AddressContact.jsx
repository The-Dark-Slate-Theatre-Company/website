import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "../../../firebase";
import { DependentContent } from "../../../components/admin-dependent-content/DependentContent";
import { AddressContactViewer } from "./AddressContactViewer";
import { AnimatePresence, motion } from "motion/react";
import { AddressContactEditor } from "./AddressContactEditor";


export function AddressContact() {

  const [contact, setContact] = useState(null);
  const [editing, setEditing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const location = useLocation();
  const uid = location.pathname.split('/').filter(Boolean).pop();

  const navigate = useNavigate();


  const forceRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  }

  
  useEffect(() => {
    async function getContact() {
      const docRef = doc(db, 'address-book', uid);
      const snap = await getDoc(docRef);
      if(snap.data()) {
        const data = snap.data();
        setContact(data);
      }
      else navigate('/admin/address-book');
    }
    getContact()
  }, [refreshKey])



  return (
    <DependentContent dependency={contact}>
      {
        contact && 
        <AnimatePresence mode='wait'>
          <motion.div key={editing ? 'editor' : 'viewer'} initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} transition={{duration: 0.05}}>
            {
              editing 
              ? <AddressContactEditor contact={contact} setEditing={setEditing} forceRefresh={forceRefresh} />
              : <AddressContactViewer contact={contact} setEditing={setEditing} />
            }
          </motion.div>
        </AnimatePresence>
      }
    </DependentContent>
  )

}
import { useEffect, useState } from "react";
import { BackpageDescription } from "../../../components/admin-backpage-description/BackpageDescription";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import { DependentContent } from "../../../components/admin-dependent-content/DependentContent";
import { Eye, Link, Tag, X } from "lucide-react";
import { AnimatePresence, motion, Reorder } from "motion/react";
import { Footer } from "../../../components/footer/Footer";
import { SaveButton } from "../../../components/admin-save-button/SaveButton";
import { IconInput } from "../../../components/admin-draggable-list/IconInput";
import { DraggableList } from "../../../components/admin-draggable-list/DraggableList";
import { DraggableListItem } from "../../../components/admin-draggable-list/DraggableListItem";
import { AddListItemButton } from "../../../components/admin-draggable-list/AddListItemButton";


export function Resources() {

  const [resources, setResources] = useState(null);

  const [edited, setEdited] = useState(false);
  const [saving, setSaving] = useState(false);

  const [previewOpen, setPreviewOpen] = useState(false);


  const handleSave = async() => {
    setSaving(true);

    // Check all resources have a name and link
    resources.forEach((r) => {
      if(!r.name.trim().length || !r.link.trim().length) {
        alert('All resources must have a name and link');
        setSaving(false);
        return;
      }
    })

    try {
      const docRef = doc(db, 'site-data', 'resources');
      await setDoc(docRef, {items: resources}, {merge: true});
      setEdited(false);
    }
    catch(err) {
      console.error(err);
      alert('An error occurred. Please try again')
    }
    finally {
      setSaving(false);
    }
  }

  const updateResource = (id, field, value) => {
    setResources((prev) => 
      prev.map((resource) => 
        resource.uid === id 
          ? { ...resource, [field]: value }
          : resource
      )
    );
    setEdited(true);
  }

  const deleteResource = (id) => {
    setResources((prev) => prev.filter((r) => r.uid !== id));
    setEdited(true);
  }

  const addResource = () => {
    setResources((prev) => [...prev, {uid: Math.random().toString(36).substring(2, 12), name: '', link: ''}]);
    setEdited(true);
  }


  useEffect(() => {
    async function getResources() {
      const docRef = doc(db, 'site-data', 'resources');
      const snap = await getDoc(docRef);
      const data = snap.data();
      setResources(data.items);
    }
    getResources();
  }, [])


  return (
    <>
      <BackpageDescription>
        Resources are publicly available links to important documents.<br/>
        These appear in the footer of the website's frontpages.
      </BackpageDescription>

      <DependentContent dependency={resources}>
        {
          resources && 
          <div className='pb-24'> 
            <AnimatePresence>
              {
                previewOpen && 
                <motion.div
                  key='footer-card'
                  initial={{opacity: 0}}
                  animate={{opacity: 1}}
                  exit={{opacity: 0}}
                  transition={{duration: 0.1}}
                  className='fixed z-100 inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center'
                  onClick={() => setPreviewOpen(false)}
                >
                  <div onClick={(e) => e.stopPropagation()} className='relative w-[95%] max-w-300 bg-[#101010] p-12 rounded-xs drop-shadow-[0_0_4px_#000000dd]'>
                    <X onClick={() => setPreviewOpen(false)} className='absolute text-[#555] right-4 top-4 cursor-pointer' />
                    <div className='bg-black pt-0.5'>
                      <Footer resourcesOverride={resources} />
                    </div>
                  </div>
                </motion.div>
              }
            </AnimatePresence>

            <div className='mt-12 w-full flex justify-center'>
              <div onClick={() => setPreviewOpen(true)} className='bg-[#3498db] text-black rounded-full h-11 p-4 flex justify-center items-center gap-3 cursor-pointer hover:brightness-90 transition-all'>
                <Eye />
                <p>Preview</p>
              </div>
            </div>

            <AddListItemButton onClick={addResource}>Add Resource</AddListItemButton>

            <DraggableList values={resources} onReorder={(e) => {setResources(e); setEdited(true);}}>
              {
                resources.map((r, i) => 
                  <DraggableListItem key={r.uid} value={r} onDelete={() => deleteResource(r.uid)} >
                    <div className='grid md:grid-cols-[2fr_3fr] lg:grid-cols-[1fr_3fr] gap-3'>
                      <IconInput icon={<Tag size={18} />} placeholder='Name' value={r.name} onChange={(e) => updateResource(r.uid, 'name', e.target.value)} />
                      <IconInput icon={<Link size={18} />} placeholder='Link' value={r.link} onChange={(e) => updateResource(r.uid, 'link', e.target.value)} />
                    </div>
                  </DraggableListItem>
                )
              }
            </DraggableList>

          </div>
        }
      </DependentContent>
      <SaveButton visible={edited} saving={saving} handleSave={handleSave} />
    </>
  )
}



function ResourcesList({resources, updateResource, deleteResource, setResources, setEdited}) {

  return (
    <Reorder.Group 
      axis='y'
      values={resources}
      onReorder={(e) => {setResources(e); setEdited(true)}}
      className='flex flex-col gap-3 pb-24'
    >
      { resources.map((r, i) => 
        <Reorder.Item 
          key={r.uid}
          value={r}
          className='w-full grid items-center grid-cols-[1fr_30fr_1fr] gap-3 px-3 py-2 bg-[#151515] rounded-sm'
        >
          <GripHorizontal className='cursor-grab text-[#aaa]' />
          <div className='grid md:grid-cols-[2fr_3fr] lg:grid-cols-[1fr_3fr] gap-3'>
            <IconInput icon={<Tag size={18} />} placeholder='Name' value={r.name} onChange={(e) => updateResource(r.uid, 'name', e.target.value)} />
            <IconInput icon={<Link size={18} />} placeholder='Link' value={r.link} onChange={(e) => updateResource(r.uid, 'link', e.target.value)} />
          </div>
          <div className='flex justify-end items-center'>
            <Trash2 onClick={() => deleteResource(r.uid)} size={20} className='text-[#aaa] cursor-pointer hover:text-[#e74c3c] transition-colors' />
          </div>
        </Reorder.Item>
      )}
    </Reorder.Group>
  )
}
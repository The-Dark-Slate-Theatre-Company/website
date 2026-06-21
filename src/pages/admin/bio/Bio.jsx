import { useEffect, useRef, useState } from "react"
import { DependentContent } from "../../../components/admin-dependent-content/DependentContent";
import { GetPublicUserData, SetPublicUserData } from "../../../firebase_functions/UserData";
import { BookOpenText, Camera, Eye, FingerprintPattern, Moon, PenTool, TextInitial, User, Users, UserSquare, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { TeamCard } from "../../about/TeamCard";
import { ReplaceHeadshot } from "./ReplaceHeadshot";


export function Bio() {

  const [user, setUser] = useState(null);

  const [name, setName] = useState(null);
  const [bio, setBio] = useState(null);
  const [headshotPreview, setHeadshotPreview] = useState(null);
  const [headshotFile, setHeadshotFile] = useState(null);
  const fileInputRef = useRef(null);

  const [saving, setSaving] = useState(false);
  const [edited, setEdited] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [guidanceOpen, setGuidanceOpen] = useState(false);

  const [refreshKey, setRefreshKey] = useState(0);


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if(!file) return;
    setHeadshotFile(file);
    setHeadshotPreview(URL.createObjectURL(file));
    setEdited(true);
  }


  const handleSave = async() => {
    setSaving(true);
    try {
      const headshot = await ReplaceHeadshot(user.uid, user.headshot, headshotFile);
      const newUser = {
        headshot,
        name,
        bio
      }
      await SetPublicUserData(user.uid, newUser);
      setRefreshKey((prev) => prev + 1);
    }
    catch(err) {
      console.error(err);
      alert('Could not save. Please try again.')
    }
    finally {
      setSaving(false);
    }
  }


  useEffect(() => {
    async function getUser() {
      const user = await GetPublicUserData();
      console.log("Fetched", user);
      setName(user.name);
      setBio(user.bio);
      setHeadshotPreview(user.headshot.url ?? null);
      setUser(user);
      setHeadshotFile(null);
      setEdited(false);
    }
    getUser();
  }, [refreshKey]);



  return (
    <DependentContent dependencies={[user, name, bio]} >
      <AnimatePresence>
        {
          previewOpen && 
          <motion.div
            key='team-card'
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.1}}
            className='fixed z-100 inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center'
            onClick={() => setPreviewOpen(false)}
          >
            <TeamCard of={{
              headshot: {
                url: headshotPreview
              },
              name: name,
              role: user.role,
              founder: user.founder,
              bio: bio
            }} setSelected={(e) => setPreviewOpen(false)} />
          </motion.div>
        }
      </AnimatePresence>

      <AnimatePresence>
        {
          guidanceOpen && 
          <motion.div
            key='guidance'
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.1}}
            className='fixed z-100 inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center'
            onClick={() => setGuidanceOpen(false)}
          >
            <Guidance setOpen={setGuidanceOpen} />
          </motion.div>
        }
      </AnimatePresence>

      { user &&
        <div className='relative w-full flex justify-center'>
          <div className='max-w-100 lg:max-w-200 w-full grid lg:grid-cols-[1fr_2.5fr_0.2fr] mb-22 gap-8 lg:gap-12'>

            <div className='flex flex-col gap-2 items-center'>
              <input ref={fileInputRef} type='file' accept='image/*' className='hidden' onChange={handleImageChange} />
              <div onClick={() => fileInputRef.current.click()} className='group w-full not-lg:max-w-60 aspect-square overflow-hidden border border-white/20 rounded-sm cursor-pointer hover:border-(--accent) transition-colors'>
                <img className='group-hover:brightness-85 transition-all w-full h-full object-cover' src={headshotPreview} />
              </div>
              <p className='text-sm text-[#555] text-center'>Click on image to change</p>
            </div>

            <div className='flex flex-col gap-4'>
              <p className='font-donau tracking-widest text-xl pb-1 text-(--accent) mb-4 lg:mt-4 not-lg:text-center border-b-2 border-white/20'>{user.role}</p>
              <div>
                <p className='text-sm text-[#aaa] mb-0.5'>Full Name:</p>
                <input value={name} onChange={(e) => {setName(e.target.value); setEdited(true)}} className='w-full px-3 py-1 bg-[#101010] rounded-sm text-lg border border-white/20 focus:outline-none focus:border-(--accent)' />
              </div>
              <div>
                <p className='text-sm text-[#aaa] mb-0.5'>Bio:</p>
                <textarea value={bio} onChange={(e) => {setBio(e.target.value); setEdited(true)}} className='w-full h-60 px-3 py-1 bg-[#101010] rounded-sm text-lg border border-white/20 focus:outline-none focus:border-(--accent) leading-6' />
                <p style={{color: bio.length <= 500 ? '#aaa' : '#f39c12'}} className='text-end text-sm'>{bio.length} characters</p>
              </div>
            </div>

            <div>
              <div className='relative w-full lg:w-11 not-lg:h-11 flex lg:flex-col justify-center gap-1 bg-[#151515] rounded-full lg:mt-4'>
                <ToolbarIcon label='Preview' icon={<Eye />} colour='#3498db' onClick={() => setPreviewOpen(true)} />
                <ToolbarIcon label='Guidance' icon={<BookOpenText />} colour='#e67e22' onClick={() => setGuidanceOpen(true)} />
              </div>
            </div>

          </div>

          <AnimatePresence>
            {
              edited && 
              <motion.div 
                initial={{opacity: 0, bottom: -40}} 
                animate={{opacity: 1, bottom: 0}} 
                exit={{opacity: 0, bottom: -40}} 
                className='fixed z-10 bg-linear-to-t from-black to-transparent w-full flex justify-center'
              >
                <button onClick={handleSave} disabled={saving} className='min-w-50 not-lg:mb-4 mb-8 bg-(--accent) text-black uppercase font-bold tracking-wide text-xl px-12 py-2 rounded-sm drop-shadow-[0_0_2px_white] animate-[glow_2.5s_ease-in-out_infinite] not-disabled:cursor-pointer not-disabled:hover:scale-98 transition-all disabled:bg-[#555] disabled:animate-none disabled:drop-shadow-none'>
                  {saving ? 'saving...' : 'save'}
                </button>
              </motion.div>
            }
          </AnimatePresence>
        </div>
      }
    </DependentContent>
  )
}



function BioInput({value, onChange, children}) {
  return (
    <div>
      <p className='text-sm text-[#aaa] mb-0.5'>{children}</p>
      <input className='w-full px-3 py-1 bg-[#101010] rounded-sm text-lg border border-white/20 focus:outline-none focus:border-(--accent)' value={value} onChange={onChange} />
    </div>
  )
}


function ToolbarIcon({icon, label, colour, onClick}) {
  return (
    <div onClick={onClick} className='relative z-2 group rounded-full text-black w-11 h-11 flex justify-center items-center cursor-pointer hover:brightness-90 transition-all' style={{backgroundColor: colour}}>
      <div className='group-hover:rotate-360 z-3 transition-all duration-500'>{icon}</div>
      <div style={{backgroundColor: colour}} className='absolute z-1 left-1/2 max-w-0 lg:group-hover:max-w-50 h-11 flex items-center lg:group-hover:pl-8 lg:group-hover:pr-4 rounded-r-full overflow-hidden transition-all duration-500'>
        <p className='opacity-0 lg:group-hover:opacity-100 transition-all duration-250 whitespace-nowrap'>{label}</p>
      </div>
    </div>
  )
}


function Guidance({setOpen}) {

  function Point({icon, children}) {
    return (
      <div className='w-full flex gap-7 items-start text-lg leading-5.5'>
        <div className='mt-0.2'>{icon}</div>
        <p>{children}</p>
      </div>
    )
  }

  return (
    <div onClick={(e) => e.stopPropagation()} className='relative w-[95%] max-w-200 max-h-[95%] overflow-y-auto bg-[#101010] p-8 rounded-xs drop-shadow-[0_0_4px_#000000dd]'>
      <X onClick={() => setOpen(false)} className='absolute text-[#555] right-4 top-4 cursor-pointer' />
      <h1 className='text-2xl tracking-widest border-b-2 pb-2 border-[#555]'>Bio Guidance</h1>
      <p className='font-bold text-lg tracking-widest mt-8'>Your bio should be:</p>
      <div className='flex flex-col gap-4 ml-4 mt-4 text-[#ccc]'>
        <Point icon={<TextInitial />}>Less than 500 characters long</Point>
        <Point icon={<Users />}>In the third person (he/she/they)</Point>
        <Point icon={<PenTool />}>Clearly written and professional. Stay clear of emojis :)</Point>
        <Point icon={<FingerprintPattern />}>About you! What do you get up to inside and/or outside of Dark Slate - professionally or otherwise</Point>
      </div>
      <hr className='opacity-50 my-8' />
      <p className='font-bold text-lg tracking-widest mt-8'>Your headshot should:</p>
      <div className='flex flex-col gap-4 ml-4 mt-4 text-[#ccc]'>
        <Point icon={<Camera />}>Be a clear photo of you, with nobody else in frame</Point>
        <Point icon={<UserSquare />}>Be in a headshot style (it does not need to be a professional headshot)</Point>
        <Point icon={<Moon />}>Have a plain, ideally dark background to match the website</Point>
      </div>
    </div>
  )
}
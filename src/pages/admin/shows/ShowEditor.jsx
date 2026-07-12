import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { useLocation, useNavigate } from "react-router-dom";
import { DependentContent } from "../../../components/admin-dependent-content/DependentContent";
import { Eye, FilePenLine, IndentIncrease, Tickets, UsersRound, X } from "lucide-react";
import { ShowPage } from "./ShowPage";
import { Performances } from "./Performances";
import { Listing } from "./Listing";
import { Credits } from "./Credits";
import { Uid10 } from "../../../components/uid-10/Uid10";
import { SaveButton } from "../../../components/admin-save-button/SaveButton";
import { handleShowSave } from "./handleShowSave";
import { AnimatePresence, motion } from "motion/react";
import { ShowViewerLayout } from "../../../layouts/ShowViewerLayout";


export function ShowEditor() {

  const [show, setShow] = useState(null);
  const [tab, setTab] = useState('show-page');

  const [pagePreviewOpen, setPagePreviewOpen] = useState(false);

  const [edited, setEdited] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveProgress, setSaveProgress] = useState(null);
  const [saveProgressLabel, setSaveProgressLabel] = useState('');

  const [pastShowImages, setPastShowImages] = useState(null);
  const [whatsOnImages, setWhatsOnImages] = useState(null);
  const IMAGE_ORDER = ['large', 'medium', 'small'];

  const [showPageImages, setShowPageImages] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const initialUid = location.pathname.split('/').pop();

  useEffect(() => {
    async function getShow() {
      let data;
      if(initialUid === 'new-show') {
        data = newShow;
      }
      else {
        const docRef = doc(db, 'shows', initialUid)
        const snap = await getDoc(docRef);
        if(!snap.exists()) navigate('/admin/shows');
        else data = snap.data();
      }
      setShow(data);

      // Copy past show images
      setPastShowImages({
        thumbnail: { preview: data.past_show.thumbnail.url, file: null }
      })

      // Copy Whats On images
      const initialWhatsOnImages = {
        large: {  
          preview: data.whats_on.photos.large.url?.length ? data.whats_on.photos.large.url : null, 
          file: null,
          inherited: false
        },
        medium: { 
          preview: data.whats_on.photos.medium.url?.length ? data.whats_on.photos.medium.url : null, 
          file: null,
          inherited: false
        },
        small: { 
          preview: data.whats_on.photos.small.url?.length ? data.whats_on.photos.small.url : null, 
          file: null,
          inherited: false
        }
      }
      setWhatsOnImages(normaliseWhatsOnImages(initialWhatsOnImages));

      // Copy Show Page images
      setShowPageImages(buildShowPageImages(data.show_page.content));
    }
    getShow();
  }, []);


  function normaliseWhatsOnImages(images) {
    let lastReal = null;

    return IMAGE_ORDER.reduce((acc, size) => {
      const current = images[size];
      const hasOwnImage = current.file || current.preview;

      if(hasOwnImage && !current.inherited) {
        lastReal = current;
        acc[size] = { ...current, inherited:false };
      }
      else if(lastReal) {
        acc[size] = {
          ...current,
          preview: lastReal.preview,
          file: null,
          inherited: true,
        };
      }
      else {
        acc[size] = {
          ...current,
          preview: null,
          file: null,
          inherited: false
        };
      }
      return acc
    }, {});
  }

  function updateWhatsOnImages(size, patch) {
    setWhatsOnImages(prev => {
      const next = {
        ...prev,
        [size]: {
          ...prev[size],
          ...patch,
          inherited: false
        }
      };
      return normaliseWhatsOnImages(next);
    });
    setEdited(true);
  }

  function buildShowPageImages(content=[]) {
    return content.reduce((acc, section) => {
      if(section.type === 'header') {
        acc[section.uid] = {
          preview: section.url,
          storage: section.storage,
          file: null
        };
      }
      if (section.type === 'gallery') {
        acc[section.uid] = {
          images: (section.images || []).map(img => ({
            uid: img.uid,
            preview: img.url,
            storage: img.storage,
            caption: img.caption,
            file: null
          })),
        };
      }

      return acc;
    }, {});
  }


  return (
    <DependentContent dependencies={[show, pastShowImages, whatsOnImages, showPageImages]}>
      {
        show && 
        <>
          <AnimatePresence>
            {
              pagePreviewOpen && 
              <motion.div 
                initial={{opacity: 0.5, y: 1000}} animate={{opacity: 1, y: 0}} exit={{opacity: 0.5, y: 1000}} transition={{duration: 0.25}} 
                className='fixed inset-0 bg-black z-105 drop-shadow-[0_4px_8px_white] overflow-y-auto'
              >
                <div className='w-full sticky top-0 z-100 flex items-center justify-between px-4 md:px-8 h-20 bg-black/60 backdrop-blur-lg border-b border-(--accent)'>
                  <h1 className='font-donau text-4xl tracking-wide'>Preview</h1>
                  <X size={30} onClick={() => setPagePreviewOpen(false)} className='text-white hover:brightness-80 cursor-pointer' />
                </div>
                <div className='w-full bg-black pb-12 -mt-20'>
                  <ShowViewerLayout preview={show} showImages={showPageImages} />
                </div>
              </motion.div>
            }
          </AnimatePresence>
          <div className='pb-24'>
            <LargePreviewButton setPagePreviewOpen={setPagePreviewOpen} />
            <div className='w-full flex justify-center mb-8'>
              <EditorNavBar tab={tab} setTab={setTab} />
            </div>
            {
              tab === 'show-page' 
              ? <ShowPage 
                  show={show} 
                  setShow={setShow} 
                  edited={edited} 
                  setEdited={setEdited} 
                  setTab={setTab}
                  showPageImages={showPageImages}
                  setShowPageImages={setShowPageImages}
                />
              : tab === 'performances' 
              ? <Performances 
                  show={show} 
                  setShow={setShow} 
                  setEdited={setEdited} 
                  setTab={setTab}
                />
              : tab === 'credits' 
              ? <Credits 
                  show={show}
                  setShow={setShow}
                  setEdited={setEdited}
                  setTab={setTab}
                />
              : <Listing 
                  show={show} 
                  initialUid={initialUid}
                  setShow={setShow} 
                  setEdited={setEdited} 
                  pastShowImages={pastShowImages} 
                  setPastShowImages={setPastShowImages} 
                  whatsOnImages={whatsOnImages}
                  updateWhatsOnImages={updateWhatsOnImages}
                />
            }
          </div>
          <SaveButton 
            visible={edited} 
            saving={saving} 
            progress={saveProgress} 
            handleSave={() => 
              handleShowSave(
                show, pastShowImages, whatsOnImages, showPageImages, setSaving, setSaveProgress, navigate
              )
            }
          />
        </>
      }
    </DependentContent>
  )

}


function EditorNavBar({tab, setTab}) {

  function EditorNavItem({icon, to, children}) {
    return (
      <div onClick={() => setTab(to)} className={`w-full flex justify-center items-center text-sm text-nowrap overflow-hidden text-ellipsis px-6 py-2 gap-3 transition-all ${
        (tab === to) ? 'cursor-default bg-[#0a0a0a] text-(--accent)' : 'text-[#aaa] hover:text-white bg-transparent hover:bg-[#202020] cursor-pointer'
      }`}>
        <div className='shrink-0'>
          {icon}
        </div>
        <p className={`uppercase tracking-wide transition-colors border-b mt-1 not-md:hidden ${(tab === to) ? 'border-(--accent)' : 'border-transparent'}`}>{children}</p>
      </div>
    )
  }

  return (
    <div className='rounded-sm bg-[#101010] grid grid-cols-4 overflow-hidden'>
      <EditorNavItem to='show-page' icon={<FilePenLine size={15} />}>Show Page</EditorNavItem>
      <EditorNavItem to='performances' icon={<Tickets size={15} />}>Performances</EditorNavItem>
      <EditorNavItem to='credits' icon={<UsersRound size={15} />}>Credits</EditorNavItem>
      <EditorNavItem to='listing' icon={<IndentIncrease size={15} />}>Listing</EditorNavItem>
    </div>
  )
}


export function ShowEditorSection({label, children, last=false}) {
  return (
    <div className={`w-full gap-4`}>
      <h1 className='text-[#777] tracking-wider text-xl mb-5 font-bold'>{label}</h1>
      <div className='w-full md:w-[calc(100%-32px)] md:ml-8 flex flex-col gap-4'>
        {children}
      </div>
      {!last && <hr className='mt-11 mb-6 opacity-20' />}
    </div>
  )
}


export function IconToggle({falseIcon=null, falseColour, falseLabel, trueIcon=null, trueColour, trueLabel, value, onChange}) {

  return (
    <div className='flex gap-4 items-center'>
      <div onClick={onChange} style={{backgroundColor: value ? `${trueColour}55` : `${falseColour}55`}} className='relative group transition-colors w-13 h-7 rounded-full border-white/20 border -mt-2.5 cursor-pointer'>
        <div className={`absolute top-1/2 -translate-y-1/2 flex items-center justify-center text-black w-5 h-5 rounded-full bg-[#ccc] group-hover:bg-white transition-all ${ !value ? 'left-0.75' : 'left-[calc(100%-3px)] -translate-x-full' }`} />
      </div>
      <div style={{color: value ? trueColour : falseColour}} className='-mt-2.5'>
        {
          value 
          ? trueIcon
          : falseIcon
        }
      </div>
      <p style={{color: value ? trueColour : falseColour}} className='text-sm -mt-2.5 -ml-2'>
        {
          value 
          ? trueLabel
          : falseLabel
        }
      </p>
    </div>
  )

}


function LargePreviewButton({setPagePreviewOpen}) {
  return (
    <motion.div 
      onClick={() => setPagePreviewOpen(true)}
      initial={{x: -80, opacity:0}} animate={{x: 0, opacity:1}} transition={{duration: 0.5, type:'spring'}} whileHover={{scale: 1.05}} whileTap={{scale: 0.7}}
      className='fixed z-101 left-4 md:left-8 not-md:top-6 md:bottom-8 w-12 h-12 rounded-full bg-[#3498db] text-black flex justify-center items-center cursor-pointer hover:brightness-90'
    >
      <Eye />
    </motion.div>
  )
}


// NEW SHOW

const newShow = {

  name: 'New Show',
  uid: 'new-show',

  public: false,
  currently_showing: true,
  accent_colour: null,

  past_show: {
    short_description: '',
    thumbnail: {
      storage: null,
      url: null
    }
  },
  whats_on: {
    banner: '',
    photos: {
      large: {storage: null, url: ''},
      medium: {storage: null, url: ''},
      small: {storage: null, url: ''}
    }
  },

  performances: [],
  credits: [],

  show_page: {
    content: []
  }

}
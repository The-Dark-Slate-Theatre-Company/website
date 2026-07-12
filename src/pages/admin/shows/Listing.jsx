import { CalendarCheck, CalendarClock, Eye, EyeClosed, RotateCcw, Tickets, Trash2, X } from "lucide-react";
import { AdminInput, adminInputClass, AdminInputLabel } from "../../../components/admin-input/AdminInput";
import { Slugify } from "../../../components/slugify/Slugify";
import { updateField, updateNestedField } from "../../../components/update-field/UpdateField";
import { IconToggle, ShowEditorSection } from "./ShowEditor";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { PastShowTile, WhatsOnTile } from "../../shows/Shows";
import { handleShowDelete } from "./handleShowDelete";
import { useNavigate } from "react-router-dom";


export function Listing({show:s, initialUid, setShow, pastShowImages, setPastShowImages, whatsOnImages, updateWhatsOnImages, setEdited}) {

  const [previewOpen, setPreviewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteText, setDeleteText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [deleteProgress, setDeleteProgress] = useState(0);

  const navigate = useNavigate();

  const defaultColour = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
  

  return (
    <>
      <AnimatePresence>
        {
          previewOpen && 
          <motion.div
            key='footer-card'
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.1}}
            className='fixed z-200 inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center'
            onClick={() => setPreviewOpen(false)}
          >
            <div onClick={(e) => e.stopPropagation()} className='relative bg-[#101010] py-12 rounded-xs drop-shadow-[0_0_4px_#000000dd] w-[90%] md:w-[80%] lg:w-[75%]'>
              <X onClick={() => setPreviewOpen(false)} className='absolute text-[#555] right-4 top-4 cursor-pointer' />
              <div className='w-full flex justify-center'>
                { s.currently_showing
                  ? <div className='flex w-full h-full justify-center bg-[#050505]] 2xl:px-4'>
                      <WhatsOnTile disabled show={{
                        ...s,
                        whats_on: {
                          ...s.whats_on,
                          photos: {
                            large: { url: whatsOnImages.large.preview },
                            medium: { url: whatsOnImages.medium.preview },
                            small: { url: whatsOnImages.small.preview }
                          }
                        }
                      }} />
                    </div>
                  : <div className='flex justify-center bg-[#050505] w-[90%]'>
                      <div className='relative flex justify-center w-70 md:w-140 lg:w-210 py-4 not-md:pb-8'>
                        <PastShowTile disabled show={{
                          ...s,
                          past_show: {
                            ...s.past_show,
                            thumbnail: {url: pastShowImages.thumbnail.preview}
                          }
                        }} />
                      </div>
                    </div>
                }
              </div>
            </div>
          </motion.div>
        }
      </AnimatePresence>

      <div className='w-full'>
        <ShowEditorSection label='Show Details'>
          <AdminInput label='Name' value={s.name} onChange={(e) => {
            if(Slugify(s.name) === s.uid) updateField('uid', Slugify(e.target.value), setShow, setEdited);
            updateField('name', e.target.value, setShow, setEdited)}
          } />
          <div>
            <AdminInput label='UID' value={s.uid} onChange={(e) => updateField('uid', Slugify(e.target.value), setShow, setEdited)} />
            <p className='text-[#999] text-end text-xs md:text-sm'>Show page: <span className='text-[#aaa]'>darkslatetheatre.com/shows/{s.uid.trim()}</span></p>
          </div>
          <div>
            <AdminInputLabel label='Page Accent Colour' />
            <div className='flex gap-3 items-center'>
              <label
                className="block w-10 h-10 rounded-full border border-white/30 cursor-pointer"
                style={{ backgroundColor: s.accent_colour ?? defaultColour }}
              >
                <input
                  type="color"
                  className="sr-only"
                  value={s.accent_colour}
                  onChange={(e) =>
                    updateField('accent_colour', e.target.value, setShow, setEdited)
                  }
                />
              </label>
              <p style={{color: s.accent_colour || defaultColour}}>{s.accent_colour || <i>Default</i>}</p>
              <div title='Reset accent colour' onClick={() => updateField('accent_colour', null, setShow, setEdited)} className='text-[#777] hover:text-[#eee] transition-colors cursor-pointer ml-4'>
                <RotateCcw size={20} />
              </div>
            </div>
          </div>
        </ShowEditorSection>

        <ShowEditorSection label='Visibility'>
          <AdminInputLabel label='Page Visibility' />
          <IconToggle 
            value={s.public} 
            trueColour='#2ecc71' falseColour='#e74c3c' 
            trueIcon={<Eye size={24} />} falseIcon={<EyeClosed size={24} />} 
            trueLabel='Public' falseLabel='Private'
            onChange={() => updateField('public', !s.public, setShow, setEdited)} 
          />
          <p className='text-[#999] ml-25 text-sm -mt-5 italic'>
            {s.public 
              ? `${s.name} is public on the Dark Slate website, and can be seen by visitors.`
              : `${s.name} is private, and cannot be seen by visitors.`
            }
          </p>
          <AdminInputLabel label='Currently Showing' />
          <IconToggle 
            value={s.currently_showing} 
            trueColour='#e67e22' falseColour='#3498db' 
            trueIcon={<CalendarClock size={24} />} falseIcon={<CalendarCheck size={24} />} 
            trueLabel='Has Upcoming Performances' falseLabel='No Upcoming Performances'
            onChange={() => updateField('currently_showing', !s.currently_showing, setShow, setEdited)} 
          />
          <p className='text-[#999] ml-25 text-sm -mt-5 italic'>
            {s.currently_showing 
              ? `${s.name} will appear in the 'Whats On' section of the website.`
              : `${s.name} will appear in the 'Past Shows' section of the website.`
            }
          </p>
        </ShowEditorSection>

        <ShowEditorSection label='Listing' last={initialUid === 'new-show'}>
          <AnimatePresence mode='wait'>
            {
              s.currently_showing 
              ? <motion.div key='whats-on' initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} transition={{duration: 0.1}} className='w-full'>
                  <div className='flex flex-wrap justify-center gap-8 mb-10'>
                    <ImageInput 
                      label='Large [2.5:1]' 
                      field='large'
                      value={whatsOnImages.large.preview} 
                      maxW='max-w-120' 
                      aspect='aspect-2.5/1'
                      updateWhatsOnImages={updateWhatsOnImages}
                    />
                    <ImageInput 
                      label='Medium [2:1] (optional)' 
                      field='medium'
                      value={whatsOnImages.medium.preview} 
                      inherited={whatsOnImages.medium.inherited}
                      canDelete
                      maxW='max-w-96' 
                      aspect='aspect-2/1'
                      updateWhatsOnImages={updateWhatsOnImages}
                    />
                    <ImageInput 
                      label='Mobile [7:8] (optional)' 
                      field='small'
                      value={whatsOnImages.small.preview} 
                      inherited={whatsOnImages.small.inherited}
                      canDelete
                      maxW='max-w-42' 
                      aspect='aspect-7/8'
                      updateWhatsOnImages={updateWhatsOnImages}
                    />
                  </div>
                  <AdminInput label='Banner Text (optional)' value={s.whats_on.banner} onChange={(e) => updateNestedField('whats_on', 'banner', e.target.value, setShow, setEdited)} />
                </motion.div>
              : <motion.div key='past' initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} transition={{duration: 0.1}} className='w-full'>
                  <div className='flex flex-wrap justify-center gap-10 mb-10'>
                    <ImageInput 
                      label='Thumbnail [7:8]' 
                      field='thumbnail'
                      value={pastShowImages.thumbnail.preview} 
                      maxW='max-w-63.25' 
                      aspect='aspect-7/8'
                      setValue={setPastShowImages}
                      setEdited={setEdited}
                    />
                  </div>
                  
                  <div>
                    <AdminInputLabel label='Short Description' />
                    <textarea className={`${adminInputClass} min-h-20 leading-5.5`} value={s.past_show.short_description} onChange={(e) => updateNestedField('past_show', 'short_description', e.target.value, setShow, setEdited)} />
                    <p style={{color: s.past_show.short_description.length <= 120 ? '#aaa' : '#ff7675'}} className='text-end text-sm'>{s.past_show.short_description.length}/120 characters</p>
                  </div>
                </motion.div>
            }
          </AnimatePresence>
          <div className='w-full flex justify-center'>
            <div onClick={() => setPreviewOpen(true)} className='bg-[#3498db] text-black rounded-full h-11 p-4 flex justify-center items-center gap-3 cursor-pointer hover:brightness-90 transition-all'>
              <Eye />
              <p>Preview</p>
            </div>
          </div>
        </ShowEditorSection>

        {
          !(initialUid === 'new-show') && 
          <ShowEditorSection label='Manage Show' last>
            <p className='text-[#eee]'>
              <span className='text-[#e74c3c] font-bold'>DANGER!</span> Once deleted, shows are non-recoverable.<br/>
              Click the button below to proceed with deleting this show.<br/>
              You will be asked to confirm your decision first.
            </p>
            <button onClick={() => setDeleteOpen(true)} className='w-full max-w-35 border-2 border-[#e74c3c] hover:bg-[#e74c3c] text-[#e74c3c] hover:text-black hover:opacity-100 opacity-80 font-bold px-6 py-2 rounded-sm transition-all cursor-pointer'>
              Delete Show
            </button>
          </ShowEditorSection>
        }
      </div>

      <AnimatePresence>
        {
          deleteOpen && 
          <motion.div
            key='delete-card'
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.1}}
            className='fixed z-200 inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center'
            onClick={() => {if(!deleting) setDeleteOpen(false)}}
          >
            <div onClick={(e) => e.stopPropagation()} className='relative w-[95%] max-w-120 flex flex-col items-center bg-[#101010] px-4 py-8 rounded-xs drop-shadow-[0_0_4px_#000000dd]'>
              <X onClick={() => {if(!deleting) setDeleteOpen(false)}} className='absolute text-[#555] right-4 top-4 cursor-pointer' />
              <h1 className='text-2xl text-center uppercase tracking-wide my-4'>Delete '{s.name}'</h1>
              <p className='text-[#aaa] text-center'>Type <span className='text-[#e74c3c] font-bold'>DELETE</span> to permanently delete this show</p>
              <p className='text-[#aaa] text-center'>This action <u>cannot</u> be undone</p>
              <form className='w-full flex flex-col items-center' onSubmit={(e) => {e.preventDefault(); handleShowDelete(initialUid, setDeleting, setDeleteProgress, navigate)}}>
                <input className='w-full max-w-100 bg-black px-3 py-2 mt-4 rounded-sm border border-white/20 text-center text-[#ccc] focus:outline-none focus:border-(--accent) transition-colors' value={deleteText} onChange={(e) => setDeleteText(e.target.value)} />
                <button disabled={deleting || deleteText.trim().toLowerCase() !== 'delete'} type='submit' style={{backgroundColor: (deleting || deleteText.trim().toLowerCase() !== 'delete') ? '#444' : '#e74c3c'}} className='px-10 py-2 uppercase text-black font-bold mt-4 rounded-sm not-disabled:cursor-pointer'>{deleting ? 'Deleting...' : 'Delete'}</button>
              </form>
              <div className='absolute bottom-0 w-full flex justify-center'>
                <div className='relative w-full h-1 overflow-hidden'>
                  <div style={{width: `${deleteProgress}%`}} className='absolute h-full left-0 transition-all bg-[#e74c3c]' />
                </div>
              </div>
            </div>
          </motion.div>
        }
      </AnimatePresence>
    </>
  )

}



function ImageInput({label, field, value, inherited=false, canDelete=false, maxW, aspect, setValue, setEdited, updateWhatsOnImages=null}) {

  const fileInputRef = useRef(null);

  const handleImageRemove = () => {
    if(updateWhatsOnImages !== null) {
      updateWhatsOnImages(field, {file: null, preview: null});
    }
    else {
      updateField(field, { file: null, url: null }, setValue, setEdited);
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if(!file) return;
    if(updateWhatsOnImages !== null) {
      updateWhatsOnImages(field, {file, preview: URL.createObjectURL(file)});
    }
    else {
      updateField(field, { file, preview: URL.createObjectURL(file) }, setValue, setEdited);
    }
  }

  return (
    <div className={`w-full ${maxW}`}>
      <AdminInputLabel label={label} />
      <div onClick={() => fileInputRef.current.click()} className={`${aspect} relative w-full border-white/20 hover:border-(--accent) cursor-pointer border rounded-sm overflow-hidden flex justify-center items-center transition-all`}>
        <input ref={fileInputRef} type='file' accept='image/*' className='hidden' onChange={handleImageChange} />
        { value
          ? <img className='w-full h-full object-cover' src={value} />
          : <div className='w-full h-full object-cover bg-[#151515]' />
        }
        {inherited && <p className='absolute w-full py-1 px-1 bg-linear-to-t from-black to-transparent bottom-0 text-[10px] text-end text-[#aaa]'>Image inherited from larger size</p>}
      </div>
      <p className='text-[#999] text-center mt-1 text-xs md:text-sm'>Click to change {(canDelete && value && !inherited) && <u className='text-white ml-1 cursor-pointer' onClick={handleImageRemove}>(remove)</u>}</p>
    </div>
  )
}
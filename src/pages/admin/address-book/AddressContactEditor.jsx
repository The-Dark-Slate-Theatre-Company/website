import { Mail, Phone, PlusCircle, Tag, User, X } from "lucide-react";
import { useRef, useState } from "react"
import { GetAllContactTypes, GetContactType } from "./GetContactType";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, Reorder, motion } from "motion/react";
import { DraggableList } from "../../../components/admin-draggable-list/DraggableList";
import { DraggableListItem } from "../../../components/admin-draggable-list/DraggableListItem";
import { IconInput, IconlessInput } from "../../../components/admin-draggable-list/IconInput";
import { AddListItemButton } from "../../../components/admin-draggable-list/AddListItemButton";
import { SaveButton } from "../../../components/admin-save-button/SaveButton";
import { collection, deleteDoc, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { db, storage } from "../../../firebase";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";



export function AddressContactEditor({contact=blankContact, setEditing, forceRefresh}) {

  const [c, setC] = useState(contact);
  const [edited, setEdited] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteText, setDeleteText] = useState('');
  const [deleting, setDeleting] = useState(false);

  const [photoPreview, setPhotoPreview] = useState(c.photo.url);
  const [photoFile, setPhotoFile] = useState(null);
  const fileInputRef = useRef(null);

  const allTypes = GetAllContactTypes();
  const type = GetContactType(c.type, 30);
  const navigate = useNavigate();


  const handleSave = async() => {
    setSaving(true);

    // If a name hasn't been given, exit
    if(
      (c.type === 'individual' && !(c.first_name.trim().length && c.last_name.trim().length)) ||
      (c.type !== 'individual' && !c.org_name.trim().length)
    ) {
      alert('Contact must have a name');
      setSaving(false);
      return;
    }

    // If a company role has been given, but no company name, exit
    if(c.type === 'individual' && c.company.role.trim().length && !c.company.name.trim().length) {
      alert('A company role is provided, but no company name')
      setSaving(false);
      return;
    }

    // If a social media handle includes the full URL, exit
    if(c.social.instagram.includes('instagram.com') || c.social.facebook.includes('facebook.com')) {
      alert('Social media handles should include just the username, not the full URL')
      setSaving(false);
      return;
    }

    const uid = CreateContactUID(c);
    const searchIndex = CreateContactUID(c, true);

    const deleteOldContact = (contact.uid && uid !== contact.uid);

    if(uid === 'new-contact') {
      alert('Invalid Name')
      setSaving(false);
      return;
    }

    if(deleteOldContact) {
      // Check if this UID is already taken
      console.log("UID has changed");
      console.log("Checking for duplicates...");
      const q = query(collection(db, 'address-book'), where('uid', '==', uid));
      const snaps = await getDocs(q);
      if(snaps.docs.length) {
        console.log("Duplicate found.");
        alert('A contact with this name already exists');
        setSaving(false);
        return;
      }
    }
    
    try {
      const photo = await ReplacePhoto(contact.photo, photoFile);
      const newContact = {
        ...c,
        uid,
        photo,
        search_index: searchIndex,
        first_name: c.type === 'individual' ? c.first_name : '',
        last_name: c.type === 'individual' ? c.last_name : '',
        org_name: c.type !== 'individual' ? c.org_name : '',
        company: c.type === 'individual' ? c.company : {name: '', role: ''}
      }
      console.log("Uploading new contact details:", newContact);
      const docRef = doc(db, 'address-book', uid);
      await setDoc(docRef, newContact, {merge: true});

      if(deleteOldContact) {
        console.log("Deleting old contact:", contact);
        const deleteRef = doc(db, 'address-book', contact.uid);
        await deleteDoc(deleteRef);
      }
      
      if(deleteOldContact || !contact.uid) navigate(`/admin/address-book/${uid}`)
      else forceRefresh();

      setEdited(false);
      setSaved(true);
    }
    catch(err) {
      console.error(err);
      alert('An error occurred. Please try again');
    }
    finally {
      setSaving(false);
    }
  }


  const handleOpenDelete = () => {
    setDeleteText('');
    setDeleteOpen(true);
  }


  const handleDelete = async() => {
    
    if(deleteText.trim().toLowerCase() !== 'delete') return;

    setDeleting(true);

    try {
      if(contact.photo.storage) await deleteObject(ref(storage, contact.photo.storage));
      const deleteRef = doc(db, 'address-book', contact.uid);
      await deleteDoc(deleteRef);
      navigate('/admin/address-book');
    }
    catch(err) {
      alert('Could not delete contact. Please try again.');
      console.error(err);
      setDeleting(false);
    }
  }


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if(!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
    setEdited(true);
  }

  const updateField = (field, value) => {
    setC((prev) => ({
      ...prev,
      [field]: value
    }))
    setEdited(true);
  }

  const updateNestedField = (parent, field, value) => {
    setC((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value,
      },
    }));
    setEdited(true);
  }

  const addListItem = (field, defaultValue) => {
    setC((prev) => (
      {
        ...prev,
        [field]: [...prev[field], defaultValue]
      }
    ))
    setEdited(true);
  }

  const updateListItem = (field, id, value, nestedField='data') => {
    setC((prev) => (
      {
        ...prev,
        [field]: prev[field].map((item) => 
          item.uid === id 
          ? { ...item, [nestedField]: value }
          : item
        )
      }
    ));
    setEdited(true);
  }

  const deleteListItem = (field, id) => {
    setC((prev) => (
      {
        ...prev,
        [field]: prev[field].filter((x) => x.uid !== id)
      }
    ))
    setEdited(true);
  }


  return (
    <>
      <AnimatePresence>
        {
          deleteOpen && 
          <motion.div
            key='delete-card'
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.1}}
            className='fixed z-100 inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center'
            onClick={() => {if(!deleting) setDeleteOpen(false)}}
          >
            <div onClick={(e) => e.stopPropagation()} className='relative w-[95%] max-w-120 flex flex-col items-center bg-[#101010] px-4 py-8 rounded-xs drop-shadow-[0_0_4px_#000000dd]'>
              <X onClick={() => {if(!deleting) setDeleteOpen(false)}} className='absolute text-[#555] right-4 top-4 cursor-pointer' />
              <div className='w-30 border border-white/20 aspect-square overflow-hidden rounded-full flex justify-center items-center'>
                {
                  photoPreview 
                  ? <img src={photoPreview} className='w-full h-full object-cover' />
                  : <User size={40} className='text-[#555]' />
                }
              </div>
              <h1 className='text-2xl text-center uppercase tracking-wide my-4'>Delete Contact</h1>
              <p className='text-[#aaa] text-center'>Type <span className='text-[#e74c3c] font-bold'>DELETE</span> to permanently remove this contact</p>
              <p className='text-[#aaa] text-center'>This action <u>cannot</u> be undone</p>
              <form className='w-full flex flex-col items-center' onSubmit={(e) => {e.preventDefault(); handleDelete()}}>
                <input className='w-full max-w-100 bg-black px-3 py-2 mt-4 rounded-sm border border-white/20 text-center text-[#ccc] focus:outline-none focus:border-(--accent) transition-colors' value={deleteText} onChange={(e) => setDeleteText(e.target.value)} />
                <button disabled={deleting || deleteText.trim().toLowerCase() !== 'delete'} type='submit' style={{backgroundColor: (deleting || deleteText.trim().toLowerCase() !== 'delete') ? '#444' : '#e74c3c'}} className='px-10 py-2 uppercase text-black font-bold mt-4 rounded-sm not-disabled:cursor-pointer'>{deleting ? 'Deleting...' : 'Delete'}</button>
              </form>
            </div>
          </motion.div>
        }
      </AnimatePresence>

      <div className='relative flex not-md:flex-col gap-8 pb-26'>
        <div onClick={() => {
          if(!contact.uid) navigate('/admin/address-book');
          else setEditing(false)
        }} className='absolute top-0 md:top-2 right-0 text-[#aaa] hover:text-white transition-colors cursor-pointer underline'>{saved ? 'Done' : 'Cancel'}</div>
        <div className='w-35 not-md:w-full not-md:mt-6 flex flex-col items-center md:shrink-0'>
          <input ref={fileInputRef} type='file' accept='image/*' className='hidden' onChange={handleImageChange} />
          <div onClick={() => fileInputRef.current.click()} className='w-full h-35 not-md:max-w-35 aspect-square overflow-hidden flex justify-center items-center border border-white/20 hover:border-(--accent) hover:brightness-90 cursor-pointer transition-all duration-100 rounded-full'>
            {
              photoPreview 
              ? <img src={photoPreview} className='w-full h-full object-cover' />
              : <User size={60} className='text-[#555]' />
            }
          </div>
          <p className='text-sm text-[#555] text-center mt-2 leading-4'>Click on image to change</p>
          {
            contact.uid 
            ? <button onClick={() => setDeleteOpen(true)} className='w-full max-w-35 border-2 border-[#e74c3c] hover:bg-[#e74c3c] text-[#e74c3c] hover:text-black hover:opacity-100 opacity-60 font-bold mt-6 mb-6 px-3 py-1 rounded-sm transition-all cursor-pointer'>Delete Contact</button>
            : null
          }
        </div>

        <div className='md:mt-6 w-full flex flex-col gap-2'>

          <p className='text-sm text-[#aaa] mb-0.5'>Contact Type:</p>
          <div className='grid grid-cols-[1fr_30fr] items-center gap-4'>
            <div className='w-11 h-11 p-1.5 flex justify-center items-center text-black rounded-full' style={{backgroundColor: type.colour}}>{type.icon}</div>
            <select value={c.type} onChange={(e) => updateField('type', e.target.value)} className='bg-[#101010] text-lg px-3 py-2 rounded-sm border border-white/20 focus:outline-none focus:border-(--accent) transition-colors duration-100 cursor-pointer'>
              { allTypes.map((t) => <option key={t.uid} value={t.uid}>{t.name}</option>) }
            </select>
          </div>
          <p style={{color: type.colour}} className='ml-15 text-sm'>{type.description}</p>

          <hr className='my-3 opacity-10' />

          {
            c.type === 'individual' 
            ?
              <div className='w-full flex flex-col gap-4'>
                <div className='w-full grid grid-cols-2 gap-2 md:gap-y-5'>
                  <ContactInput label='First Name' value={c.first_name} onChange={(e) => updateField('first_name', e.target.value)} placeholder='William' />
                  <ContactInput label='Surname' value={c.last_name} onChange={(e) => updateField('last_name', e.target.value)} placeholder='Beneventi' />
                </div>
                <ContactInput label={`Company Name${c.company.role.trim().length ? '' : ' (optional)'}`} value={c.company.name} onChange={(e) => updateNestedField('company', 'name', e.target.value)} />
                <ContactInput label='Company Role (optional)' value={c.company.role} onChange={(e) => updateNestedField('company', 'role', e.target.value)} />
              </div>
            :
              <div className='w-full'>
                <ContactInput label='Company Name' value={c.org_name} onChange={(e) => updateField('org_name', e.target.value)} placeholder='Dark Slate Theatre' />
              </div>
          }
          <div className='grid grid-cols-2 gap-2 mt-2'>
            <ContactInput label='Instagram @' value={c.social.instagram} onChange={(e) => updateNestedField('social', 'instagram', e.target.value)} />
            <ContactInput label='Facebook @' value={c.social.facebook} onChange={(e) => updateNestedField('social', 'facebook', e.target.value)} />
          </div>
          <hr className='my-3 opacity-10' />

          <div className='flex gap-4'>
            <p className='text-sm text-[#aaa] -mb-1'>Notes:</p>
            <PlusCircle size={20} className='text-(--accent) hover:text-white cursor-pointer transition-colors' onClick={() => addListItem('notes', {uid: CreateUID(), data: ''})} />
          </div>
          <DraggableList values={c.notes} onReorder={(e) => updateField('notes', e)} >
            {c.notes.map((n) => 
              <DraggableListItem key={n.uid} value={n} onDelete={() => deleteListItem('notes', n.uid)}>
                <IconlessInput value={n.data} onChange={(e) => updateListItem('notes', n.uid, e.target.value)} />
              </DraggableListItem>
            )}
          </DraggableList>

          <hr className='my-3 opacity-10' />

          <ListSection label='Emails'
            field='emails'
            values={c.emails}
            icon={<Mail size={18} />}
            placeholder='Email'
            updateField={updateField}
            updateListItem={updateListItem}
            addListItem={addListItem}
            deleteListItem={deleteListItem}
          />
          <div className='mb-4' />
          <ListSection label='Phone Numbers'
            field='phones'
            values={c.phones}
            icon={<Phone size={18} />}
            placeholder='Phone Number'
            updateField={updateField}
            updateListItem={updateListItem}
            addListItem={addListItem}
            deleteListItem={deleteListItem}
          />

          <hr className='my-3 opacity-10' />

          <div className='flex gap-4'>
            <p className='text-sm text-[#aaa] -mb-1'>Address:</p>
            <PlusCircle size={20} className='text-(--accent) hover:text-white cursor-pointer transition-colors' onClick={() => addListItem('address', {uid: CreateUID(), label: '', house_and_street: '', town_or_city: '', county_or_country: '', postcode: ''})} />
          </div>
          <DraggableList values={c.address} onReorder={(e) => updateField('address', e)} >
            {c.address.map((a) => 
              <DraggableListItem key={a.uid} value={a} onDelete={() => deleteListItem('address', a.uid)}>
                <div className='flex flex-col gap-1'>
                  <IconlessInput placeholder='House & Street' value={a.house_and_street} onChange={(e) => updateListItem('address', a.uid, e.target.value, 'house_and_street')} />
                  <IconlessInput placeholder='Town or City' value={a.town_or_city} onChange={(e) => updateListItem('address', a.uid, e.target.value, 'town_or_city')} />
                  <IconlessInput placeholder='County or Country' value={a.county_or_country} onChange={(e) => updateListItem('address', a.uid, e.target.value, 'county_or_country')} />
                  <IconlessInput placeholder='Postcode' value={a.postcode} onChange={(e) => updateListItem('address', a.uid, e.target.value, 'postcode')} />
                  <div className='w-full max-w-100 mt-2'>
                    <IconInput icon={<Tag size={20} />} placeholder='Label (optional)' value={a.label} onChange={(e) => updateListItem('address', a.uid, e.target.value, 'label')} />
                  </div>
                </div>
              </DraggableListItem>
            )}
          </DraggableList>

        </div>

        <SaveButton visible={edited} saving={saving} handleSave={handleSave} />
      </div>
    </>
  )

}


const blankContact = {
  first_name: '',
  last_name: '',
  org_name: '',
  company: {
    role: '',
    name: ''
  },
  notes: [],
  emails: [],
  phones: [],
  address: [],
  social: {
    instagram: '',
    facebook: ''
  },
  photo: {
    url: null,
    storage: null
  },
  type: 'individual',
}


function ListSection({label, field, values, icon, placeholder, updateField, updateListItem, addListItem, deleteListItem}) {
  return (
    <>
      <div className='flex gap-4'>
        <p className='text-sm text-[#aaa] -mb-1'>{label}:</p>
        <PlusCircle size={20} className='text-(--accent) hover:text-white cursor-pointer transition-colors' onClick={() => addListItem(field, {uid: CreateUID(), label: '', data: ''})} />
      </div>
      <DraggableList values={values} onReorder={(e) => updateField(field, e)} >
        {values.map((x) => 
          <DraggableListItem key={x.uid} value={x} onDelete={() => deleteListItem(field, x.uid)}>
            <div className='grid md:grid-cols-[3fr_2fr] lg:grid-cols-[3fr_1fr] gap-3'>
              <IconInput icon={icon} placeholder={placeholder} value={x.data} onChange={(e) => updateListItem(field, x.uid, e.target.value)} />
              <IconInput icon={<Tag size={18} />} placeholder='Label (optional)' value={x.label} onChange={(e) => updateListItem(field, x.uid, e.target.value, 'label')} />
            </div>
          </DraggableListItem>
        )}
      </DraggableList>
    </>
  )
}


function ContactInput({label, value, onChange, placeholder}) {
  return (
    <div className='w-full'>
      <p className='text-sm text-[#aaa] mb-0.5'>{label}:</p>
      <input value={value} onChange={onChange} placeholder={placeholder} className='w-full px-3 py-1 bg-[#101010] rounded-sm text-lg border border-white/20 focus:outline-none focus:border-(--accent)' />
    </div>
  )
}


function CreateUID() {
  return Math.random().toString(36).substring(2, 7);
}


function CreateContactUID(c, reverseName=false) {
  let name;
  if(c.type === 'individual') {
    if(reverseName) name = `${c.last_name} ${c.first_name}`;
    else name = `${c.first_name} ${c.last_name}`;
  }
  else name = c.org_name.replace(/^the\s+/i, '');

  console.log(name);
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-");
}



async function ReplacePhoto(oldPhoto, newFile) {

  if(!newFile) return oldPhoto;

  console.log("Uploading new photo");

  const croppedFile = await CropAndResize(newFile, 200);

  const extension = newFile.name.split('.').pop().toLowerCase();
  const newStoragePath = `address-book/${CreateUID()}.${extension}`;
  const newImageRef = ref(storage, newStoragePath);

  if(oldPhoto.storage) await deleteObject(ref(storage, oldPhoto.storage));

  await uploadBytes(newImageRef, croppedFile);

  const newUrl = await getDownloadURL(newImageRef);

  return {
    url: newUrl,
    storage: newStoragePath
  }

}


async function CropAndResize(file, maxSize=750) {

  const image = new Image();
  image.src = URL.createObjectURL(file);

  await new Promise((resolve) => {
    image.onload = resolve;
  });

  const size = Math.min(image.width, image.height);
  const sourceX = (image.width - size) / 2;
  const sourceY = (image.height - size) / 2;

  const outputSize = Math.min(size, maxSize);

  const canvas = document.createElement('canvas');
  canvas.width = outputSize;
  canvas.height = outputSize;

  const ctx = canvas.getContext('2d');

  ctx.drawImage(
    image,
    sourceX,
    sourceY,
    size,
    size,
    0,
    0,
    outputSize,
    outputSize
  );

  URL.revokeObjectURL(image.src);

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        resolve(
          new File([blob], file.name, {
            type: file.type,
          })
        );
      },
      file.type,
      0.9
    )
  })

}
import './ShowPageScrollbar.css';
import { GripVertical, ImagePlus, Images, Link, Star, StarHalf, Tag, Tickets, Trash2, UsersRound } from "lucide-react";
import { addListItemToNestedField, deleteListItemInNestedField, deleteNestedListItem, updateField, updateListItemInNestedField, updateNestedField, updateNestedListItem } from "../../../components/update-field/UpdateField";
import { getSectionColour } from "./ShowPage";
import { useEffect, useRef, useState } from "react";
import MarkDownEditor from "../../../components/admin-markdown-editor/MarkdownEditor";
import { Uid10 } from "../../../components/uid-10/Uid10";
import { Reorder } from "motion/react";
import { AddListItemButton } from '../../../components/admin-draggable-list/AddListItemButton';
import { AdminInput } from '../../../components/admin-input/AdminInput';
import { DraggableList } from '../../../components/admin-draggable-list/DraggableList';
import { DraggableListItem } from '../../../components/admin-draggable-list/DraggableListItem';
import { IconInput, IconlessInput } from '../../../components/admin-draggable-list/IconInput';


export function HeaderSection({section:c, images, setImages, setShow, setEdited}) {

  const fileInputRef = useRef(null);
  const image = images[c.uid];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if(!file) return;
    updateField(c.uid, { file, preview: URL.createObjectURL(file) }, setImages, setEdited);
  }

  return (
    <div 
      onClick={() => fileInputRef.current.click()}
      className='w-full aspect-3/1 cursor-pointer overflow-hidden rounded-sm border border-white/20 flex justify-center items-center hover:brightness-115 transition-all'
    >
      <input ref={fileInputRef} type='file' accept='image/*' hidden onChange={handleImageChange} />
      {
        image?.preview ? (
          <img src={image.preview} className='w-full h-full object-cover' />
        ) : (
          <div className='w-full h-full bg-[#101010] text-[#666] flex justify-center items-center'>
            <ImagePlus size={30} />
          </div>
        )
      }
    </div>
  )
}


export function TitleSection({section:c, setShow, setEdited}) {
  return (
    <div className='w-full'>
      <select className='w-40 hover:bg-[#101010] focus:bg-[#101010] border-transparent border focus:border-white/10 focus:outline-none rounded-sm py-2 px-2 cursor-pointer text-[#999] text-sm tracking-wider' value={c.style} onChange={(e) => updateListItemInNestedField('show_page', 'content', c.uid, 'style', e.target.value, setShow, setEdited)}>
        <option value='title'>Title</option>
        <option value='subtitle'>Subtitle</option>
      </select>
      <div className='w-full flex justify-center mt-2 not-md:mt-4'>
        <input 
          className={`w-full ${c.style === 'title' ? 'text-4xl md:text-6xl uppercase' : 'text-3xl md:text-5xl'} font-bold tracking-wide text-center focus:outline-none focus:bg-[#101010] rounded-sm`} 
          placeholder={`Your ${c.style === 'title' ? 'Title' : 'Subtitle'}...`} 
          value={c.label} 
          onChange={(e) => updateListItemInNestedField('show_page', 'content', c.uid, 'label', e.target.value, setShow, setEdited)} 
        />
      </div>
    </div>
  )
}


export function ParagraphSection({section:c, setShow, setEdited}) {

  const textareaRef = useRef(null);

  useEffect(() => {
    const el = textareaRef.current;
    if(!el) return;

    el.style.height = '0px';
    el.style.height = `${el.scrollHeight}px`;
  }, [c.content, c.style])

  return (
    <div className='w-full'>
      <select className='w-40 hover:bg-[#101010] focus:bg-[#101010] border-transparent border focus:border-white/10 focus:outline-none rounded-sm py-2 px-2 cursor-pointer text-[#999] text-sm tracking-wider' value={c.style} onChange={(e) => updateListItemInNestedField('show_page', 'content', c.uid, 'style', e.target.value, setShow, setEdited)}>
        <option value='text'>Text (Markdown)</option>
        <option value='quote'>Quote</option>
      </select>
      <div className='w-full flex justify-center mt-4 md:mt-3 mb-2 text-[#ccc]'>
        {
          c.style === 'text' 
          ? <MarkDownEditor 
              value={c.content} 
              onChange={(e) => updateListItemInNestedField('show_page', 'content', c.uid, 'content', e, setShow, setEdited)} 
              className='w-full max-w-225 border-x-2 px-4 md:text-lg rounded-sm text-center'
              placeholder='Your text here...'
              style={{borderColor: `${getSectionColour('paragraph')}77`}}
            />
          : <div className='w-full flex justify-center gap-4'>
              <p className='not-md:hidden text-4xl' style={{color: `${getSectionColour('paragraph')}aa`}} >"</p>
              <textarea 
                ref={textareaRef}
                className='relative w-full max-w-225 h-9 border-x-2 px-4 py-2 text-xl md:text-2xl text-center focus:outline-none focus:bg-[#101010] rounded-sm italic resize-none overflow-hidden' 
                placeholder='Your quote here...' 
                value={c.content} 
                onChange={(e) => updateListItemInNestedField('show_page', 'content', c.uid, 'content', e.target.value, setShow, setEdited)}
                style={{borderColor: `${getSectionColour('paragraph')}77`}} 
              />
              <p className='not-md:hidden text-4xl' style={{color: `${getSectionColour('paragraph')}aa`}} >"</p>
            </div>
        }
      </div>
    </div>
  ) 
}


export function GallerySection({section:c, images:showImages, setImages, setShow, setEdited}) {

  const fileInputRef = useRef(null);
  
  // Retrieve images and filter out those marked as deleted
  const images = showImages[c.uid]?.images?.filter((x) => !x.deleted) ?? [];

  const handleAddImages = (e) => {
    const files = Array.from(e.target.files ?? []);
    if(!files.length) return;
    
    const newImages = files.map(file => ({
      uid: Uid10(),
      file,
      preview: URL.createObjectURL(file),
      caption: ''
    }));

    setImages(prev => ({
      ...prev,
      [c.uid]: {
        ...prev[c.uid],
        images: [
          ...(prev[c.uid]?.images ?? []),
          ...newImages,
        ],
      },
    }));

    e.target.value = '';
    if(setEdited) setEdited(true);
  }

  const handleReorder = (e) => {
    updateNestedField(c.uid, 'images', e, setImages, setEdited);
  }

  const handleRemove = (uid) => {
    const image = images.find(image => image.uid === uid);
    if(!image) return;

    if(image.file !== null) {
      // Images has been added locally - it is not on the server
      URL.revokeObjectURL(image.preview);
      deleteListItemInNestedField(c.uid, 'images', uid, setImages, setEdited);
    }
    else {
      // Image is stored on the server - mark for deletion
      updateListItemInNestedField(c.uid, 'images', uid, 'deleted', true, setImages, setEdited);
    }
  }

  const handleCaptionChange = (uid, value) => {
    setImages(prev => ({
      ...prev,
      [c.uid]: {
        ...prev[c.uid],
        images: prev[c.uid].images.map(image =>
          image.uid === uid
            ? { ...image, caption: value }
            : image
        ),
      },
    }));
    if(setEdited) setEdited(true);
  }

  return (
    <div className="w-full flex justify-center">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleAddImages}
      />

      {images.length ? (
        <div className="w-full flex flex-col items-center">
          <div className="w-full max-w-225">
            <AddListItemButton onClick={() => fileInputRef.current?.click()}>
              Add Images
            </AddListItemButton>
          </div>

          <div className="w-full max-w-225 overflow-x-auto overflow-y-hidden show-page-scrollbar pb-2">
            <div className="flex justify-center min-w-fit">
              <Reorder.Group
                axis="x"
                values={images}
                onReorder={handleReorder}
                className="flex gap-3"
              >
                {images.map(image => (
                  <Reorder.Item
                    key={image.uid}
                    value={image}
                    className="group relative shrink-0 h-30 md:h-50 aspect-4/3 cursor-grab overflow-hidden rounded-sm border border-white/10 bg-[#101010] active:cursor-grabbing flex justify-center items-center"
                  >
                    <img
                      src={image.preview}
                      alt=""
                      draggable={false}
                      className="h-full w-full select-none object-cover"
                    />

                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-between md:gap-2 bg-linear-to-t from-black/90 to-transparent px-1 md:px-3 pb-3 pt-10 md:opacity-0 transition-opacity group-hover:opacity-100">
                      <GripVertical size={20} className="text-[#aaa] shrink-0" />
                      <div className='border border-white/10 text-sm'>
                        <IconlessInput placeholder='caption...' value={image.caption ?? ''} onChange={(e) => handleCaptionChange(image.uid, e.target.value)} />
                      </div>
                      <button
                        type="button"
                        onPointerDown={e => e.stopPropagation()}
                        onClick={e => {
                          e.stopPropagation();
                          handleRemove(image.uid);
                        }}
                        className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-black/70 text-[#aaa] transition-colors hover:text-[#e74c3c]"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            </div>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="flex h-30 md:h-50 w-full max-w-225 flex-col items-center justify-center rounded-sm border border-white/20 bg-[#101010] text-[#666] cursor-pointer hover:brightness-115 transition-all"
        >
          <Images size={30} />
          <p className="mt-2 text-sm">No gallery images</p>
        </div>
      )}
    </div>
  )
}


export function PerformanceSection({section:c, setTab, setShow, setEdited}) {

  const typeColour = getSectionColour('performances');

  return (
    <div className='w-full flex justify-center'>
      <div style={{backgroundColor: `${typeColour}1a`}} className='w-full rounded-sm p-4 flex justify-center'>
        <div className='flex gap-4 items-center mb-2'>
          <Tickets size={30} style={{color: typeColour}} />
          <p style={{color: typeColour }} className='uppercase tracking-wider font-bold mt-2'>Performances</p>
          <p onClick={() => setTab('performances')} className='underline text-[#aaa] cursor-pointer hover:text-[#eee] transition-colors text-sm mt-2 ml-4'>Edit</p>
        </div>
      </div>
    </div>
  )
}


export function CreditSection({section:c, setTab, setShow, setEdited}) {
  
  const typeColour = getSectionColour('credits');

  return (
    <div className='w-full flex justify-center'>
      <div style={{backgroundColor: `${typeColour}1a`}} className='w-full rounded-sm p-4 flex justify-center'>
        <div className='flex gap-4 items-center mb-2 mt-1'>
          <UsersRound size={30} style={{color: typeColour}} />
          <p style={{color: typeColour }} className='uppercase tracking-wider font-bold mt-1'>Credits</p>
          <p onClick={() => setTab('credits')} className='underline text-[#aaa] cursor-pointer hover:text-[#eee] transition-colors text-sm mt-1 ml-4'>Edit</p>
        </div>
      </div>
    </div>
  )
}


export function ReviewSection({section:c, setShow, setEdited}) {

  const updateReview = (parentField, uid, field, value) => {
    setShow((prev) => ({
      ...prev,
      show_page: {
        ...prev.show_page,
        content: prev.show_page.content.map((s) => 
          s.uid === c.uid 
          ? { 
              ...s,
              [parentField]: s[parentField].map((r) => 
                r.uid === uid 
                ? { ...r, [field]: value }
                : r
              )
            }
          : s
        )
      }
    }));
    if(setEdited) setEdited(true);
  }

  const deleteReview = (field, uid) => {
    setShow((prev) => ({
      ...prev,
      show_page: {
        ...prev.show_page,
        content: prev.show_page.content.map((s) => 
          s.uid === c.uid 
          ? { 
              ...s,
              [field]: s[field].filter((x) => x.uid !== uid)
            }
          : s
        )
      }
    }));
    if(setEdited) setEdited(true);
  }

  return (
    <div className={`w-full flex flex-col items-center pb-2`}>
      <ReviewGroup c={c} field='critic' values={c.critic} addValue={{ uid: Uid10(), rating: 0, quote: '', reviewer: '' }} setShow={setShow} setEdited={setEdited}>
        {
          c.critic.map((r) => 
            <Reorder.Item 
              key={r.uid}
              value={r}
              className='group relative shrink-0 w-65 px-2 py-4 overflow-hidden rounded-sm border border-white/10 bg-[#101010] flex flex-col items-center gap-3'
            >
              <StarRating 
                value={r.rating} 
                onChange={(e) => updateReview('critic', r.uid, 'rating', e)}
              />
              <AdminInput className='text-center bg-black/70' labelClassName='text-center mt-2' label='Reviewer' value={r.reviewer} onChange={(e) => updateReview('critic', r.uid, 'reviewer', e.target.value)} />
              <AdminInput className='text-center bg-black/70' labelClassName='text-center' label='Quote (optional)' value={r.quote} onChange={(e) => updateReview('critic', r.uid, 'quote', e.target.value)} />
              <div className='w-full flex justify-between mt-1'>
                <GripVertical size={20} className='text-[#aaa] group-hover:text-white transition-colors cursor-grab active:cursor-grabbing' />
                <Trash2 size={18} onClick={() => deleteReview('critic', r.uid)} className='text-[#aaa] transition-colors hover:text-[#e74c3c] cursor-pointer' />
              </div>
            </Reorder.Item>
          )
        }
      </ReviewGroup>
      <ReviewGroup c={c} field='audience' values={c.audience} addValue={{ uid: Uid10(), quote: '' }} setShow={setShow} setEdited={setEdited}>
        {
          c.audience.map((r) => 
            <Reorder.Item 
              key={r.uid}
              value={r}
              className='group relative shrink-0 w-65 px-2 py-4 overflow-hidden rounded-sm border border-white/10 bg-[#101010] flex flex-col items-center gap-3'
            >
              <AdminInput className='text-center bg-black/70' labelClassName='text-center' label='Quote' value={r.quote} onChange={(e) => updateReview('audience', r.uid, 'quote', e.target.value)} />
              <div className='w-full flex justify-between mt-1'>
                <GripVertical size={20} className='text-[#aaa] group-hover:text-white transition-colors cursor-grab active:cursor-grabbing' />
                <Trash2 size={18} onClick={() => deleteReview('audience', r.uid)} className='text-[#aaa] transition-colors hover:text-[#e74c3c] cursor-pointer' />
              </div>
            </Reorder.Item>
          )
        }
      </ReviewGroup>
    </div>
  )
}


export function AnnouncementSection({section:c, accentColour=null, setShow, setEdited}) {

  const [showButtonOptions, setShowButtonOptions] = useState(c.button_link || c.button_label);

  const colour = accentColour || 'var(--accent)';

  return (
    <div className='w-full flex flex-col gap-3 items-center'>
      <input 
        style={{backgroundColor: colour}}
        className='w-full max-w-225 text-black uppercase md:text-xl text-center font-bold tracking-wide px-4 py-2 focus:outline-none'
        placeholder='Your announcement here...'
        value={c.label} 
        onChange={(e) => updateListItemInNestedField('show_page', 'content', c.uid, 'label', e.target.value, setShow, setEdited)} 
      />
      {
        showButtonOptions 
        ? <div className='w-full max-w-225 grid grid-cols-2 gap-2 pb-2'>
            <AdminInput label='Button Link' value={c.button_link} onChange={(e) => updateListItemInNestedField('show_page', 'content', c.uid, 'button_link', e.target.value, setShow, setEdited)} />
            <AdminInput label='Button Label' value={c.button_label} onChange={(e) => updateListItemInNestedField('show_page', 'content', c.uid, 'button_label', e.target.value, setShow, setEdited)} />
          </div>
        : <div className='-mt-4'>
            <AddListItemButton onClick={() => setShowButtonOptions(true)}>Add action button</AddListItemButton>
          </div>
      }
    </div>
  )
}


export function ActionSection({section:c, setShow, setEdited}) {

  const handleReorder = (e) => {
    updateListItemInNestedField('show_page', 'content', c.uid, 'content', e, setShow, setEdited);
  }

  const handleDelete = (uid) => {
    setShow((prev) => ({
      ...prev,
      show_page: {
        ...prev.show_page,
        content: prev.show_page.content.map((s) => 
          s.uid === c.uid 
          ? {
              ...s, 
              content: s.content.filter((x) => x.uid !== uid)
            }
          : s
        )
      }
    }));
    if(setEdited) setEdited(true);
  }

  const handleAdd = () => {
    setShow((prev) => ({
      ...prev,
      show_page: {
        ...prev.show_page,
        content: prev.show_page.content.map((s) =>
          s.uid === c.uid 
          ? { 
              ...s,
              content: [...s.content, { uid: Uid10(), label: '', link: '' }]
            }
          : s
        )
      }
    }));
    if(setEdited) setEdited(true);
  }

  const updateAction = (uid, field, value) => {
    setShow((prev) => ({
      ...prev,
      show_page: {
        ...prev.show_page,
        content: prev.show_page.content.map((s) => 
          s.uid === c.uid 
          ? { 
              ...s,
              content: s.content.map((a) => 
                a.uid === uid 
                ? { ...a, [field]: value }
                : a
              )
            }
          : s
        )
      }
    }));
    if(setEdited) setEdited(true);
  }

  return (
    <div className='w-full flex justify-center'>
      <div className='w-full max-w-225 pb-4'>
        <AddListItemButton onClick={handleAdd}>Add Action Button</AddListItemButton>
        <DraggableList values={c.content} onReorder={handleReorder}>
          {
            c.content.map((action) => 
              <DraggableListItem key={action.uid} value={action} onDelete={() => handleDelete(action.uid)}>
                <div className='grid md:grid-cols-2 gap-2'>
                  <IconInput placeholder='Label' icon={<Tag size={18} />} value={action.label} onChange={(e) => updateAction(action.uid, 'label', e.target.value)} />
                  <IconInput placeholder='Link' icon={<Link size={18} />} value={action.link} onChange={(e) => updateAction(action.uid, 'link', e.target.value)} />
                </div>
              </DraggableListItem>
            )
          }
        </DraggableList>
      </div>
    </div>
  )
}




// HELPERS





function ReviewGroup({c, field, values, addValue, setShow, setEdited, children}) {

  const handleReorder = (e) => { updateListItemInNestedField('show_page', 'content', c.uid, field, e, setShow, setEdited); }

  const handleAdd = () => {
    setShow((prev) => ({
      ...prev,
      show_page: {
        ...prev.show_page,
        content: prev.show_page.content.map((s) => (
          s.uid === c.uid 
          ? { ...s, [field]: [...s[field], addValue] }
          : s
        ))
      }
    }))
  }

  return (
    <>
      <div className="w-full max-w-225 flex justify-start">
        <AddListItemButton onClick={handleAdd}>
          Add {field} review
        </AddListItemButton>
      </div>

      <div className="w-full max-w-225 overflow-x-auto overflow-y-hidden show-page-scrollbar">
        {values.length ? (
          <div className="flex justify-center min-w-fit">
            <Reorder.Group
              axis="x"
              values={values}
              onReorder={handleReorder}
              className="flex gap-3"
            >
              {children}
            </Reorder.Group>
          </div>
        ) : null}
      </div>
    </>
  )
}

function StarRating({ value = 0, onChange }) {
  const [hoverValue, setHoverValue] = useState(null);

  const displayValue = hoverValue ?? value;
  const colour = hoverValue === null ? "#f1c40f" : "#777";

  function renderStar(i) {
    if (displayValue >= i) {
      return <Star size={32} fill={colour} stroke="transparent" />;
    }

    if (displayValue === i - 0.5) {
      return (
        <div className="relative h-full w-full">
          <Star size={32} fill="#333" stroke="transparent" />
          <StarHalf
            className="absolute inset-0"
            size={32}
            fill={colour}
            stroke="transparent"
          />
        </div>
      );
    }

    return <Star size={32} fill="#333" stroke="transparent" />;
  }

  return (
    <div
      className="relative flex h-8"
      onMouseLeave={() => setHoverValue(null)}
    >
      <button
        type="button"
        className="absolute left-0 -translate-x-1/2 top-0 h-8 w-4 cursor-pointer z-11"
        onMouseMove={() => setHoverValue(0)}
        onClick={() => {
          setHoverValue(null);
          onChange(0);
        }}
      />
      {[1, 2, 3, 4, 5].map(i => (
        <div
          key={i}
          className="relative h-8 w-8 cursor-pointer"
          onMouseMove={e => {
            const { left, width } = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - left;

            if (x < width / 2) {
              setHoverValue(i - 0.5);
            } else {
              setHoverValue(i);
            }
          }}
          onClick={e => {
            const { left, width } = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - left;

            const rating = x < width / 2 ? i - 0.5 : i;

            setHoverValue(null);
            onChange(rating);
          }}
        >
          {renderStar(i)}
        </div>
      ))}
    </div>
  );
}
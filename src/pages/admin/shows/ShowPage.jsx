import { CircleArrowOutUpRight, GripHorizontal, Images, Megaphone, Pilcrow, Star, Tickets, Trash2, Type, UsersRound, Wallpaper } from "lucide-react";
import { useState } from "react"
import { addListItemToNestedField, deleteListItemInNestedField, updateNestedField } from "../../../components/update-field/UpdateField";
import { Uid10 } from "../../../components/uid-10/Uid10";
import { Reorder } from "motion/react";
import { ActionSection, AnnouncementSection, CreditSection, GallerySection, HeaderSection, ParagraphSection, PerformanceSection, ReviewSection, TitleSection } from "./ShowPageSections";


export function ShowPage({show:s, setShow, edited, setEdited, setTab, showPageImages:images, setShowPageImages:setImages}) {

  
  const showPage = s.show_page;

  const handleReorder = (e) => {
    updateNestedField('show_page', 'content', e, setShow, setEdited);
  }

  const handleDelete = (c) => {
    const uid = c.uid;
    const type = c.type;
    let canDeleteKey = true;

    // Remove or flag gallery images for deletion
    if(type === 'gallery') {
      if(images[c.uid]) {
        setImages(prev => ({
          ...prev,
          [uid]: {
            ...prev[uid],
            images: [
              ...prev[uid].images.map((image) => {
                if(image.file) {
                  URL.revokeObjectURL(image.preview);
                  return null;
                }
                else {
                  canDeleteKey = false;
                  return { ...image, deleted: true };
                }
              })
            ].filter(Boolean)
          }
        }));
      }
    }
    else if(type === 'header') {
      const image = images[uid];
      if(image?.file) URL.revokeObjectURL(image.preview);

      if(image?.storage) {
        canDeleteKey = false;
        setImages(prev => ({
          ...prev,
          [uid]: {
            ...prev[uid],
            preview: null,
            file: null,
            deleted: true,
          },
        }));
      }
    }
    
    if(canDeleteKey) {
      // Delete the relevant item in images, if it exists
      setImages(prev => {
        const { [uid]: _, ...rest } = prev;
        return rest;
      })
    }

    deleteListItemInNestedField('show_page', 'content', uid, setShow, setEdited);
  }


  return (
    <>
      <SectionMenu edited={edited} show={s} setShow={setShow} setEdited={setEdited} />
      <Reorder.Group
        axis='y'
        values={showPage.content}
        onReorder={(e) => handleReorder(e)}
        className='flex flex-col gap-4 overflow-hidden pt-4 pb-18'
      >
        {
          showPage.content.map((c) =>
            <Reorder.Item 
              key={c.uid}
              value={c}
              className='flex md:gap-2 items-center bg-black'
            >
              <div className='shrink-0 flex not-md:flex-col not-md:justify-center items-center gap-2'>
                <div className='not-md:hidden' style={{color: getSectionColour(c.type)}}>{getSections(25)[c.type].icon}</div>
                <div className='not-md:scale-75 w-10 h-10 bg-[#101010] hover:bg-[#151515] text-[#aaa] hover:text-[#ddd] transition-colors rounded-full flex justify-center items-center border border-white/10 cursor-grab'>
                  <GripHorizontal size={20} />
                </div>
              </div>
              <div className='relative flex-1 min-w-0 p-2 pt-5 border border-t-0 border-b-2 border-white/5 rounded-b-sm'>
                <p style={{color: `${getSectionColour(c.type)}99`}} className='md:hidden absolute top-0 -translate-y-1/2 text-xs tracking-widest'>{getSections()[c.type].name}</p>
                <p className='not-md:hidden absolute top-0 -translate-y-1/2 text-xs tracking-widest text-[#555]'>{getSections()[c.type].name}</p>
                {
                  c.type === 'header' 
                  ? <HeaderSection section={c} setShow={setShow} setEdited={setEdited} images={images} setImages={setImages} />
                  : c.type === 'title' 
                  ? <TitleSection section={c} setShow={setShow} setEdited={setEdited} />
                  : c.type === 'paragraph'
                  ? <ParagraphSection section={c} setShow={setShow} setEdited={setEdited} />
                  : c.type === 'gallery' 
                  ? <GallerySection section={c} setShow={setShow} setEdited={setEdited} images={images} setImages={setImages} />
                  : c.type === 'performances'
                  ? <PerformanceSection section={c} setShow={setShow} setEdited={setEdited} setTab={setTab} />
                  : c.type === 'credits'
                  ? <CreditSection section={c} setShow={setShow} setEdited={setEdited} setTab={setTab} />
                  : c.type === 'reviews'
                  ? <ReviewSection section={c} setShow={setShow} setEdited={setEdited} />
                  : c.type === 'announcement'
                  ? <AnnouncementSection section={c} setShow={setShow} setEdited={setEdited} accentColour={s.accent_colour} />
                  : c.type === 'actions'
                  ? <ActionSection section={c} setShow={setShow} setEdited={setEdited} />
                  : null
                }
              </div>
              <div onClick={() => handleDelete(c)} className='flex-none not-md:scale-75 w-10 h-10 flex items-center justify-center'>
                <Trash2 className='text-[#aaa] cursor-pointer hover:text-[#e74c3c] transition-colors' size={20} />
              </div>
            </Reorder.Item>
          )
        }
      </Reorder.Group>
    </> 
  )

}


function SectionMenu({show:s, edited, setShow, setEdited}) {

  const sections = getSections(16);

  const addSection = (s, id) => {
    addListItemToNestedField('show_page', 'content', {uid: Uid10(), type: id, ...s.value}, setShow, setEdited);
  }

  return (
    <div className={`${edited ? 'bottom-26' : 'bottom-4'} fixed z-50 left-1/2 -translate-x-1/2 flex items-center transition-all duration-250 rounded-sm overflow-hidden bg-[#151515] drop-shadow-[0_0_12px_#000000]`}>
      {
        Object.keys(sections).map((id, i) => {
          const s = sections[id];
          return (
            <div key={id} onClick={() => addSection(s, id)} className={`
              group transition-all duration-500
              ${(i !== Object.keys(sections).length-1) && 'border-r'} border-white/20 
              flex gap-3 items-center py-3 bg-transparent hover:bg-[#202020] 
              text-[#aaa] hover:text-[#eee] cursor-pointer  
              px-3 md:px-4 md:group-hover:px-5
              overflow-hidden max-w-36 not-hover:md:max-w-12
            `}>
              <div style={{color: getSectionColour(id)}}>{s.icon}</div>
              <p className='not-md:hidden text-sm ml-1'>{s.name}</p>
            </div>
          )
        })
      }
    </div>
  ) 
}


export const getSections = (size=18) => {
  return ({
    header: {
      name: 'Header',
      icon: <Wallpaper size={size} />,
      value: {
        url: null,
        storage: null
      },
    },
    title: {
      name: 'Title',
      icon: <Type size={size} />,
      value: {
        style: 'title',
        label: ''
      }
    },
    paragraph: {
      name: 'Paragraph',
      icon: <Pilcrow size={size} />,
      value: {
        style: 'text',
        content: ''
      }
    },
    gallery: {
      name: 'Gallery',
      icon: <Images size={size} />,
      value: {
        images: []
      }
    },
    performances: {
      name: 'Performances',
      icon: <Tickets size={size} />,
      value: null
    },
    credits: {
      name: 'Credits',
      icon: <UsersRound size={size} />,
      value: null
    },
    reviews: {
      name: 'Reviews',
      icon: <Star size={size} />,
      value: {
        critic: [],
        audience: []
      }
    },
    announcement: {
      name: 'Announcement',
      icon: <Megaphone size={size} />,
      value: {
        label: '',
        button_link: null,
        button_label: null
      }
    },
    actions: {
      name: 'Actions',
      icon: <CircleArrowOutUpRight size={size} />,
      value: {
        content: []
      }
    }
  })
}


export const getSectionColour = (id) => {

  // Colours taken in-order from https://flatuicolors.com/palette/ca
  const colours = [
    '#ff9ff3', '#feca57', '#ff6b6b', '#7bed9f', '#48dbfb', '#1dd1a1', '#f1c40f', '#00d2d3', '#ff7f50', '#7bed9f'
  ]

  let index = Object.keys(getSections()).indexOf(id);
  
  if(index >= colours.length) return '#576574';
  return colours[index];
}
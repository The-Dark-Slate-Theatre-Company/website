import { Calendar1, CalendarCheck, Link, MapPin, Theater } from "lucide-react";
import { BackpageDescription } from "../../../components/admin-backpage-description/BackpageDescription";
import { AddListItemButton } from "../../../components/admin-draggable-list/AddListItemButton";
import { DraggableList } from "../../../components/admin-draggable-list/DraggableList";
import { DraggableListItem } from "../../../components/admin-draggable-list/DraggableListItem";
import { IconInput } from "../../../components/admin-draggable-list/IconInput";
import { addListItem, deleteListItem, updateField, updateListItem, updateNestedField } from "../../../components/update-field/UpdateField";
import { AdminInputLabel } from "../../../components/admin-input/AdminInput";
import { Uid10 } from "../../../components/uid-10/Uid10";
import { getSectionColour } from "./ShowPage";


export function Performances({show:s, setShow, setEdited, setTab}) {


  const addVenue = () => {

    addListItem('performances', {
      uid: Uid10(),
      venue: '',
      town: '',
      from: '',
      to: '',
      link: ''
    }, setShow, setEdited);
  }

  const deleteVenue = (uid) => {
    deleteListItem('performances', uid, setShow, setEdited);
  }


  return (
    <>
      <BackpageDescription>
        To make performance times visible, add a <span style={{color: `${getSectionColour('performances')}cc`}}>Performances section</span> to the <u onClick={() => setTab('show-page')} className='cursor-pointer hover:text-[#aaa] transition-colors'>Show Page</u>.<br/>
        How performances are presented depends on the show's visibility settings <u onClick={() => setTab('listing')} className='cursor-pointer hover:text-[#aaa] transition-colors'>(see 'Listing')</u>
      </BackpageDescription>

      <AddListItemButton onClick={addVenue}>Add Venue</AddListItemButton>

      <DraggableList values={s.performances} onReorder={(e) => updateField('performances', e, setShow, setEdited)}>
        {
          s.performances.map((x, i) => 
            <DraggableListItem key={x.uid} value={x} onDelete={() => deleteVenue(x.uid)} >
              <div className='flex flex-col gap-2'>
                <IconInput icon={<MapPin size={18} />} placeholder='Town' value={x.town} onChange={(e) => updateListItem('performances', x.uid, 'town', e.target.value, setShow, setEdited)} />
                <IconInput icon={<Theater size={18} />} placeholder='Venue' value={x.venue} onChange={(e) => updateListItem('performances', x.uid, 'venue', e.target.value, setShow, setEdited)} />
                <div className='grid md:grid-cols-2 gap-2 md:gap-6'>
                  <div className='flex items-center gap-2'>
                    <div className='shrink-0 mt-0.5'><AdminInputLabel label='First Show' /></div>
                    <IconInput icon={<Calendar1 size={18} />} type='date' value={x.from} onChange={(e) => updateListItem('performances', x.uid, 'from', e.target.value, setShow, setEdited)} />
                  </div>
                  <div className='flex items-center gap-2'>
                    <div className='shrink-0 mt-0.5'><AdminInputLabel label='Last Show' /></div>
                    <IconInput icon={<CalendarCheck size={18} />} type='date' value={x.to} onChange={(e) => updateListItem('performances', x.uid, 'to', e.target.value, setShow, setEdited)} />
                  </div>
                </div>
                <IconInput icon={<Link size={18} />} placeholder='Booking Link' value={x.link} onChange={(e) => updateListItem('performances', x.uid, 'link', e.target.value, setShow, setEdited)} />
              </div>
            </DraggableListItem>
          )
        }
      </DraggableList>
    </>
  )

}
import { GripVertical, Import, PlusCircle, Trash, Trash2 } from "lucide-react";
import { BackpageDescription } from "../../../components/admin-backpage-description/BackpageDescription";
import { AddListItemButton } from "../../../components/admin-draggable-list/AddListItemButton";
import { DraggableList } from "../../../components/admin-draggable-list/DraggableList";
import { DraggableListItem } from "../../../components/admin-draggable-list/DraggableListItem";
import { AdminInput, AdminInputLabel } from "../../../components/admin-input/AdminInput";
import { addListItem, addNestedListItem, deleteListItem, deleteNestedListItem, updateField, updateListItem, updateNestedListItem } from "../../../components/update-field/UpdateField";
import { IconToggle } from "./ShowEditor";
import { Uid10 } from "../../../components/uid-10/Uid10";
import { IconInput, IconlessInput } from "../../../components/admin-draggable-list/IconInput";
import { Reorder } from "motion/react";
import { useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";
import { getSectionColour } from "./ShowPage";


export function Credits({show: s, setShow, setEdited, setTab}) {


  const addCreditBlock = (credits=null) => {
    // Find the current credits marked as 'Most Recent'
    let mostRecentUid;
    s.credits.every((c) => {
      if(c.most_recent) { mostRecentUid = c.uid; return false;}
      else return true;
    })
    if(mostRecentUid) updateListItem('credits', mostRecentUid, 'most_recent', false, setShow, setEdited);
    // If credits !== null, then we are duplicating a pre-existing credits block
    if(credits) addListItem('credits', { ...credits, uid: Uid10(), most_recent: true }, setShow, setEdited, true);
    else {
      addListItem('credits', {
        uid: Uid10(), 
        label: '', 
        exec: [], 
        cast: [], 
        crew: [],
        most_recent: true
      }, setShow, setEdited, true);
    }
  }

  const deleteCreditBlock = (uid, isMostRecent, index) => {
    deleteListItem('credits', uid, setShow, setEdited);
    if(isMostRecent && s.credits.length) {
      if(index > 0) updateListItem('credits', s.credits[0].uid, 'most_recent', true, setShow, setEdited);
      else if(s.credits.length > 1) updateListItem('credits', s.credits[1].uid, 'most_recent', true, setShow, setEdited);
    }
  }

  const handleToggleMostRecent = (uid, isMostRecent, index) => {
    if(isMostRecent) {
      if(s.credits.length === 1) return;
      if(index > 0) updateListItem('credits', s.credits[0].uid, 'most_recent', true, setShow, setEdited);
      else if(s.credits.length > 1) updateListItem('credits', s.credits[1].uid, 'most_recent', true, setShow, setEdited);
      updateListItem('credits', uid, 'most_recent', false, setShow, setEdited);
    }
    else {
      s.credits.forEach((c) => {
        if(c.most_recent) updateListItem('credits', c.uid, 'most_recent', false, setShow, setEdited);
      });
      updateListItem('credits', uid, 'most_recent', true, setShow, setEdited);
    }
  }

  const importDarkSlateCredits = async() => {
    const collectionRef = collection(db, 'users-public');
    const snaps = await getDocs(collectionRef);
    const data = snaps.docs.map((x => {
      const item = x.data();
      return { uid: Uid10(), role: item.role, name: item.name }
    }))
    return data.sort((a, b) => a.role.localeCompare(b.role));
  }


  return (
    <>
      <BackpageDescription>
        To make credits visible, add a <span style={{color: `${getSectionColour('credits')}cc`}}>Credits section</span> to the <u onClick={() => setTab('show-page')} className='cursor-pointer hover:text-[#aaa] transition-colors'>Show Page</u>.<br/>
        The <span className='text-[#2ecc71cc]'>Most Recent</span> credits will be displayed on the Show Page. If you have multiple credit blocks, all credits will be visible at <span className='text-[#aaa]'>darkslatetheatre.com/shows/{s.uid}/credits</span>.
      </BackpageDescription>

      <AddListItemButton onClick={() => addCreditBlock()}>Add Credits</AddListItemButton>

      <DraggableList values={s.credits} onReorder={(e) => updateField('credits', e, setShow, setEdited)}>
        {
          s.credits.map((x, i) => 
            <DraggableListItem key={x.uid} value={x} onDuplicate={() => addCreditBlock(x)} onDelete={() => deleteCreditBlock(x.uid, x.most_recent, i)} >
              <div className='flex flex-col'>
                <div className='my-6'>
                  <AdminInput label={`Label${x.most_recent ? ' (optional)' : ''}`} value={x.label} onChange={(e) => updateListItem('credits', x.uid, 'label', e.target.value, setShow, setEdited)} />
                </div>
                <IconToggle falseColour='#95a5a6' falseLabel='Previous Credits' trueColour='#2ecc71' trueLabel='Most Recent' value={x.most_recent} onChange={() => handleToggleMostRecent(x.uid, x.most_recent, i)} />
                <hr className='my-6 opacity-20 border w-[calc(100%-20px)]'/>
                <NestedDraggableList label='Executives' uid={x.uid} field='exec' credits={x} setShow={setShow} setEdited={setEdited} onImport={importDarkSlateCredits} />
                <NestedDraggableList label='Cast' uid={x.uid} field='cast' credits={x} setShow={setShow} setEdited={setEdited} />
                <NestedDraggableList label='Crew' uid={x.uid} field='crew' credits={x} setShow={setShow} setEdited={setEdited} />
              </div>
            </DraggableListItem>
          )
        }
      </DraggableList>
    </>
  )
}


function NestedDraggableList({label, uid, field, credits:c, onImport=null, setShow, setEdited}) {

  const [importing, setImporting] = useState(false);

  const handleAddItem = () => {
    addNestedListItem('credits', uid, field, { uid: Uid10(), name: '', role: '' }, setShow, setEdited);
  }

  const handleReorder = (e) => {
    updateListItem('credits', uid, field, e, setShow, setEdited);
  }

  const handleRemoveItem = (itemUid) => {
    deleteNestedListItem('credits', uid, field, itemUid, setShow, setEdited);
  }

  const handleImport = async() => {
    if(importing) return;
    setImporting(true);
    try { 
      const data = await onImport();
      data.forEach((item) => {
        addNestedListItem('credits', uid, field, item, setShow, setEdited);
      });
    }
    catch(err) { console.error(err); }
    finally { setImporting(false); }
  }


  return (
    <>
      <div className='flex gap-2 mb-2 items-center'>
        <AdminInputLabel label={label} />
        <div onClick={handleAddItem} className='text-(--accent) cursor-pointer hover:brightness-90 transition-all'>
          <PlusCircle size={20} />
        </div>
        {
          onImport && 
          <div onClick={handleImport} style={{color: importing ? '#555' : 'var(--accent)'}} className='cursor-pointer hover:brightness-90 transition-all'>
            <Import size={20} />
          </div>
        }
        { c[field].length ? <p className='text-sm text-(--accent)'>({c[field].length})</p> : null }
      </div>
      {
        c[field].length 
        ? <Reorder.Group
            axis='y'
            values={c[field]}
            onReorder={(e) => handleReorder(e)}
            className='flex flex-col gap-1 mb-4 py-2 px-3 bg-[#050505] border border-white/20 rounded-sm overflow-hidden'
          >
            {
              c[field].map((x) => (
                <Reorder.Item 
                  key={x.uid}
                  value={x}
                  className='grid grid-cols-[1fr_15fr_15fr_1fr] items-center gap-1 bg-[#202020] p-1 rounded-xs'
                >
                  <GripVertical size={20} className='text-[#aaa] cursor-grab' />
                  <IconlessInput placeholder='Role' value={x.role} onChange={(e) => updateNestedListItem('credits', uid, field, x.uid, 'role', e.target.value, setShow, setEdited)} />
                  <IconlessInput placeholder='Name' value={x.name} onChange={(e) => updateNestedListItem('credits', uid, field, x.uid, 'name', e.target.value, setShow, setEdited)} />
                  <div className='flex justify-center'>
                    <Trash size={18} onClick={() => handleRemoveItem(x.uid)} className='text-[#aaa] hover:text-[#e74c3c] cursor-pointer transition-colors' />
                  </div>
                </Reorder.Item>
              ))
            }
          </Reorder.Group>
        : <div className='mb-4' />
      }
    </>
  )
}
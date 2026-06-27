import contactTags from '../../../data/contact-tags/ContactTags.json';
import './FilterMenuScrollbar.css';

import { useEffect, useState } from "react";
import { GetAllContactTypes } from "./GetContactType";
import { Check, Type, Tag, Tags } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";


export function FilterMenu({typeFilter, setTypeFilter, toggleTypeFilter, tagFilter, setTagFilter, toggleTagFilter}) {

  const [tab, setTab] = useState('types');

  return (
    <>
      <div className='w-full px-2 py-2 grid grid-cols-2 justify-center items-center'>
        <TabHeader label='Types' id='types' active={typeFilter} tab={tab} setTab={setTab} />
        <TabHeader label='Tags' id='tags' active={tagFilter} tab={tab} setTab={setTab} />
      </div>
      <AnimatePresence mode='wait'>
        <motion.div 
          key={tab}
          className='filter-menu-scrollbar overflow-y-auto overflow-x-hidden h-78.25'
          initial={{opacity: 0}} 
          animate={{opacity: 1}}
          exit={{opacity: 1}}
          transition={{duration: 0.1}}
        >
          {
            tab === 'types' 
            ? <TypesTab typeFilter={typeFilter} setTypeFilter={setTypeFilter} toggleTypeFilter={toggleTypeFilter} />
            : <TagsTab tagFilter={tagFilter} setTagFilter={setTagFilter} toggleTagFilter={toggleTagFilter} />
          }
        </motion.div>
      </AnimatePresence>
    </>
  )

}



function TabHeader ({label, id, tab, setTab, active=[]}) {
  return (
    <div onClick={() => setTab(id)} style={{
        borderColor: tab === id ? '#ffffffcc' : 'transparent',
        color: tab === id ? 'white' : '#aaa'
      }} className='w-full text-center uppercase tracking-wider cursor-pointer border-b-2 transition-all'>
      {label}{active.length ? <span className='text-(--accent)'> ~ {active.length}</span> : null}
    </div>
  )
}



function TypesTab({typeFilter, setTypeFilter, toggleTypeFilter}) {
  return (
    <>
      <div 
        onClick={() => setTypeFilter([])} 
        className='hover:bg-[#252525] cursor-pointer transition-colors grid items-center gap-3 px-2 py-1.5 grid-cols-[1fr_5fr_1fr]'
        style={{
          color: !typeFilter.length ? 'black' : 'white', 
          borderColor: !typeFilter.length ? '#252525' : 'transparent',  
          backgroundColor: !typeFilter.length ? '#aaa' : null,
          fontWeight: !typeFilter.length ? '600' : '100'
        }}
      >
        <div/>
        <p>All</p>
        <div className='flex items-center justify-end text-black'>
          {typeFilter.length === 0 ? <Check size={15} /> : null}
        </div>
      </div>
      <hr className='my-1 opacity-20'/>
      { GetAllContactTypes().map((t) => {
        const selected = typeFilter.includes(t.uid);
        return (
          <div 
            key={t.uid} 
            onClick={() => toggleTypeFilter(t.uid)} 
            className='hover:bg-[#202020] cursor-pointer transition-colors grid items-center gap-3 px-2 py-1.5 grid-cols-[1fr_5fr_1fr] border-b border-t' 
            style={{
              color: selected ? 'black' : t.colour, 
              borderColor: selected ? '#252525' : 'transparent',  
              backgroundColor: selected ? t.colour : null,
              fontWeight: selected ? '600' : '100'
            }}
          >
            {t.icon}
            <p>{t.name}</p>
            <div className='flex items-center justify-end text-black'>
              {selected ? <Check size={15} /> : null}
            </div>
          </div>
        )
      })}
    </>
  )
}



function TagsTab({tagFilter, setTagFilter, toggleTagFilter}) {

  const [search, setSearch] = useState('');
  const [filteredContactTags, setFilteredContactTags] = useState(contactTags);

  useEffect(() => {
    const trimSearch = search.trim().toLowerCase();
    if(trimSearch.length === 0) setFilteredContactTags(contactTags);
    else {
      let newGroups = {}
      Object.keys(contactTags.groups)
        .filter((k) => GetTagName(k).toLowerCase().includes(trimSearch))
        .forEach((k) => newGroups[k] = contactTags.groups[k]
      );
      let newTags = contactTags.tags.filter((t) => GetTagName(t).toLowerCase().includes(trimSearch));
      setFilteredContactTags({
        ...contactTags,
        groups: newGroups,
        tags: newTags
      })
    }
  }, [search])
  
  return (
    <>
      <div 
        onClick={() => setTagFilter([])} 
        className='hover:bg-[#252525] cursor-pointer transition-colors grid items-center gap-3 px-2 py-1.5 grid-cols-[1fr_5fr_1fr]'
        style={{
          color: !tagFilter.length ? 'black' : 'white', 
          borderColor: !tagFilter.length ? '#252525' : 'transparent',  
          backgroundColor: !tagFilter.length ? '#aaa' : null,
          fontWeight: !tagFilter.length ? '600' : '100'
        }}
      >
        <div/>
        <p>All</p>
        <div className='flex items-center justify-end text-black'>
          {tagFilter.length === 0 ? <Check size={15} /> : null}
        </div>
      </div>

      <hr className='my-1 opacity-20'/>

      <div className='w-full py-0.5 flex justify-center items-center'>
        <input value={search} onChange={(e) => setSearch(e.target.value)} className='w-[85%] bg-black border border-white/40 rounded-full px-3 py-1 text-sm focus:outline-none focus:border-white transition-colors' placeholder='search...' />
      </div>

      <hr className='my-1 opacity-20'/>

      { Object.keys(filteredContactTags.groups).map((k) => {
        const g = filteredContactTags.groups[k];
        const selected = g.every(tag => tagFilter.includes(tag));
        const partSelected = !selected && g.some(tag => tagFilter.includes(tag));
        return (
          <div 
            key={k} 
            onClick={() => {
              if(selected) setTagFilter((prev) => prev.filter(t => !g.includes(t)))
              else setTagFilter((prev) => [...prev, ...g.filter(t => !prev.includes(t))])
            }} 
            className='hover:bg-[#202020] cursor-pointer transition-colors grid items-center gap-1 px-2 py-1.5 grid-cols-[1fr_5fr_1fr] border-b border-t border-[#151515]' 
            style={{
              color: (selected || partSelected) ? 'black' : '#fd79a8', 
               background: selected
                ? "#fd79a8"
                : partSelected
                  ? "linear-gradient(to right, #fd79a8 0%, transparent 100%)"
                  : null,
              fontWeight: selected ? '600' : '100'
            }}
          >
            <Tags size={20} />
            <p className='text-sm text-nowrap overflow-hidden text-ellipsis'>{GetTagName(k)}</p>
            <div className='flex items-center justify-end text-black'>
              {selected ? <Check size={15} /> : null}
            </div>
          </div>
        )
      })}

      {Object.keys(filteredContactTags.groups).length ? <hr className='my-1 opacity-20' /> : null}

      { filteredContactTags.tags.map((t) => {
        const selected = tagFilter.includes(t);
        const colour = Object.keys(filteredContactTags.special).includes(t) ? filteredContactTags.special[t].colour : '#95afc0';
        return (
          <div 
            key={t} 
            onClick={() => toggleTagFilter(t)} 
            className='hover:bg-[#202020] cursor-pointer transition-colors grid items-center gap-1 px-2 py-1.5 grid-cols-[1fr_5fr_1fr] border-b border-t' 
            style={{
              color: selected ? 'black' : colour, 
              borderColor: selected ? '#252525' : 'transparent',  
              backgroundColor: selected ? colour : null,
              fontWeight: selected ? '600' : '100'
            }}
          >
            <Tag size={20} />
            <p className='text-sm text-nowrap overflow-hidden text-ellipsis'>{GetTagName(t)}</p>
            <div className='flex items-center justify-end text-black'>
              {selected ? <Check size={15} /> : null}
            </div>
          </div>
        )
      })}
    </>
  )

}


export function GetTagName(id) {
  return id
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
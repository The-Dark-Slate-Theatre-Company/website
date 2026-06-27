import ContactTags from '../../../data/contact-tags/ContactTags.json';

import { useEffect, useRef, useState } from "react"
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../../firebase";
import { DependentContent } from "../../../components/admin-dependent-content/DependentContent";
import { BookType, Check, Filter, PlusCircle, Search, Tag, Tags, User } from "lucide-react";
import { GetAllContactTypes, GetContactType } from "./GetContactType";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { ref } from "firebase/storage";
import { FilterMenu, GetTagName } from "./FilterMenu";


export function AddressBook() {

  const [contacts, setContacts] = useState(null);
  const [filteredContacts, setFilteredContacts] = useState(null);

  const [search, setSearch] = useState(() => sessionStorage.getItem('addressBook.search') || "");
  const [typeFilter, setTypeFilter] = useState(() => JSON.parse(sessionStorage.getItem("addressBook.typeFilter") || "[]"));
  const [tagFilter, setTagFilter] = useState(() => JSON.parse(sessionStorage.getItem("addressBook.tagFilter") || "[]"));

  const [searchPlaceholder, setSearchPlaceholder] = useState('');
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const filterMenuRef = useRef(null);

  const navigate = useNavigate();


  const toggleTypeFilter = (id) => {
    if(typeFilter.includes(id)) setTypeFilter((prev) => prev.filter(x => x !== id));
    else setTypeFilter((prev) => [...prev, id]);
  }


  const toggleTagFilter = (id) => {
    if(tagFilter.includes(id)) setTagFilter((prev) => prev.filter(x => x !== id));
    else setTagFilter((prev) => [...tagFilter, id]);
  }


  useEffect(() => {
    sessionStorage.setItem('addressBook.search', search);
    sessionStorage.setItem('addressBook.typeFilter', JSON.stringify(typeFilter));
    sessionStorage.setItem('addressBook.tagFilter', JSON.stringify(tagFilter));
  }, [search, typeFilter, tagFilter]);


  useEffect(() => {
    async function getContacts() {
      const collectionRef = query(collection(db, 'address-book'), orderBy('search_index'));
      const snaps = await getDocs(collectionRef);
      const data = snaps.docs.map((d) => d.data());
      setContacts(data);
    }
    getContacts();
  }, []);


  // Apply search and filters
  useEffect(() => {
    setFilteredContacts(filterContacts(contacts, search, typeFilter, tagFilter));
  }, [contacts, search, typeFilter, tagFilter])


  // Handle clicking off TypeFilter menu
  useEffect(() => {
    function handleClick(e) {
      if(filterMenuRef.current && !filterMenuRef.current.contains(e.target)) {
        setFilterMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);


  return (
    <DependentContent dependency={filteredContacts}>
      {
        filteredContacts && 
        <> 
          <div className='w-full flex justify-center'>
            <div className='w-full max-w-250 grid grid-cols-[30fr_1fr] gap-6 mb-4'>
              <div style={{
                  borderBottomLeftRadius: (typeFilter.length || tagFilter.length) ? 0 : '4px',
                  borderBottomRightRadius: (typeFilter.length || tagFilter.length) ? 0 : '4px',
                }} 
                className='relative w-full bg-black px-4 py-2 border-white/20 border rounded-t-sm flex gap-4 items-center'
              >
                <Search className='text-(--accent)' size={20} />
                <input 
                  style={{paddingTop: search.trim().length ? '8px' : null, paddingBottom: search.trim().length ? '8px' : null}} 
                  className='w-full focus:outline-none focus:text-white not-focus:text-[#aaa] focus:py-2 transition-all' 
                  value={search} onChange={(e) => setSearch(e.target.value)} 
                  placeholder='search...'
                />
                <AnimatePresence>
                  { (typeFilter.length || tagFilter.length)
                    ? <motion.div 
                        initial={{height: 0, opacity: 0}} animate={{height: 25, opacity: 1}} exit={{height: 0, opacity: 0}} transition={{duration: 0.2}}
                        className='absolute w-[calc(100%+2px)] -left-px top-full mt-px px-4 py-1 bg-[#191919] border-white/20 border border-t-0 rounded-b-sm overflow-hidden'
                      >
                        <div className='w-full min-w-0 text-xs text-(--accent) flex items-center tracking-wide flex-nowrap overflow-hidden text-nowrap text-ellipsis'>
                          {typeFilter.length ? <BookType size={16} className='shrink-0 mr-2' /> : null}
                          <p>{typeFilter.map((t,i) => `${GetContactType(t).name}${i!==typeFilter.length-1?', ':''}`) }</p>
                          {tagFilter.length ? <Tags size={16} style={{marginLeft: typeFilter.length ? '16px' : '0'}} className='shrink-0 mr-2' /> : null}
                          <p>{tagFilter.map((t,i) => `${GetTagName(t)}${i!==tagFilter.length-1?', ':''}`)}</p>
                        </div>
                      </motion.div>
                    : null
                  }
                </AnimatePresence>
              </div>
              <div className='flex items-center gap-4'>
                <div className='relative'>
                  <div title='Filters' style={{color: (typeFilter.length || tagFilter.length) ? 'black' : null, backgroundColor: (typeFilter.length || tagFilter.length) ? 'var(--accent)' : 'transparent'}} className='p-1 rounded-full relative text-[#aaa] hover:text-(--accent) transition-colors cursor-pointer'>
                    <Filter onClick={() => setFilterMenuOpen(true)} size={20} />
                  </div>
                  <AnimatePresence>
                    { filterMenuOpen && 
                      <motion.div ref={filterMenuRef} className='absolute w-60 left-0 -translate-x-4/5 bg-[#151515] rounded-sm drop-shadow-[0_-4px_4px_#000000aa] overflow-hidden' initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} transition={{duration: 0.1}}>
                        <FilterMenu 
                          typeFilter={typeFilter} 
                          setTypeFilter={setTypeFilter} 
                          toggleTypeFilter={toggleTypeFilter} 
                          tagFilter={tagFilter}
                          setTagFilter={setTagFilter}
                          toggleTagFilter={toggleTagFilter}
                        />
                      </motion.div>
                    }
                  </AnimatePresence>
                </div>
                <div title='New Contact' onClick={() => navigate('/admin/address-book/new-contact')} className='text-[#aaa] hover:text-(--accent) transition-colors cursor-pointer'>
                  <PlusCircle size={20} />
                </div>
              </div>
            </div>
          </div>
          <div className='flex flex-col gap-1 pb-12'>
            {
              filteredContacts.map((c, i) => {
                let newLetter = true;
                const firstLetter = c.search_index[0];
                if(i > 0) {
                  const prevFirstLetter = filteredContacts[i-1].search_index[0];
                  newLetter = (firstLetter !== prevFirstLetter);
                }

                const type = GetContactType(c.type, 20);
                
                return (
                  <div key={c.uid} className='w-full'>
                    { newLetter && <h1 className='uppercase text-3xl font-bold text-[#777] border-b-2 border-[#222] mt-6 mb-2'>{firstLetter}</h1> }
                    <div onClick={() => navigate(`/admin/address-book/${c.uid}`)} className='grid grid-cols-[1fr_30fr_1fr] md:grid-cols-[1fr_10fr_20fr_1fr] gap-4 md:gap-8 items-center bg-[#101010] p-2 rounded-sm hover:bg-[#151515] transition-colors duration-100 cursor-pointer'>
                      <div className='w-10 aspect-square overflow-hidden flex justify-center items-center rounded-full border-white/20 border'>
                        {
                          c.photo.url 
                          ? <img src={c.photo.url} className='w-full h-full object-cover' />
                          : <User className='text-[#aaa]' size={18} />
                        }
                      </div>
                      <p className='text-[#aaa] tracking-wide text-nowrap overflow-hidden text-ellipsis'>{
                        c.type === 'individual' 
                        ? <>{c.first_name} <b className='text-[#ccc]'>{c.last_name}</b></>
                        : <>{c.org_name.toLowerCase().startsWith('the ') ? 'The ' : ''}<b className='text-[#ccc]'>{c.org_name.replace(/^the\s+/i, '')}</b></>
                      }</p>
                      {
                        tagFilter.length 
                        ? <div className='flex w-full gap-2 text-sm not-md:hidden'>
                            {
                              c.tags.filter(t => tagFilter.includes(t)).map((t, i) => {
                                if(i>2) return null;
                                return (
                                  <div className='px-2 py-1 flex items-center gap-2 bg-[#202020] rounded-full text-nowrap overflow-hidden' style={{color: getTagColour(t)}}>
                                    <Tag size={15} />
                                    {GetTagName(t)}
                                  </div>
                                )
                              })
                            }
                            {
                              c.tags.filter(t => tagFilter.includes(t)).length > 3 
                              ? <div className='px-2 py-1 flex items-center gap-2 bg-[#202020] rounded-full text-nowrap overflow-hidden'>
                                  +{c.tags.filter(t => tagFilter.includes(t)).length - 3}
                                </div>
                              : null
                            }
                          </div>
                        : <p className='text-[#777] not-md:hidden text-nowrap overflow-hidden text-ellipsis'>{c.company.name ?? ''}</p>
                      }
                      <div title={type.name} style={{color: type.colour}} className='mr-2'>
                        { type.icon }
                      </div>
                    </div>
                  </div>
                )
              })
            }
          </div>
        </>
      }
    </DependentContent>
  )
}



function filterContacts(contacts, search, typeFilter, tagFilter) {
  if(!contacts) return null;

  const s = search.trim().toLowerCase();
  if(s.length === 0 && typeFilter.length === 0 && tagFilter.length === 0) return contacts;

  function getRelevance(contact) {
    const fullName = contact.type === 'individual' ? `${contact.first_name} ${contact.last_name}` : contact.org_name
    const fields = [
      fullName,
      contact.company.name,
      contact.company.role,
    ];
    const index = fields.findIndex((field) => field?.toLowerCase().includes(s));
    return index === -1 ? Infinity : index;
  }

  return contacts 
    .filter((contact) => typeFilter.length === 0 || typeFilter.includes(contact.type))
    .filter((contact) => tagFilter.length === 0 || tagFilter.some(tag => contact.tags?.includes(tag)))
    .filter((contact) => getRelevance(contact) !== Infinity)
    .sort((a, b) => getRelevance(a) - getRelevance(b));
}


function getTagColour(tag) {
  return Object.keys(ContactTags.special).includes(tag) ? ContactTags.special[tag].colour : '#95afc0';
}
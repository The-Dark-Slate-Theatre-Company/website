import { useEffect, useRef, useState } from "react"
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../../firebase";
import { DependentContent } from "../../../components/admin-dependent-content/DependentContent";
import { Check, Filter, PlusCircle, Search, User } from "lucide-react";
import { GetAllContactTypes, GetContactType } from "./GetContactType";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { ref } from "firebase/storage";


export function AddressBook() {

  const [contacts, setContacts] = useState(null);

  const [filteredContacts, setFilteredContacts] = useState(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState([]);

  const [typeFilterOpen, setTypeFilterOpen] = useState(false);
  const typeFilterRef = useRef(null);

  const navigate = useNavigate();


  const toggleFilter = (id) => {
    if(typeFilter.includes(id)) setTypeFilter((prev) => prev.filter(x => x !== id));
    else setTypeFilter((prev) => [...prev, id]);
  }


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
    setFilteredContacts(filterContacts(contacts, search, typeFilter));
  }, [contacts, search, typeFilter])


  // Handle clicking off TypeFilter menu
  useEffect(() => {
    function handleClick(e) {
      if(typeFilterRef.current && !typeFilterRef.current.contains(e.target)) {
        setTypeFilterOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [])


  return (
    <DependentContent dependency={filteredContacts}>
      {
        filteredContacts && 
        <> 
          <div className='w-full flex justify-center'>
            <div className='w-full max-w-250 grid grid-cols-[30fr_1fr] gap-6 mb-4'>
              <div className='w-full bg-black px-4 py-2 border-white/20 border rounded-sm flex gap-4 items-center'>
                <Search className='text-(--accent)' size={20} />
                <input style={{paddingTop: search.trim().length ? '8px' : null, paddingBottom: search.trim().length ? '8px' : null}} className='w-full focus:outline-none focus:text-white not-focus:text-[#aaa] focus:py-2 transition-all' value={search} onChange={(e) => setSearch(e.target.value)} placeholder='search...' />
              </div>
              <div className='flex items-center gap-4'>
                <div className='relative'>
                  <div title='Filters' style={{color: typeFilter.length ? 'black' : null, backgroundColor: typeFilter.length ? 'var(--accent)' : 'transparent'}} className='p-1 rounded-full relative text-[#aaa] hover:text-(--accent) transition-colors cursor-pointer'>
                    <Filter onClick={() => setTypeFilterOpen(true)} size={20} />
                  </div>
                  <AnimatePresence>
                    { typeFilterOpen && 
                      <motion.div ref={typeFilterRef} className='absolute w-60 left-0 -translate-x-4/5 bg-[#151515] rounded-sm drop-shadow-[0_-4px_4px_#000000aa] overflow-hidden' initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} transition={{duration: 0.1}}>
                        <div onClick={() => setTypeFilter([])} className='hover:bg-[#252525] cursor-pointer transition-colors grid items-center gap-3 px-2 py-1.5 grid-cols-[1fr_5fr_1fr]'>
                          <div/>
                          <p>All</p>
                          <div className='flex items-center justify-end'>
                            {typeFilter.length === 0 ? <Check size={15} /> : null}
                          </div>
                        </div>
                        <hr className='my-1 opacity-20'/>
                        { GetAllContactTypes().map((t) => {
                          const selected = typeFilter.includes(t.uid);
                          return (
                            <div onClick={() => toggleFilter(t.uid)} className='hover:bg-[#202020] cursor-pointer transition-colors grid items-center gap-3 px-2 py-1.5 grid-cols-[1fr_5fr_1fr]' style={{color: t.colour, fontWeight: selected ? '600' : null}}>
                              {t.icon}
                              <p>{t.name}</p>
                              <div className='flex items-center justify-end text-white'>
                                {selected ? <Check size={15} /> : null}
                              </div>
                            </div>
                          )
                        })}   
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
                      <p className='text-[#777] not-md:hidden text-nowrap overflow-hidden text-ellipsis'>{c.company.name ?? ''}</p>
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



function filterContacts(contacts, search, typeFilter) {
  const s = search.trim().toLowerCase();
  if(s.length === 0 && typeFilter.length === 0) return contacts;

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
    .filter((contact) => getRelevance(contact) !== Infinity)
    .sort((a, b) => getRelevance(a) - getRelevance(b));
}
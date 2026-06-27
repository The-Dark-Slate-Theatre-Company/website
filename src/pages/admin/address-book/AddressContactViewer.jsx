import ContactTags from '../../../data/contact-tags/ContactTags.json';

import { Globe, SquarePen, Tag, User, X } from "lucide-react";
import { GetContactType } from "./GetContactType";
import Instagram from '../../../assets/social-logos/instagram.svg';
import Facebook from '../../../assets/social-logos/facebook.svg';
import { GetTagName } from "./FilterMenu";


export function AddressContactViewer({contact: c, setEditing}) {

  const type = GetContactType(c.type);

  return (
    <div className='relative flex not-md:flex-col gap-8 pb-12'>
      <SquarePen onClick={() => setEditing(true)} className='absolute top-0 md:top-2 right-0 text-[#aaa] hover:text-white transition-colors cursor-pointer' size={20} />
      <div className='w-35 not-md:w-full flex flex-col items-center gap-6'>
        <div className='w-35 h-35 not-md:w-full not-md:mt-6 flex justify-center md:shrink-0'>
          <div className='w-full not-md:max-w-35 aspect-square overflow-hidden flex justify-center items-center border border-white/20 rounded-full'>
            {
              c.photo.url 
              ? <img src={c.photo.url} className='w-full h-full object-cover' />
              : <User size={60} className='text-[#555]' />
            }
          </div>
        </div>
        <div className='not-md:hidden'>
          <SocialSection c={c} />
        </div>
      </div>

      <div className='md:mt-6 w-full flex flex-col gap-2'>
        <h1 className='text-3xl tracking-wide not-md:text-center'>{
          c.type === 'individual' 
          ? `${c.first_name} ${c.last_name}`
          : c.org_name
        }</h1>
        {
          c.company.name && 
          <p className='not-md:text-center leading-5 text-lg tracking-wide text-[#aaa]'>{c.company.role ? `${c.company.role}, ` : ''}<span className='text-(--accent)'>{c.company.name}</span></p>
        }
        <div className='flex not-md:justify-center mt-2'>
          <div style={{backgroundColor: `${type.colour}cc`}} className='px-3 py-1 rounded-full border-white/20 border text-black uppercase text-sm font-bold flex justify-center items-center gap-3'>
            {type.icon}
            <p className='select-none'>{type.name}</p>
          </div>
        </div>
        {
          (c.social?.instagram.length || c.social?.facebook.length || c.social?.website.length)
          ? <div className='w-full flex justify-center mt-4 md:hidden'>
              <SocialSection c={c} />
            </div>
          : null
        }
        
        {
          c.tags.length 
          ? <>
              <hr className='mt-4 mb-2 opacity-20 md:hidden' />
              <div className='w-full flex not-md:justify-center'>
                <div className='w-full max-w-100 md:max-w-175 flex flex-wrap mt-2 md:mt-6 not-md:justify-center gap-x-4 gap-y-0.5 md:border-l-2 border-[#222] md:pl-4'>
                  {
                    c.tags.map((t) => (
                      <div 
                        key={t} 
                        style={{color: getTagColour(t)}}
                        className='text-black text-xs md:text-sm rounded-full flex items-center gap-1 font-bold tracking-wide opacity-90'
                      >
                        <Tag size={15} />
                        {GetTagName(t)}
                      </div>
                    ))
                  }
                </div>
              </div>
            </>
          : null
        }

        <hr className='my-4 opacity-20' />

        {c.notes.length 
          ? <>
              <p className='text-sm font-bold tracking-wide text-[#aaa]'>Notes:</p>
              {
                c.notes.length > 1 
                ? <ul className='list-disc pl-9 text-[#ddd]'>
                    {c.notes.map((n) => <li key={n.uid}>{n.data}</li>)}
                  </ul>
                : <p className='text-[#ddd] pl-5 mt-1'>{c.notes[0].data}</p>
              }
              <hr className='my-4 opacity-20' />
            </>
          : null
        }

        <ContactSection label='Email' contacts={c.emails} />
        <ContactSection label='Phone Number' contacts={c.phones} />

        {((c.emails.length || c.phones.length) && c.address.length) ? <hr className='my-4 opacity-20' /> : null}

        {
          c.address.length
          ? <div className='bg-[#101010] p-4 rounded-sm border border-white/10'>
              <p className='text-sm font-bold tracking-wide text-[#aaa] mb-2'>Address:</p>
              <div className='flex flex-col gap-1 ml-2'>
                {
                  c.address.map((a) => {
                    const addressArray = [a.house_and_street, a.town_or_city, a.county_or_country, a.postcode].filter(x => x.trim().length);
                    let addressString = ''
                    addressArray.forEach((x,i) => addressString = addressString + `${x}${i === addressArray.length-1 ? '' : ', '}`)
                    return (
                      <div key={a.uid} className='flex items-end gap-2'>
                        <p title='Click to copy' onClick={() => copyLink(addressString)} className='text-[#74b9ff] text-nowrap overflow-hidden text-ellipsis hover:underline cursor-copy'>{addressString}</p>
                        { a.label && <p className='text-[#aaa] mb-px text-sm shrink-0'>({a.label})</p> }
                      </div>
                    )
                  })
                }
              </div>
            </div>
          : null
        }

      </div>
    </div>
  )

}


function getTagColour(tag) {
  return Object.keys(ContactTags.special).includes(tag) ? ContactTags.special[tag].colour : '#95afc0';
}


function SocialSection({c}) {
  return (
    <div className='flex gap-3 items-center'>
      {
        c.social?.instagram.trim().length 
        ? <a href={`https://instagram.com/${c.social.instagram}`} target='_blank'>
            <img className='mt-2 w-6 opacity-60 hover:opacity-90 transition-opacity cursor-pointer' src={Instagram} />
          </a>
        : null
      }
      {
        c.social?.facebook.trim().length 
        ? <a href={`https://facebook.com/${c.social.instagram}`} target='_blank'>
            <img className='mt-2 w-6 opacity-60 hover:opacity-90 transition-opacity cursor-pointer' src={Facebook} />
          </a>
        : null
      }
      {
        c.social?.website.trim().length
        ? <a href={c.social.website} target='_blank'>
            <Globe size={26} className='mt-2 -ml-0.5 opacity-60 hover:opacity-90 transition-opacity cursor-pointer' />
          </a>
        : null
      }
    </div>
  )
}


function ContactSection({label, contacts}) {
  if(!contacts.length) return null;

  return (
    <div className='bg-[#101010] p-4 rounded-sm border border-white/10'>
      <p className='text-sm font-bold tracking-wide text-[#aaa] mb-2'>{label}:</p>
      <div className='flex flex-col gap-1 ml-2'>
        {
          contacts.map((c) => 
            <div key={c.uid} className='flex items-end gap-2'>
              <p title='Click to copy' onClick={() => copyLink(c.data)} className='text-[#74b9ff] flex-nowrap overflow-hidden text-ellipsis hover:underline cursor-copy'>{c.data}</p>
              { c.label && <p className='text-[#aaa] mb-px text-sm shrink-0'>({c.label})</p> }
            </div>
          )
        }
      </div>
    </div>
  )
}


async function copyLink(str) {
  await navigator.clipboard.writeText(str);
  alert(`Copied ${str}`);
}
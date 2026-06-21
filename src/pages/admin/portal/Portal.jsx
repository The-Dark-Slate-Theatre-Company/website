import MyBio from '../../../assets/graphics/admin-portal-icons/my-bio.png';
import Inbox from '../../../assets/graphics/admin-portal-icons/inbox.png';
import Productions from '../../../assets/graphics/admin-portal-icons/productions.png';
import Resources from '../../../assets/graphics/admin-portal-icons/resources.png';


import { useNavigate } from 'react-router-dom';


/**
 *  <TabCard label='Productions' to='/productions' src={Productions} />
    <TabCard label='Resources' to='/resources' src={Resources} />
 */


export function Portal() {
  return (
    <div className='w-full flex flex-col gap-8'>

      <TabCardSection label='Admin'>
        <TabCard label='Inbox' to='/inbox' src={Inbox} />
      </TabCardSection>

      <TabCardSection label='Site Controls'>
        <TabCard label='My Bio' to='/bio' src={MyBio} />
      </TabCardSection>

    </div>
  )
}


function TabCardSection({label, children}) {
  return (
    <div className='w-full'>
      <h1 className='w-full text-2xl border-b-2 border-white/20 pb-2 mb-6'>{label}</h1>
      <div className='w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 pb-8'>
        {children}
      </div>
    </div>
  )
}


function TabCard({label, to, src}) {

  const navigate = useNavigate();

  return (
    <div onClick={() => navigate(`/admin${to}`)} className='group relative bg-[#101010] h-50 p-4 rounded-sm cursor-pointer hover:bg-[#141414] transition-colors flex flex-col items-center justify-center gap-4 overflow-hidden'>
      <div className='h-0 group-hover:h-full absolute bottom-0 w-full bg-(--accent) transition-all duration-300 z-1' />
      <div className='h-25 flex items-center mt-4 z-2 group-hover:scale-105 transition-all duration-300'>
        <img className='h-full object-cover brightness-100 group-hover:brightness-0 transition-all duration-200' src={src} />
      </div>
      <p className='mb-4 text-lg group-hover:text-black transition-colors duration-200 z-2 border-b-2 border-transparent group-hover:border-black'>{label}</p>
    </div>
  )
}
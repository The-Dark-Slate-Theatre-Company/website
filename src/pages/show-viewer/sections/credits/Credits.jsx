import { useNavigate } from "react-router-dom";
import { SectionContainer } from "../../SectionContainer";
import { ChevronRight, MoveRight } from "lucide-react";


export function Credits({credits, uid, isPreview}) {

  const navigate = useNavigate();

  if(!credits.length) return null;

  const mostRecent = credits.find(x => x.most_recent);

  return (
    <SectionContainer>
      <div className='w-full mt-15 mb-10 flex flex-col items-center gap-12'>
        <h1 className='text-lg uppercase tracking-widest font-bold text-(--accent) -mb-4'>Credits</h1>
        <CreditSection large section={mostRecent.exec} />
        <CreditSection label='Performing Company' section={mostRecent.cast} />
        <CreditSection label='Production Team' section={mostRecent.crew} />
        {
          credits.length > 1 
          ? <button 
              title={isPreview ? 'Cannot open credits page in preview' : ''}
              onClick={() => { if(!isPreview) navigate(`/shows/${uid}/credits`) }} 
              className={`${isPreview ? 'cursor-not-allowed' : 'hover:border-white cursor-pointer'} mt-5 border-b-2 px-4 pb-2 text-(--accent) font-bold border-transparent transition-all flex gap-2 items-center`}
            >
              <p>see full credits</p>
            </button>
          : null
        }
      </div>
    </SectionContainer>
  )

}


export function CreditSection({section:x, large=false, label=null}) {

  if(!x.length) return null;

  const containerWidthClass = large ? 'max-w-225' : 'max-w-300';
  const itemWidthClass = large ? 'w-[calc(50%-13px)] md:w-[calc(33%-8px)]' : 'w-[calc(50%-13px)] md:w-[calc(20%-13px)] md:min-w-[215px]'

  return (
    <div className='w-full flex flex-col items-center'>
      {
        label 
        ? <p className='uppercase font-bold text-(--accent) text-sm tracking-wider mb-5 pt-10 border-t border-[#222]'>{label}</p>
        : null
      }
      <div className={`${containerWidthClass} w-full flex flex-wrap items-center justify-center gap-y-4 md:gap-4 md:gap-y-8`}>
        {
          x.map((c) => (
            <div className={`${itemWidthClass} shrink-0 flex flex-col items-center justify-center text-center text-nowrap`}>
              <p className='text-xs md:text-sm text-[#aaa]'>{c.role}</p>
              <p className='not-md:text-sm text-[#eee]'>{c.name}</p>
            </div>
          ))
        }
      </div>
    </div>
  )
}
import { SectionContainer } from "../../SectionContainer";


export function Announcement({section:x}) {

  if(!x.label) return null;

  return (
    <SectionContainer>
      <div className='w-full py-3 px-4 my-5 font-bold text-black uppercase tracking-wide text-lg lg:text-xl bg-(--accent) flex not-lg:flex-col justify-center items-center gap-2 lg:gap-8'>
        <p className='text-center'>{x.label}</p>
        {
          x.button_label 
          ? <a href={x.button_link} target='_blank' className='py-1 px-6 border-2 border-black hover:bg-black hover:text-(--accent) transition-colors'>
              {x.button_label}
            </a>
          : null
        }
      </div>
    </SectionContainer>
  )

}
import { SectionContainer } from "../../SectionContainer";


export function Actions({section:x}) {

  if(!x.content.length) return null;

  return (
    <SectionContainer>
      <div className='w-full flex flex-wrap justify-center items-center my-10 gap-3 gap-y-4'>
        {
          x.content.map((a) => (
            <a key={a.uid} href={a.link} target='_blank' className='group outline-none bg-(--accent) text-black font-bold uppercase px-6 py-3 transition-all duration-200 hover:brightness-90'>
              <p className='transition-all duration-200 border-b-2 border-transparent mt-0.5 group-hover:border-black/30'>{a.label}</p>
            </a>
          ))
        }
      </div>
    </SectionContainer>
  )

}
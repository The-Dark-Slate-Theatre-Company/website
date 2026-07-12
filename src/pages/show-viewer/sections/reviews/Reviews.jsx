import { Star, StarHalf } from "lucide-react";
import { SectionContainer } from "../../SectionContainer";


export function Reviews({section:x}) {

  if(!(x.audience.length || x.critic.length)) return null;

  return (
    <SectionContainer>
      <div className='w-full flex flex-col'>
        {
          x.critic.length
          ? <div className='my-10 w-full flex flex-wrap justify-center items-center gap-4 gap-y-12'>
              {
                x.critic.map((r) => {
                  const sizeClass = (
                    x.critic.length === 1 ? 'w-full'
                    : x.critic.length === 2 ? 'w-full md:w-[calc(50%-8px)]'
                    : 'w-full md:w-[calc(50%-8px)] lg:w-[calc(33%-12px)]'
                  )
                  return (
                    <div key={r.uid} className={`${sizeClass} flex flex-col items-center`}>
                      {
                        r.quote 
                        ? <div className='w-full flex flex-col items-center gap-2'>
                            <StarRating stars={r.rating} size={20} />
                            <p className='text-(--accent) text-center lg:text-2xl font-bold font-serif uppercase tracking-wide'>'{r.quote}'</p>
                          </div>
                        : <div className='mb-1'>
                            <StarRating stars={r.rating} size={40} />
                          </div>
                      }
                      <p className='text-sm lg:text-lg text-[#555] flex gap-2'>— <span className='text-[#eee] uppercase tracking-wide mt-0.5'>{r.reviewer}</span> —</p>
                    </div>
                  )
                })
              }
            </div>
          : null
        }
        {
          x.audience.length
          ? <div className='my-15 w-full flex flex-wrap justify-center items-center gap-4 gap-y-12'>
              {
                x.audience.map((r) => {
                  const sizeClass = (
                    x.audience.length === 1 ? 'w-full'
                    : x.audience.length === 2 ? 'w-full md:w-[calc(50%-8px)]'
                    : 'w-full md:w-[calc(50%-8px)] lg:w-[calc(33%-12px)]'
                  )
                  return (
                    <div key={r.uid} className={`${sizeClass} flex flex-col items-center`}>
                      <p className='text-(--accent) text-center lg:text-2xl font-bold font-serif uppercase tracking-wide'>'{r.quote}'</p>
                      <p className='text-sm lg:text-lg text-[#555] flex gap-2'>— <span className='text-[#eee] uppercase tracking-wide mt-0.5'>Audience Review</span> —</p>
                    </div>
                  )
                })
              }
            </div>
          : null
        }
      </div>
    </SectionContainer>
  )
}



function StarRating({stars, size}) {

  if(stars === 0) return null;

  const fullStars = Math.floor(stars);
  const halfStar = stars - fullStars;


  return (
    <div className='flex'>
      {
        Array.from({ length: fullStars }).map( (_, i)  => 
          <Star key={i} size={size} fill='white' stroke='transparent' />
        )
      }
      {
        halfStar
        ? <div style={{width: size/2}}>
            <StarHalf size={size} fill='white' stroke='transparent' />
          </div>
        : null
      }
    </div>
  )

}
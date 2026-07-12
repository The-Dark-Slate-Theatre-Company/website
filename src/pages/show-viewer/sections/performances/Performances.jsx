import { Clock10, MapPin, MapPinCheck, Ticket } from "lucide-react";
import { SectionContainer } from "../../SectionContainer";


export function Performances({performances, currently_showing}) {

  // If there are no performances to show, and the show is no longer running, then return null
  if(!performances.length) return null;

  const today = new Date().toISOString().split("T")[0];

  return (
    <SectionContainer>
      {
        currently_showing 
        ? <div className='my-10 w-full border-[#222] border-2'>
            {
              performances.map((p, i) => {
                const past = p.to < today;
                const textOpacity = past ? 'opacity-60' : 'opacity-100';
                return (
                  <div key={p.uid} className={`grid lg:grid-cols-[9fr_6fr_4fr] gap-2 items-center ${past ? 'bg-[#111]' : 'bg-black'} px-3 py-6 md:px-4 md:py-6 lg:p-7 tracking-wide text-[#ddd]`}>
                    
                    <div className='flex gap-4 lg:gap-10 text-lg md:text-xl'>
                      <div className='shrink-0'>
                        {
                          past 
                          ? <MapPinCheck size={30} className='text-[#555] not-lg:scale-80' />
                          : <MapPin size={30} className='text-(--accent) not-lg:scale-80' />
                        }
                      </div>
                      <p className={textOpacity}>{p.town}{(p.town && p.venue) ? ', ' : ''}<span className='font-bold text-[#eee]'>{p.venue}</span></p>
                    </div>

                    <div className='lg:text-lg not-lg:ml-11.5'>
                      <p className={textOpacity}>{getRunAsString(p.from, p.to)}</p>
                    </div>

                    {
                      !past && 
                      <div className='lg:text-lg text-center not-lg:mx-11.5 not-lg:mt-2'>
                        <div className={`w-full px-4 py-2 ${p.link ? 'bg-(--accent) border-2 border-(--accent) text-black font-bold' : 'bg-transparent border-2 border-[#ccc] text-[#ccc]'}`}>
                          {
                            p.link 
                            ? <a href={p.link} target='_blank' className='w-full h-full flex justify-center items-center gap-3'>
                                <Ticket size={20} />
                                <p>Book Now</p>
                              </a>
                            : <div className='w-full h-full flex justify-center items-center gap-3'>
                                <Clock10 size={20} />
                                <p>Coming Soon</p>
                              </div>
                          }
                        </div>
                      </div>
                    }
                        
                  </div>
                )
              })
            }
          </div>
        : <div className='flex flex-col items-center mb-10'>
            {
              performances.map((p) => (
                <p key={p.uid} className='flex gap-1 md:gap-2 lg:gap-4 text-center lg:text-xl uppercase tracking-wide'>
                  <span>{p.town ? p.town : p.venue}</span>
                  <span className='-mt-0.5'>—</span>
                  <span>{getPastRunAsString(p.from, p.to)}</span>
                </p>
              ))
            }
          </div>
      }
    </SectionContainer>
  )

}


function getRunAsString(from, to) {

  const fromDate = getDateObject(from);
  const toDate = getDateObject(to);

  // From and to are the same date
  if(from === to) return `${fromDate.day} ${fromDate.month} ${fromDate.year}`
  // From and to are in the same month
  else if(fromDate.month === toDate.month && fromDate.year === toDate.year) return `${fromDate.day} - ${toDate.day} ${toDate.month} ${toDate.year}`;
  // From and to are in the same year
  else if(fromDate.year === toDate.year) return `${fromDate.day} ${fromDate.month} - ${toDate.day} ${toDate.month} ${toDate.year}`

  // From and to have dates in different years
  return `${fromDate.day} ${fromDate.month} ${fromDate.year} - ${toDate.day} ${toDate.month} ${toDate.year}`;

}


function getPastRunAsString(from, to) {
  const fromDate = getDateObject(from);
  const toDate = getDateObject(to);

  // From and to are the same date
  if(from === to) return `${fromDate.day} ${fromDate.month} ${fromDate.year}`
  // From and to are in the same month
  else if(fromDate.month === toDate.month && fromDate.year === toDate.year) return `${toDate.month} ${toDate.year}`;
  // From and to are in the same year
  else if(fromDate.year === toDate.year) return `${fromDate.month} - ${toDate.month} ${toDate.year}`

  // From and to have dates in different years
  return `${fromDate.year} - ${toDate.year}`;
}


const getDateObject = (date) => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  try {
    const splitDate = date.split('-');
    const year = splitDate[0];
    const month = months[parseInt(splitDate[1])-1];
    const dayInt = parseInt(splitDate[2]);
    const day = `${dayInt}${[1,21,31].includes(dayInt) ? 'st' : [2,22].includes(dayInt) ? 'nd' : [3,23].includes(dayInt) ? 'rd' : 'th'}`;
    return {day, month, year};
  }
  catch(err) {
    console.error(err);
    return 'Date Needed'
  }
}
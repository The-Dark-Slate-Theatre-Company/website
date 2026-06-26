import log from '../../../data/changelog/Changelog.json';


export function Changelog() {
  return (
    <div className='flex flex-col gap-8 pb-12'>
      <h1 className='mt-6 -mb-6 opacity-40'>[Current]</h1>
      {
        Object.keys(log).map((version, i) => {
          const entry = log[version];

          return (
            <div key={version} >
              <div className='w-full md:w-1/2 grid grid-cols-2 text-xl xl:text-2xl'>
                <h1 className=''><span className='text-[#aaa]'>v.</span> <b className='tracking-wider'>{version}</b></h1>
                <p className='text-end text-[#aaa]'>{entry.date}</p>
              </div>
              <ul className='mt-4 flex flex-col gap-3 list-disc pl-8 md:pl-11 leading-5.5 md:text-lg text-[#aaa]'>
                {
                  entry.changes.map((c, i) => 
                    <li key={i}>{c}</li>
                  )
                }
              </ul>
              {
                !(i === Object.keys(log).length - 1) && <hr className='mt-10 opacity-10' />
              }
            </div>
          )
        })
      }
    </div>
  )
}
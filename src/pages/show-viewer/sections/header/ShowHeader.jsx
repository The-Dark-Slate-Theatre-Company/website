import { useState } from "react";

export function Header({section:x, isPreview, showImages}) {

  const [loaded, setLoaded] = useState(false);

  const src = (
    !isPreview 
      ? x.url
      : showImages[x.uid]?.preview ?? null
  )

  // Check required fields
  if(!src) return null;


  return (
    <div className='w-full aspect-3/1 flex justify-center items-center mt-10 mb-2'>
      <img onLoad={() => setLoaded(true)} src={src} className={`w-full h-full object-cover transition-all duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`} />
    </div>
  )
}
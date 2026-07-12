import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from 'motion/react';


export function Gallery({section:x, isPreview, showImages}) {

  const [selected, setSelected] = useState(null);

  const scrollerRef = useRef(null);
  const groupRefs = useRef([]);
  const imageRefs = useRef([]);
  const scrollTimer = useRef(null);
  const [loadedCount, setLoadedCount] = useState(0);

  const images = (
    !isPreview 
      ? x.images ?? []
      : (
          showImages[x.uid]?.images
            .filter((y) => !y.deleted)
            .map((y) => ({ uid: y.uid, url: y.preview, caption: y.caption }))
        ) ?? []
  )

  const repeatedImages = [...images, ...images, ...images];


  const centreImage = useCallback((index, behaviour='smooth') => {
    const scroller = scrollerRef.current;
    const image = imageRefs.current[index];

    if(!scroller || !image) return;

    const scrollerRect = scroller.getBoundingClientRect();
    const imageRect = image.getBoundingClientRect();

    const imageLeft = scroller.scrollLeft + imageRect.left - scrollerRect.left;

    scroller.scrollTo({
      left: imageLeft - (scroller.clientWidth - imageRect.width) / 2,
      behavior: behaviour
    });
  }, []);


  const findCentredImage = useCallback(() => {
    const scroller = scrollerRef.current;

    if(!scroller) return 0;

    const scrollerRect = scroller.getBoundingClientRect();
    const centre = scrollerRect.left + scrollerRect.width / 2;

    let nearestIndex = 0;
    let nearestDistance = Infinity;

    imageRefs.current.forEach((image, index) => {
      if(!image) return;

      const rect = image.getBoundingClientRect();
      const imageCentre = rect.left + rect.width/2;
      const distance = Math.abs(imageCentre - centre);

      if(distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });

    return nearestIndex;
  }, []);


  const normalisePosition = useCallback(() => {
    const scroller = scrollerRef.current;
    const middleGroup = groupRefs.current[1];

    if (!scroller || !middleGroup) return;

    const groupWidth = middleGroup.offsetWidth;
    const middleStart = middleGroup.offsetLeft;
    const viewportCentre =
      scroller.scrollLeft + scroller.clientWidth / 2;

    if (viewportCentre < middleStart) {
      scroller.scrollTo({
        left: scroller.scrollLeft + groupWidth,
        behavior: "auto",
      });
    } else if (viewportCentre >= middleStart + groupWidth) {
      scroller.scrollTo({
        left: scroller.scrollLeft - groupWidth,
        behavior: "auto",
      });
    }
  }, []);


  const handleScroll = () => {
    clearTimeout(scrollTimer.current);

    scrollTimer.current = setTimeout(() => {
      normalisePosition();
    }, 2000);
  };


  const move = (direction) => {
    const currentIndex = findCentredImage();
    const targetIndex = currentIndex + direction;

    if(imageRefs.current[targetIndex]) {
      centreImage(targetIndex);
    }
  }


  useEffect(() => {
    if(!images.length || loadedCount < repeatedImages.length) return;

    // Start on the first image of the middle copy
    centreImage(images.length, 'auto');
  }, [loadedCount, images.length, repeatedImages.length, centreImage]);


  useEffect(() => {
    return () => clearTimeout(scrollTimer.current);
  }, []);


  if(!images.length) return null;

  return (
    <>
      <AnimatePresence>
        {
          selected && 
          <motion.div
            key='gallery-image'
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.1}}
            className='fixed z-100 inset-0 bg-black/90 backdrop-blur-sm flex justify-center items-center'
            onClick={() => setSelected(null)}
          >
            <GalleryViewer img={selected} />
          </motion.div>
        }
      </AnimatePresence>

      <div className='relative w-full aspect-video sm:aspect-2/1 md:aspect-3/1 lg:aspect-3.5/1 2xl:aspect-4/1 bg-[#101010] py-4 my-2'>

        <div 
          ref={scrollerRef}
          onScroll={handleScroll}
          className='flex h-full overflow-x-auto overflow-y-hidden snap-x snap-mandatory scrollbar-none [&::-webkit-scrollbar]:hidden'
        >
          {[0, 1, 2].map(groupIndex => (
            <div 
              key={groupIndex}
              ref={element => { groupRefs.current[groupIndex] = element }}
              className='flex h-full shrink-0 gap-4 pr-4'
            >
              {
                images.map((image, imageIndex) => {
                  const repeatedIndex = groupIndex * images.length + imageIndex;

                  return (
                    <img 
                      key={`${groupIndex}-${image.uid}`}
                      ref={element => { imageRefs.current[repeatedIndex] = element }}
                      src={image.url}
                      draggable={false}
                      onClick={() => { if(!isPreview) setSelected(image) }}
                      onLoad={() => setLoadedCount(count => count + 1)}
                      onError={() => setLoadedCount(count => count + 1)}
                      title={isPreview ? 'Cannot open fullscreen image in preview' : ''}
                      className={`${isPreview ? 'cursor-not-allowed' : 'cursor-pointer hover:brightness-80'} h-full w-auto max-w-none shrink-0 object-contain snap-center select-none transition-all duration-200`} 
                    />
                  )
                })
              }
            </div>
          ))}
        </div>

        <div onClick={() => move(-1)} className='absolute group left-0 top-0 h-full w-[5%] min-w-16 bg-linear-to-r from-black/90 to-transparent text-black transition-colors cursor-pointer flex justify-center items-center'>
          <div className='w-12 h-12 group-hover:brightness-80 transition-all rounded-full bg-(--accent) flex justify-center items-center'>
            <ChevronLeft className='-ml-0.5' size={30} />
          </div>
        </div>

        <div onClick={() => move(1)} className='absolute group right-0 top-0 h-full w-[5%] min-w-16 bg-linear-to-l from-black/90 to-transparent text-black transition-colors cursor-pointer flex justify-center items-center'>
          <div className='w-12 h-12 group-hover:brightness-80 transition-all rounded-full bg-(--accent) flex justify-center items-center'>
            <ChevronRight className='ml-0.5' size={30} />
          </div>
        </div>

      </div>
    </>
  )

}



function GalleryViewer({img}) {

  const [loaded, setLoaded] = useState(false);

  return (
    <motion.div 
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      transition={{duration: 0.2}}
      className='relative w-full max-w-250 h-full flex flex-col justify-center items-center gap-4' 
    >
      <div className='relative max-w-[90%] h-[80%]'>
        <img onLoad={() => setLoaded(true)} className={`w-full h-full relative z-2 object-contain transition-all duration-200 ${loaded ? 'opacity-100' : 'opacity-0'}`} src={img.url} />
      </div>
      {img.caption && <p className='text-sm italic text-[#aaa] text-center rounded-sm'>{img.caption}</p>}
    </motion.div>
  )
}
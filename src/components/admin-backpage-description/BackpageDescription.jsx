import QuestionMark from '../../assets/graphics/question-mark.png';

export function BackpageDescription({children}) {
  return (
    <div className='w-full flex justify-center'>
      <div className='w-[95%] max-w-200 bg-[#101010] border border-white/20 rounded-sm p-4 flex items-center gap-4 md:gap-8'>
        <div className='w-12 shrink-0 aspect-square md:ml-2'>
          <img className='w-full object-cover opacity-50' src={QuestionMark} />
        </div>
        <p className='italic text-white/40'>
          {children}
        </p>
      </div>
    </div>
  )
}
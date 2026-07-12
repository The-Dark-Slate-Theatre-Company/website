
export function SectionContainer({maxWidth='max-w-300', children}) {
  return(
    <div className='w-full flex justify-center'>
      <div className={`w-[90%] ${maxWidth} flex justify-center`}>
        {children}
      </div>
    </div>
  )
}
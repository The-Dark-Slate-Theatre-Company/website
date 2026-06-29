

export function PageTitle({className, children}) {
  return (
    <div className='relative w-full'>
      <h1 className={`${className} text-5xl md:text-6xl font-donau tracking-widest pb-5 mb-8`}>{children}</h1>
      <hr className='absolute bottom-0 w-full max-w-25 border border-(--accent)' />
    </div>
  )
}
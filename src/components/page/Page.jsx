
export function Page({children}) {
  return (
    <div className='mt-35 mb-12 w-full flex justify-center'>
      <div className='w-[90%] max-w-300'>
        {children}
      </div>
    </div>
  )
}
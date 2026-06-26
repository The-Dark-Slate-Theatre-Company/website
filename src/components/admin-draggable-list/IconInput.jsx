

export function IconInput({icon, value, onChange, placeholder}) {
  return (
    <div className='w-full flex items-center gap-4 bg-[#050505] px-2 py-1'>
      <div className='text-[#555]'>{icon}</div>
      <input placeholder={placeholder} className='w-full focus:text-(--accent) focus:outline-none transition-colors' value={value} onChange={onChange} placeholder={placeholder} />
    </div>
  )
}


export function IconlessInput({value, onChange, placeholder}) {
  return (
    <div className='w-full bg-[#050505] px-2 py-1'>
      <input placeholder={placeholder} className='w-full focus:text-(--accent) focus:outline-none transition-colors' value={value} onChange={onChange} placeholder={placeholder} />
    </div>
  )
}
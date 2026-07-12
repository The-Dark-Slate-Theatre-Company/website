

export function AdminInput({label, value, onChange, placeholder, type='text', className='', labelClassName=''}) {
  return (
    <div className='w-full'>
      <p className={`${labelClassName} text-sm text-[#aaa] mb-0.5`}>{label}:</p>
      <input value={value} onChange={onChange} type={type} placeholder={placeholder} className={`${adminInputClass} ${className}`} />
    </div>
  )
}


export function AdminInputLabel({label}) {
  return (
    <p className='text-sm text-[#aaa] mb-0.5'>{label}:</p>
  )
}


export const adminInputClass = 'w-full px-3 py-1 bg-[#101010] rounded-sm text-lg border border-white/20 focus:outline-none focus:border-(--accent)'
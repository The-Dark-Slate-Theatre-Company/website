import { PlusCircle } from "lucide-react";


export function AddListItemButton({onClick, children}) {
  return (
    <div onClick={onClick} className='w-30 mt-6 mb-3 text-sm flex items-center gap-2 cursor-pointer text-[#999] hover:text-white transition-colors'>
      <PlusCircle size={20} />
      {children}
    </div>
  )
}
import { Copy, GripHorizontal, Trash2 } from "lucide-react";
import { Reorder } from "motion/react";


export function DraggableListItem({value, onDelete, onDuplicate=null, children}) {
  return (
    <Reorder.Item 
      key={value.uid}
      value={value}
      className='w-full grid items-center grid-cols-[1fr_30fr_1fr] gap-3 px-3 py-2 bg-[#151515] rounded-sm'
    >
      <GripHorizontal className='cursor-grab text-[#aaa]' />
      {children}
      <div className='flex justify-end items-center gap-4'>
        { onDuplicate && <Copy onClick={onDuplicate} size={20} className='text-[#aaa] cursor-pointer hover:text-[#3498db] transition-colors'/> }
        <Trash2 onClick={onDelete} size={20} className='text-[#aaa] cursor-pointer hover:text-[#e74c3c] transition-colors' />
      </div>
    </Reorder.Item>
  )
}
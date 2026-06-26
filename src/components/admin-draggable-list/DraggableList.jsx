import { Reorder } from "motion/react";


export function DraggableList({values, onReorder, children}) {
  return (
    <Reorder.Group 
      axis='y'
      values={values}
      onReorder={(e) => onReorder(e)}
      className='flex flex-col gap-3'
    >
      {children}
    </Reorder.Group>
  )
}
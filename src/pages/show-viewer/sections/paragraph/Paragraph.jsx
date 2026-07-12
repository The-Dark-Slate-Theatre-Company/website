import { SectionContainer } from "../../SectionContainer";
import ReactMarkdown from "react-markdown";

export function Paragraph({section: x}) {
  
  if(!x.content.trim()) return null;

  return (
    <SectionContainer maxWidth='max-w-225'>
      {
        x.style === 'text' 
        ? <div className='lg:text-lg xl:text-xl text-center my-2 text-[#ccc]'>
            <ReactMarkdown>
              { x.content }
            </ReactMarkdown>
          </div>
        : <div className='text-2xl xl:text-3xl text-center my-5 text-(--accent) italic font-serif'>
            <p>"{x.content}"</p>
          </div>
      }
    </SectionContainer>
  )

}
import { useLocation, useOutletContext } from "react-router-dom"
import { Page } from "../../components/page/Page";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { AnimatePresence, motion } from "motion/react";
import { PageTitle } from "../../components/page-title/PageTitle";
import { Header } from "./sections/header/ShowHeader";
import { Title } from "./sections/title/Title";
import { Paragraph } from "./sections/paragraph/Paragraph";
import { Gallery } from "./sections/gallery/Gallery";
import { Performances } from "./sections/performances/Performances";
import { Announcement } from "./sections/announcement/Announcement";
import { Reviews } from "./sections/reviews/Reviews";
import { Actions } from "./sections/actions/Actions";
import { Credits } from "./sections/credits/Credits";


export function ShowViewer({preview=null, showImages=null}) {

  const isPreview = (preview !== null);
  const { show } = isPreview ? { show: preview } : useOutletContext();
  const firstIsHeader = (show?.show_page.content[0]?.type === 'header')


  return (
    <>
      <AnimatePresence>
        {
          show && 
          <motion.div initial={{opacity: 0}} animate={{opacity: 1}} transition={{duration: 0.2}} className={firstIsHeader ? 'pt-10' : 'pt-30'}>
            {
              show.show_page.content.map((section) => 
                section.type === 'header' 
                ? <Header key={section.uid} section={section} isPreview={isPreview} showImages={showImages} />
                : section.type === 'title' 
                ? <Title key={section.uid} section={section} />
                : section.type === 'paragraph' 
                ? <Paragraph key={section.uid} section={section} />
                : section.type === 'gallery' 
                ? <Gallery key={section.uid} section={section} isPreview={isPreview} showImages={showImages} />
                : section.type === 'performances' 
                ? <Performances key={section.uid} performances={show.performances} currently_showing={show.currently_showing} />
                : section.type === 'credits' 
                ? <Credits key={section.uid} credits={show.credits} uid={show.uid} isPreview={isPreview} />
                : section.type === 'reviews' 
                ? <Reviews key={section.uid} section={section} />
                : section.type === 'announcement' 
                ? <Announcement key={section.uid} section={section} />
                : section.type === 'actions' 
                ? <Actions key={section.uid} section={section} />
                : null
              )
            }
          </motion.div>
        }
      </AnimatePresence>
    </>
  )
}
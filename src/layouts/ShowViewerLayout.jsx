import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { db } from "../firebase";
import { ShowViewer } from "../pages/show-viewer/ShowViewer";


export function ShowViewerLayout({preview=null, showImages=null}) {

  const [show, setShow] = useState(preview);
  
  const { showId } = useParams();

  const navigate = useNavigate();


  useEffect(() => {
    async function getShow() {
      const showRef = doc(db, 'shows', showId);
      const snap = await getDoc(showRef);
      if(!snap.exists()) navigate('/shows');
      else {
        const data = snap.data();
        if(!data.public && !isPreview) navigate('/shows');
        else setShow(data);
      }
    }
    if(preview === null) getShow();
  }, []);

  // Set show page accent colour
  useEffect(() => {
    if(!show) return;
    const root = document.documentElement;
    const previousAccent = root.style.getPropertyValue('--accent');
    if(show.accent_colour) root.style.setProperty('--accent', show.accent_colour);

    return () => root.style.setProperty('--accent', previousAccent);
  }, [show]);

  
  if(preview) return <ShowViewer preview={preview} showImages={showImages} />

  return <Outlet context={{ show }} />

}
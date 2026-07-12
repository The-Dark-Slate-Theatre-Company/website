import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Home } from './pages/home/Home'
import { HeaderLayout } from './layouts/HeaderLayout'
import { Contact } from './pages/contact/Contact'
import { About } from './pages/about/About'
import { Shows } from './pages/shows/Shows'
import { Login } from './pages/admin/login/Login'
import { AdminLayout } from './layouts/AdminLayout'
import { Portal } from './pages/admin/portal/Portal'
import { Inbox } from './pages/admin/inbox/Inbox'
import { MessageViewer } from './pages/admin/inbox/MessageViewer'
import { Bio } from './pages/admin/bio/Bio'
import { Changelog } from './pages/admin/changelog/Changelog'
import { Resources } from './pages/admin/resources/Resources'
import { AddressBook } from './pages/admin/address-book/AddressBook'
import { AddressContact } from './pages/admin/address-book/AddressContact'
import { AddressContactEditor } from './pages/admin/address-book/AddressContactEditor'
import { ShowViewer } from './pages/show-viewer/ShowViewer'
import { ShowsAdmin } from './pages/admin/shows/ShowsAdmin'
import { ShowEditor } from './pages/admin/shows/ShowEditor'
import { ShowViewerLayout } from './layouts/ShowViewerLayout'
import { ShowCredits } from './pages/show-credits/ShowCredits'

function App() {

  return (
    <Routes>

      {/* PUBLIC PAGES */}
      <Route element={<HeaderLayout />} >
        <Route index element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/shows' element={<Shows />} />
        <Route element={<ShowViewerLayout />}>
          <Route path='/shows/:showId/credits' element={<ShowCredits />} />
          <Route path='/shows/:showId' element={<ShowViewer />} />
        </Route>
        <Route path='/contact' element={<Contact />} />
      </Route>

      {/* BACK PAGES - SORT ALPHABETICALLY */}
      <Route path='/login' element={<Login />} />

      <Route path='/admin' element={<AdminLayout showNav={false} />} >
        <Route index element={<Portal />} />
        <Route path='/admin/address-book' element={<AddressBook />} />
        <Route path='/admin/address-book/new-contact' element={<AddressContactEditor />} />
        <Route path='/admin/address-book/*' element={<AddressContact />} />
        <Route path='/admin/changelog' element={<Changelog />} />
        <Route path='/admin/inbox' element={<Inbox />} />
        <Route path='/admin/inbox/*' element={<MessageViewer />} />
        <Route path='/admin/my-bio' element={<Bio />} />
        <Route path='/admin/resources' element={<Resources />} />
        <Route path='/admin/shows' element={<ShowsAdmin />} />
        <Route path='/admin/shows/*' element={<ShowEditor />} />
      </Route>

    </Routes>
  )
  
}

export default App

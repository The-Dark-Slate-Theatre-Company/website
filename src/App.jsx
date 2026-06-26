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

function App() {

  return (
    <Routes>

      {/* PUBLIC PAGES */}
      <Route element={<HeaderLayout />} >
        <Route index element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/shows' element={<Shows />} />
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
      </Route>

    </Routes>
  )
  
}

export default App

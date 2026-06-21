import { Outlet } from "react-router-dom";
import { Header } from "../components/header/Header";
import { Footer } from "../components/footer/Footer";

export function HeaderLayout() {

  return (
    <div className='w-full min-h-screen flex flex-col'>
      <Header />

      <main className='flex-1'>
        <Outlet />
      </main>
      
      <Footer />
    </div>
  )

}
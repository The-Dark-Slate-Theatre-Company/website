import { Page } from "../../components/page/Page";
import { ContactForm } from "./ContactForm";
import Instagram from '../../assets/social-logos/instagram.svg';
import Facebook from '../../assets/social-logos/facebook.svg';
import TikTok from '../../assets/social-logos/tiktok.svg';
import { useState } from "react";
import { ImageBanner } from "../../components/image-banner/ImageBanner";

import TopImage from '../../assets/images/contact.png';


export function Contact() {
  return (
    <>
      <ImageBanner src={TopImage} />
    
      <Page>
        <h1 className='text-4xl tracking-widest border-b border-[#555] pb-2 mb-8'>Get in Touch</h1>

        <p className='text-lg tracking-wide'>
          Interested in working with us? Whether you're looking to collaborate on a production, discuss an upcoming event, or 
          simply step out of the shadows and say hello, we'd love to hear from you!
          <br/><br/>
          <b className='text-(--accent)'>You can get in touch using the form below, or by reaching out via our socials.</b>
        </p>

        <div className='flex flex-wrap gap-2 sm:gap-4 md:gap-8 justify-center my-12'>
          <SocialIcon src={Instagram} label='darkslatetheatre' colour='#fe008e' to='https://instagram.com/darkslatetheatre' />
          <SocialIcon src={Facebook} label='darkslatetheatre' colour='#1877f2' to='https://www.facebook.com/darkslatetheatre' />
          <SocialIcon src={TikTok} label='@darkslatetheatre' colour='#fd2b55' to='https://www.tiktok.com/@darkslatetheatre' />
        </div>

        <p className='text-lg tracking-wide'>
          For more formal inquiries, we recommend emailing us directly at <a href='mailto:admin@darkslatetheatre.com' className='text-(--accent) underline hover:brightness-80 cursor-pointer transition-colors'>admin@darkslatetheatre.com</a>
        </p>

        <ContactForm />

      </Page>
    </>
  )
}


export function SocialIcon({src, label, colour, to}) {

  const [hovered, setHovered] = useState(false);

  return (
    <div 
      className='group lowercase flex items-center justify-center gap-4 border px-4 py-2 rounded-sm cursor-pointer transition-all duration-100' 
      style={{borderColor: hovered ? colour : '#555'}}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => window.open(to, '_blank')}
    >
      <img className='w-8' src={src} />
      <p className='text-[#eee]'>{label}</p>
    </div>
  )

}
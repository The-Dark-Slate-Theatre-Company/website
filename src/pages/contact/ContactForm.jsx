import { useEffect, useRef, useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { AnimatePresence, motion } from "motion/react";
import { httpsCallable, getFunctions } from "firebase/functions";

import categories from '../../data/contact-form-categories/ContactFormCategories.json';
import { db } from "../../firebase";
import { CircleCheck } from "lucide-react";


export function ContactForm() {

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [category, setCategory] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [categoryOpen, setCategoryOpen] = useState(false);
  const categoryRef = useRef(null);


  useEffect(() => {
    function handleClickOutside(event) {
      if(categoryRef.current && !categoryRef.current.contains(event.target)) setCategoryOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => { document.removeEventListener("mousedown", handleClickOutside); };
  }, []);


  const sendContactEmail = httpsCallable(
    getFunctions(),
    'sendContactEmail'
  );


  // Send message to server
  const handleSubmit = async(e) => {
    e.preventDefault();
    if(submitting) return;
    if(!category || !firstName.trim().length || !lastName.trim().length || !email.trim().length || !subject.trim().length || !message.trim().length) {
      alert('Please fill in all required fields');
      return;
    }
    setSubmitting(true);
    try {
      await sendContactEmail({
        category: categories[category].name,
        name: `${firstName.trim()} ${lastName.trim()}`,
        company: company ? company.trim() : null,
        email: email.trim(),
        phone: phone ? phone.trim() : null,
        subject: subject.trim(),
        message: message.trim()
      });
      setSubmitted(true);
    }
    catch(err) {
      console.error(err);
      alert('Your message could not be sent. Please try again.');
      setSubmitting(false);
    }
  }


  return (
    <div className='mt-20'>
      <div className='w-full flex justify-center'>
        <div style={{borderColor: (category && !submitted) ? categories[category].colour : 'transparent'}} className='w-full max-w-200 bg-[#101010] p-4 border'>

          <AnimatePresence>

            {
              submitted 

              ? <motion.div key='submitted' initial={{opacity: 0}} animate={{opacity: 1}} transition={{duration: 0.1}} className='w-full flex flex-col items-center'>
                  <h1 className='text-2xl tracking-wide mb-6'>Message Submitted</h1>
                  <CircleCheck size={50} color='#2ecc71' />
                  <p className='text-center mt-6 text-[#aaa] text-sm'>
                    Thank you for getting in touch! We'll get back to you via email shortly
                  </p>
                </motion.div>

              : <motion.div key='form' initial={{opacity: 1}} exit={{opacity: 0}} transition={{duration: 0.1}} className='w-full flex flex-col items-center text-lg tracking-wide rounded-sm transition-all'>
                  <h1 className='text-2xl tracking-wide mb-6'>Contact Form</h1>
                  <div className='flex not-md:w-full not-md:flex-col items-center gap-2 md:gap-8'>
                    <p>I'm reaching out with {category && startsWithVowel(categories[category].name) ? 'an' : 'a'}...</p>
                    <div onClick={() => setCategoryOpen(true)} style={{ backgroundColor: category ? categories[category].colour : '#202020'}} className='relative px-2 md:px-3 py-2 border border-black/60 rounded-sm min-w-50 not-md:w-full cursor-pointer'>
                      <p className='font-bold not-md:text-center' style={{color: category ? '#000000dd' : '#999'}}>{category ? categories[category].name : 'Click to select...'}</p>
                      <AnimatePresence>
                        { categoryOpen && 
                          <motion.div 
                            ref={categoryRef}
                            initial={{opacity: 0, scale: 0.9}}
                            animate={{opacity: 1, scale: 1}}
                            exit={{opacity: 0}}
                            transition={{duration: 0.2}}
                            className='absolute z-80 bg-[#222] border border-black/80 w-full -ml-2 md:-ml-3 top-[90%] origin-top'
                          >
                            { Object.keys(categories).map((k) => {
                              const c = categories[k];
                              return (<CategoryOption key={k} c={c} k={k} setCategory={setCategory} setCategoryOpen={setCategoryOpen} />)
                            })}
                          </motion.div>
                        }
                      </AnimatePresence>
                    </div>
                  </div>

                  <AnimatePresence>
                    {
                      category && 
                      <motion.form
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        className='w-full flex flex-col gap-5 items-center'
                        onSubmit={handleSubmit}
                      >
                        <hr className='w-full border-white/10 mt-10'/>
                        <p className='w-[90%] text-center text-[16px] leading-5.5' style={{color: categories[category].colour}}>{categories[category].info}</p>
                        <hr className='w-full border-white/10 mb-3'/>
                        <div className='w-full grid grid-cols-2 gap-2 md:gap-6 mt-5'>
                          <FormInput label='First Name' value={firstName} setValue={setFirstName} placeholder='William' />
                          <FormInput label='Last Name' value={lastName} setValue={setLastName} placeholder='Beneventi' />
                        </div>
                        <FormInput label='Company (optional)' value={company} setValue={setCompany} />
                        <FormInput label='Email' value={email} setValue={setEmail} placeholder='email@address.com' />
                        <FormInput label='Phone (optional)' value={phone} setValue={setPhone} placeholder='xxxxx xxxxxx' />
                        <hr className='w-full border-white/10 mt-6 mb-3'/>
                        <FormInput label='Subject' value={subject} setValue={setSubject} />
                        <div className='w-full'>
                          <p className='text-[#ccc] text-sm ml-1'>Your Message</p>
                          <textarea className='w-full min-h-40 bg-[#202020] rounded-xs border-white/20 border px-2 py-1 focus:border-white/60 focus:outline-none transition-colors' value={message} onChange={(e) => setMessage(e.target.value)} />
                        </div>

                        <p className='text-xs text-[#666] mb-2'>By submitting this form, you agree to us storing the information you provide for the sole purpose of responding to your enquiry. Your data is stored securely and will not be used for marketing or shared with third parties.</p>
                        {
                          submitting 
                          ? <div className="w-8 h-8 border-2 mt-2 mb-3.5 border-[#444] border-t-(--accent) rounded-full animate-spin" />
                          : <button type='submit' className='px-8 py-2 border-b-2 border-transparent hover:border-(--accent) mb-2 cursor-pointer transition-all' disabled={submitting}>Submit</button>
                        }
                      </motion.form>
                    }
                  </AnimatePresence>
                </motion.div>
            }
          </AnimatePresence>
          

        </div>
      </div>
    </div>
  )
}



function CategoryOption({c, k, setCategory, setCategoryOpen}) {

  const [hovered, setHovered] = useState(false);

  return (
    <div 
      onClick={(e) => { e.stopPropagation(); setCategory(k); setCategoryOpen(false); }}
      className='w-full px-2 hover:bg-[#333]' 
      style={{color: c.colour}}
    >
      {c.name}
    </div>
  )

}


function FormInput({value, setValue, label, placeholder=''}) {
  return (
    <div className='w-full'>
      <p className='text-[#ccc] text-sm ml-1'>{label}</p>
      <input className='w-full bg-[#202020] rounded-xs border-white/20 border px-2 py-1 focus:border-white/60 focus:outline-none transition-colors' value={value} onChange={(e) => setValue(e.target.value)} placeholder={placeholder} />
    </div>
  )
}


function getCurrentDatetime() {
  const now = new Date();

  const pad = (num) => String(num).padStart(2, "0");

  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}:${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
}


function startsWithVowel(str) {
  return /^[aeiou]/i.test(str);
}
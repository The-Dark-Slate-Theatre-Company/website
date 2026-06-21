import { useEffect, useState } from "react"
import { auth } from "../../../firebase";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";

export function Login() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/admin", { replace: true });
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleSubmit = async(e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      if(user) navigate('/admin');
      else {
        alert('Username or password is incorrect.');
        setSubmitting(false);
      }
    }
    catch(err) {
      console.error(err);
      alert('Username or password is incorrect.')
      setSubmitting(false);
    }
  }

  const inputClass = 'w-[90%] max-w-80 bg-[#101010] px-3 py-1 border border-white/20 rounded-sm focus:outline-none focus:border-(--accent) mb-4';

  return (
    <div className='fixed inset-0 flex flex-col justify-center items-center'>
      <h1 className='font-donau tracking-widest text-3xl'>The Dark Slate Theatre Co.</h1>
      <form onSubmit={handleSubmit} className='w-full flex flex-col items-center mt-8'>
        <p className='w-full max-w-80 text-sm text-[#aaa]'>Email</p>
        <input className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} />
        <p className='w-full max-w-80 text-sm text-[#aaa]'>Password</p>
        <input className={inputClass} type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
        {
          submitting 
          ? <div className="w-8 h-8 border-2 mt-4.5 border-[#444] border-t-(--accent) rounded-full animate-spin" />
          : <button type='submit' className='text-lg mt-4 border-b-2 border-transparent hover:border-(--accent) cursor-pointer transition-colors px-2 pb-1'>Log In</button>
        }
      </form>
    </div>
  )
}
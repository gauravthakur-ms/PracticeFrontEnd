import React from 'react'
import { useNavigate } from 'react-router-dom'

const FeatureCard = ({item}) => {
    const navigate = useNavigate();
    const navigateToLink = () => {
        navigate(`/${item.link}`); 
        window.scrollTo(0, 0);
    }
    
  return (
    <button onClick={navigateToLink} className='cursor-pointer text-left bg-[#FDFCF8] border border-slate-100 rounded-4xl p-6 hover:shadow-lg transition-all'>
        <p className='text-[10px] uppercase tracking-[0.4em] text-slate-400 font-black mb-3'>{item.title}</p>
        <h3 className='text-2xl font-black text-slate-900 mb-3 font-serif'>{item.title}</h3>
        <p className='text-sm text-slate-600'>{item.desc}</p>
        <span className="mt-4 inline-block text-[10px] font-black uppercase tracking-widest text-orange-500">Start →</span>
    </button>
  )
}

export default FeatureCard
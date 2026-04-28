import React from 'react'

const Card = ({label,description,sanskrit, cardClassName, contentClassName="flex-col"}) => {
  return (
    <div className={cardClassName}>
        <p className='text-[10px] uppercase tracking-[0.4em] text-orange-500 font-black mb-3'>{label}</p>
        <div className={`flex ${contentClassName} gap-4`}>
            <p className='text-slate-600 font-serif-elegant italic'>{description}</p>
            <p className='text-xs text-slate-400 uppercase tracking-widest'>{sanskrit}</p>
        </div>
    </div>
  )
}

export default Card
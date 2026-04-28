import React from 'react'

const SectionBanner = ({img,alt="Sanatan",label="",heading="",description=""}) => {
  return (
    <div className='min-h-50  relative rounded-[2.5rem] overflow-hidden border border-slate-100 reveal-item visible bg-cover bg-center bg-fixed '>
        <img src={img} alt={alt} loading='lazy' className='absolute inset-0 w-full h-full object-cover parallax-image opacity-80'/>
        <div className='absolute inset-0 bg-slate-950/70'></div>
        <div className='relative z-10 p-10 text-white'>
            <p className='text-[10px] uppercase tracking-[0.4em] text-orange-300 font-black mb-4'>{label}</p>
            <h3 className='text-3xl font-black font-serif mb-4'>{heading}</h3>
            <p className='text-white/80 max-w-2xl'>{description}</p>
        </div>
    </div>
  )
}

export default SectionBanner
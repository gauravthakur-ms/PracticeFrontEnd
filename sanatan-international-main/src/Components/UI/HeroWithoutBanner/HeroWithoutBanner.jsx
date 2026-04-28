import React from 'react'

const HeroWithoutBanner = ({label="",heading="",spanHeading="",description=""}) => {
  return (
    <section className='text-center reveal-item visible'>
        <span className='text-orange-600 font-black uppercase tracking-[0.4em] text-[10px] mb-6 block'>{label}</span>
        <h2 className='text-3xl sm:text-5xl font-black text-center text-slate-900 font-serif mb-6 tracking-tighter '>
            {heading}
            <br/>
            <span className='text-orange-600 italic italic-elegant'>{spanHeading}</span>
        </h2>
        <p className='text-lg md:text-xl text-slate-600 max-w-3xl mx-auto font-serif-elegant italic'>{description}</p>
    </section>
  )
}

export default HeroWithoutBanner
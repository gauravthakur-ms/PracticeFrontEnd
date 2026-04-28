import React from 'react'
import FeatureCard from './FeatureCard';

const Feature = () => {
    const featureCardData = [
        {
            title:"learn",
            desc:"Explore Gurukul programs, Ayurveda research, and ethical technology learning.",
            link:"courses"
        },
        {
            title:"give",
            desc:"Support the 33-acre campus fund and help secure a permanent home.",
            link:"donate"
        },
        {
            title:"join",
            desc:"Volunteer or advise—lend skills to protect and serve communities worldwide.",
            link:"volunteer"
        }
    ];
  return (
    <section className='py-20 px-6 bg-white'>
        <div className='max-w-6xl mx-auto'>
            <div className='text-center mb-12'>
                <p className='text-[10px] font-black uppercase tracking-[0.4em] text-orange-500 mb-3'>start here</p>
                <h2 className='text-3xl md:text-5xl font-black text-slate-900 font-serif'>Choose your path</h2>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                {
                    featureCardData.map((item,index)=>(
                        <FeatureCard key={index} item={item}/>
                    ))
                }
            </div>
        </div>
    </section>
  )
}

export default Feature
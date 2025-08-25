import React from 'react'

const Section = ({ children, titleSection }) => {
    if (!titleSection) {
        return (
            <div className='w-full max-w-[80%] mx-auto'>
                {children}
            </div>
        )
    } else {
        return (
            <div className='w-full max-w-[80%] mx-auto'>
                <h3 className='text-[#f99c00] text-2xl font-bold uppercase'>{titleSection}</h3>
                {children}
            </div>
        )
    }
}

export default Section;
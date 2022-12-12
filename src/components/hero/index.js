import _ from "lodash"
import Image from "../image"
const Hero = ({h1Content, text, button, isMain, brandData, image}) => {
    if (!h1Content) {
        return null
    }
    return (
        <div className={`flex items-center justify-content bg-cover ${!isMain && `hero-series`}`} style={isMain ? {backgroundImage: `url(${image})`}: null}>
            <div className={`${!isMain ? `text-brand-yellow mb-20 md:mt-56 xl:mt-72` : `mb-40 text-white md:my-60 xl:my-80`} mt-52 container mx-auto px-2 `}>
                {brandData &&
                <div className="mb-7 md:mb-12 lg:mb-24">
                    <Image 
                    sourceUrl={brandData.image?.src ?? ''}
                    altText={brandData.image?.alt || brandData.image?.name}
                    title={brandData.image?.name ?? ''}
                    width={'250px'}
                    height={'50px'}
                    className={'filter-white'}
                /> 
                </div>
                }
                
                {h1Content && 
                    <h1 className={`${!isMain ? `text-brand-yellow` : `text-white`} uppercase` }>
                        {h1Content}
                    </h1>}
                {text && 
                    <p className="mt-7 text-4xl md:text-5xl">
                        {text}
                    </p> }
                {button && 
                    <button className=" mt-14 text-xl button-form">
                        {button}
                    </button>
                }   
            </div>
        </div>
    )
}

export default Hero
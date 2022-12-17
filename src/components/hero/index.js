import _ from "lodash"
import Image from "../image"
const Hero = ({h1Content, text, button, isMain, brandData, image}) => {
    if (!h1Content) {
        return null
    }
    return (
        <div className={`${!isMain ? `` : ``}flex items-center justify-content bg-cover ${!image ? `hero-series` : ``} `} style={image ? {backgroundImage: `url(${image})`}: null}>
            <div className={`${!isMain ? `text-brand-yellow mb-10 md:mt-48` : `mb-40 text-white md:my-60 xl:my-80`} mt-52 container mx-auto px-2 `}>
                {h1Content && 
                    <h1 className={`${!isMain ? `text-brand-yellow` : `text-white`} uppercase text-48px` }>
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
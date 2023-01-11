import _ from "lodash"
import { useState } from "react"
import { capitalized } from "../../utils/miscellaneous";
import Popup from "../contact-form/pop-up"
import Image from "../image";


const Hero = ({h1Content, text, button, isMain, image, header}) => {
    const [showPopup, setShowPopup] = useState(false)
    const handleOnClick = () => {
        setShowPopup(prev => !prev)
    }
    if (!h1Content) {
        return null
    }
    const {siteTitle, siteLogoUrl} = header || {}
    return (
        <div className={`flex items-center justify-content bg-cover ${isMain ? 'h-screen lg:h-fit' : ``} ${!image ? `hero-series` : ``} `} style={image ? {backgroundImage: `url(${image})`, backgroundPosition: '70% 50%'}: null}>
            <div className={`${!isMain ? `text-brand-yellow md:mb-10 mb-5 md:mt-48 mt-36` : `mb-40 text-white md:my-48 xl:my-64 mt-60`}  container mx-auto px-2`}>
                {header && <div className="flex lg:hidden">
                    {
                        siteLogoUrl ? (
                            <Image 
                                sourceUrl={siteLogoUrl || ''}
                                altText={`${siteTitle} logo` || ''}
                                title={`${siteTitle} logo` || ''}
                                width={'328px'}
                                height={'50px'}
                            />
                        ) : (
                            <span className="font-medium text-xl tracking-tight flex w-full justify-center px-2">
                                <p className="logo-text text-4xl uppercase text-brand-yellow  font-sf-pro-display-bold text-center">Magnetic Light</p>
                            </span>
                        )
                    }
                </div>}
                {h1Content && 
                    <h1 className={`${!isMain ? `text-brand-yellow mb-0` : `text-white mt-14 mb-3 md:mb-5 text-center lg:text-left`} uppercase text-28px sm:text-36px lg:text-48px` }>
                        {capitalized(h1Content)}
                    </h1>}
                {text && 
                    <p className={`${isMain ? 'text-center lg:text-left font-sf-pro-display-light lg:font-sf-pro-display-medium' : ''} mt-2 lg:mt-7 text-20px lg:text-4xl sm:text-28px sm:mt-4`}>
                        {capitalized(text)}
                    </p> }
                {button && 
                    <div className="text-center lg:text-left">
                        <button className="mt-14 text-xl button-form text-center"
                            onClick={()=>handleOnClick()}>
                            {capitalized(button)}
                        </button>
                    </div>
                }   
                {button ? 
                    <div style={{
                        opacity: !showPopup ? "0" : "1",
                        transition: "all .1s",
                        visibility: !showPopup ? "hidden" : "visible",                        
                    }}>
                        <Popup handleOnClick={handleOnClick}/>
                    </div>
                    : null
                }
            </div>
        </div>
    )
}

export default Hero
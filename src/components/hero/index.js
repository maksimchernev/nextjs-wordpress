import _ from "lodash"
import { useState } from "react"
import Popup from "../contact-form/pop-up"


const Hero = ({h1Content, text, button, isMain, brandData, image}) => {
    const [showPopup, setShowPopup] = useState(false)
    const handleOnClick = () => {
        setShowPopup(prev => !prev)
    }
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
                    <button className=" mt-14 text-xl button-form"
                        onClick={()=>handleOnClick()}>
                        {button}
                    </button>
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
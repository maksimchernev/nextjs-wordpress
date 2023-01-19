import _ from "lodash"
import { useState } from "react"
import Popup from "../contact-form/pop-up"


const ContactUs = () => {
    const [showPopup, setShowPopup] = useState(false)
    const handleOnClick = () => {
        setShowPopup(prev => !prev)
    }
    return (
        <div id="contact-us" className='flex items-center justify-content bg-cover contact-us-container'>
            <div className='flex flex-col items-center my-32 sm:my-40 md:my-60 container mx-auto px-2 '>
                <h2 className="flex justify-center font-sf-pro-display-bold text-white text-center leading-10">Обратитесь к нам сегодня!</h2>
                <button className=" mt-14 text-xl button-form-yellow"
                    onClick={()=>handleOnClick()}>
                    Заказать расчет
                </button>
                <div style={{
                    opacity: !showPopup ? "0" : "1",
                    transition: "all .1s",
                    visibility: !showPopup ? "hidden" : "visible",                        
                }}>
                    <Popup handleOnClick={handleOnClick}/>
                </div>
            </div>
        </div>
    )
}

export default ContactUs
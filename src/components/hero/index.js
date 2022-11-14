const Hero = ({h1Content, text, button, h1Bottom}) => {
    let h1Style
    let contStyle
    if (h1Bottom) {
        h1Style = 'h1-color-yellow'
        contStyle = 'mt-80 container mx-auto h1-color-yellow mb-20'
    } else {
        contStyle = 'my-80 container mx-auto text-white'
        h1Style = 'h1-color-white'
    }
    return (
        <div className="flex items-center justify-content hero">
            <div className={contStyle}>
                {h1Content && 
                    <h1 className={h1Style}>
                        {h1Content}
                    </h1>}
                {text && 
                    <p className="mt-7">
                        {text}
                    </p> }
                {button && 
                    <button className="mt-14 rounded-none border">
                        {button}
                    </button>
                }   
            </div>
        </div>
    )
}

export default Hero
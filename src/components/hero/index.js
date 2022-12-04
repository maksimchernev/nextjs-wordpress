import Image from "../image"

const Hero = ({h1Content, text, button, isMain, brandData}) => {
    let h1Style
    let contStyle
    let blockStyle
    if (!isMain) {
        h1Style = 'h1-color-yellow text-4xl md:text-5xl lg:text-6xl'
        contStyle = 'mt-52 container mx-auto px-2 h1-color-yellow mb-20 md:mt-60 xl:mt-80'
        blockStyle = 'hero-series'
    } else {
        contStyle = 'mt-52 mb-40 container mx-auto px-2 text-white md:my-60 xl:my-80'
        h1Style = 'h1-color-white text-4xl md:text-5xl lg:text-6xl' 
        blockStyle = 'hero-main'
    }
    return (
        <div className={`flex items-center justify-content hero ${blockStyle}`}>
            <div className={contStyle}>
                {brandData &&
                <div className=" mb-7">
                    <Image 
                    sourceUrl={brandData.image?.src ?? ''}
                    altText={brandData.image?.alt ?? ''}
                    title={brandData.image?.name ?? ''}
                    width={'250px'}
                    height={'50px'}
                    className={'filter-white'}
                /> 
                </div>
                }
                
                {h1Content && 
                    <h1 className={`${h1Style}` }>
                        {h1Content}
                    </h1>}
                {text && 
                    <p className="mt-7 text-4xl md:text-5xl">
                        {text}
                    </p> }
                {button && 
                    <button className="mt-14 rounded-none border text-xl">
                        {button}
                    </button>
                }   
            </div>
        </div>
    )
}

export default Hero
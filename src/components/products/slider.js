import { isArray } from "lodash"
import { useState } from "react"
import { SliderLeft, SliderRight } from "../icons"
import Product from "./product"


const ProductSlider = ({products, show}) => {
   
    const [currentIndex, setCurrentIndex] = useState(0)
    const [length, setLength] = useState(products.length)
    const [touchPosition, setTouchPosition] = useState(null)
    if (!isArray(products)) {
        return null
    }
    const handleTouchStart = (e) => {
        const touchDown = e.touches[0].clientX
        setTouchPosition(touchDown)
    }
    const handleTouchMove = (e) => {
        const touchDown = touchPosition
    
        if(touchDown === null) {
            return
        }
    
        const currentTouch = e.touches[0].clientX
        const diff = touchDown - currentTouch
    
        if (diff > 5) {
            next()
        }
    
        if (diff < -5) {
            prev()
        }
    
        setTouchPosition(null)
    }
    const next = () => {
        if (currentIndex < (length - 1)) {
            setCurrentIndex(prevState => prevState + 1)
        }
    }
    
    const prev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prevState => prevState - 1)
        }
    }
    
    return (
        <div className="carousel-container w-full flex flex-col container mx-auto">
            <div className="carousel-wrapper  w-full flex relative">
                {
                    currentIndex > 0 &&
                    <button onClick={prev} className="left-arrow flex  items-center hover:bg-brand-grayCF left-0">
                        <SliderLeft className="ml-2.5"/>
                    </button>
                }       
                <div className="carousel-content-wrapper overflow-hidden w-full " 
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    >
                    <div className={`flex carousel-content my-3 show-${show}`} style={{ transform: `translateX(-${currentIndex * (100 / show)}%)` }}>

                        { products.length ? products.map(product => {
                            return (
                                <Product key={product.id} product={product} slider="true"></Product>
                            )
                        }):null}
                    </div>
                </div>
                {
                    currentIndex < (length - show) &&
                    <button onClick={next} className="right-arrow flex justify-end items-center hover:bg-brand-grayCF right-0">
                        <SliderRight className="mr-2.5"/>
                    </button>
                }
            </div>
        </div>
    )
}

export default ProductSlider
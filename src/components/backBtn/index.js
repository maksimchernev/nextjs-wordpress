import Router from 'next/router'
import { Back } from '../icons'

export default function BackButton({isHeaderVisible}) {
    let containerStyles
    let styles
    let marginVal
    if (isHeaderVisible) {
        marginVal = 'mt-28'
        styles = 'back-dark'
        
    } else {
        marginVal = 'mt-8'
        styles = 'back-white'
        containerStyles = 'back-cont-abs'
    }
    return (
        <div className={`w-full flex flex-col flex-wrap overflow-hidden container mx-auto pb-12  ${marginVal} ${containerStyles}`}>
            <button onClick={() => Router.back()} className='back-btn flex'><Back className={styles}/><span className={`back-text ${styles}`}>Назад</span></button>
        </div>
    )
}
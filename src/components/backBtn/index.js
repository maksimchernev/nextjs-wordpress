import Router from 'next/router'
import { Back } from '../icons'

export default function BackButton({isMain, bgProduct}) {
    let containerStyles
    let styles
    if (isMain) {
        containerStyles = 'back-cont-abs'
        styles = 'back-white'
    } else {
        styles = 'back-dark'
    }
        
    return (
        <div className={`${bgProduct? 'product-bg-gray pt-28': 'mt-28'} w-full flex flex-col flex-wrap overflow-hidden container mx-auto pb-12  ${containerStyles} ` }>
            <button onClick={() => Router.back()} className='back-btn flex'><Back className={styles}/><span className={`back-text ${styles}`}>Назад</span></button>
        </div>
    )
}
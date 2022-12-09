import Router from 'next/router'
import { Back } from '../icons'

export default function BackButton({isMain, bgProduct}) {
        
    return (
        <div className={`${bgProduct? 'product-bg-gray pt-28': 'mt-28'} w-full flex flex-col flex-wrap overflow-hidden container mx-auto pb-12  ${isMain && 'back-cont-abs'} ` }>
            <button onClick={() => Router.back()} className='back-btn flex'><Back className={`${isMain ? 'back-white': 'back-dark'}`}/><span className={`back-text ${isMain ? 'back-white': 'back-dark'}`}>Назад</span></button>
        </div>
    )
}
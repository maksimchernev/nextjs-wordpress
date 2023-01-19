import Link from 'next/link';
import Image from '../image';
import { roundToTwo, sanitizeTags } from '../../utils/miscellaneous'
import { isEmpty } from 'lodash';
import { useState ,useEffect } from 'react';
import AddToCart from '../cart/add-to-cart';

const Product = ( { product, slider} ) => {

	const [isMounted, setIsMounted] = useState(false)
    useEffect(()=> {
        setIsMounted(true)
    }, [])
    if ( isEmpty( product ) ) {
		return null;
	}
	const img = product?.images?.[0] ?? {};
	let permalink = product?.permalink || '/'
    if (permalink) {
        permalink = (permalink.slice(permalink.indexOf('product')-1))
    }
    
	return (
		<div className={`${slider ? 'product-card-slider': 'md:w-1/2 xl:w-1/3 2xl:w-1/4 product-card'} w-full   flex flex-grow justify-center px-4 py-2`}>
            <div className={`${!slider && 'border-b border-brand-grayCF sm:border-0'} product-card-shadow flex-col flex-grow  py-5 sm:p-5 `}>
                { isMounted ? 
                    <div className='flex flex-col justify-between h-full'>
                        <Link href={permalink ?? '/'}>
                            <a className={`flex ${!slider ? 'sm:flex-col' : 'flex-col'}`}>
                                <div className='flex justify-center'>
                                    <Image
                                        sourceUrl={ img?.src ?? '' }
                                        altText={ img?.alt || product?.name}
                                        title={ product?.name ?? '' }
                                        layout = 'fill'
                                        containerClassNames={`${slider ? 'product-image-card-slider' : "product-image-card"}`}
                                    />
                                </div>
                                <p className={`${slider ? 'max-h-24 text-14px sm:text-base' : 'max-h-12 sm:max-h-24 ml-5 sm:ml-0 sm:my-2 sm:mt-4 '}  text-base font-sf-pro-display text-justify sm:text-center truncate-p`}>{ sanitizeTags(product?.name) ?? '' }</p>
                            </a>
                        </Link>
                        
                        <div className={`${slider ? 'hidden sm:flex flex-col justify-between' : 'flex flex-col justify-between'}`}>
                            <div className={`${slider ? 'justify-between px-4 sm:px-0' : 'sm:justify-between justify-end'} flex  mt-auto sm:mx-3 `}>
                                <p className='uppercase font-sf-pro-display-medium align-middle mb-0 flex flex-col justify-center mr-8 sm:mr-0'>{roundToTwo(product?.price)+' ₽' ?? ''}</p>
                                <AddToCart product={product} isItemCard={true}></AddToCart>
                            </div>
                        </div>
                    </div>
                : null
                }
            </div>
		</div>
	)
}

export default Product;

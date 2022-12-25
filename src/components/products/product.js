import Link from 'next/link';
import Image from '../image';
import { roundToTwo, sanitize } from '../../utils/miscellaneous'
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
		<div className={`${slider ? 'w-full md:w-1/2 lg:w-1/3 xl:w-1/4 2xl:w-1/5': 'md:w-1/2 xl:w-1/3 2xl:w-1/4'}w-full product-card  flex flex-grow justify-center px-4 py-2`}>
            <div className='flex-col flex-grow card p-5'>
                { isMounted ? 
                    <div>
                        <Link href={permalink ?? '/'}>
                            <a>
                                <div className='flex justify-center'>
                                    <Image
                                        sourceUrl={ img?.src ?? '' }
                                        altText={ img?.alt || product?.name}
                                        title={ product?.name ?? '' }
                                        layout = 'fill'
                                        containerClassNames={'product-image-card'}
                                    />
                                </div>
                                <p className="my-2 mt-4 text-base font-sf-pro-display text-center h-24 truncate-p">{ product?.name ?? '' }</p>
                            </a>
                        </Link>
                        <div className='flex flex-col justify-between'>
                            <div className='flex justify-between mt-auto mx-3'>
                                <p className='uppercase font-sf-pro-display-medium align-middle mb-0 flex flex-col justify-center'>{roundToTwo(product?.price)+' ₽' ?? ''}</p>
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

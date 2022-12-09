import Link from 'next/link';
import Image from '../image';
import { sanitize } from '../../utils/miscellaneous'
import { isEmpty } from 'lodash';
import { useState ,useEffect } from 'react';
import AddToCart from '../cart/add-to-cart';

const Product = ( { product } ) => {

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
		<div className="w-full md:w-1/2 xl:w-1/3 2xl:w-1/4 flex flex-grow justify-center px-4 py-2 ml-5 md:ml-0">
            <div className='flex-col flex-grow card p-5'>
                { isMounted ? 
                    <Link href={permalink ?? '/'}>
                        <a>
                            <div className='flex justify-center'>
                                <Image
                                    sourceUrl={ img?.src ?? '' }
                                    altText={ img?.alt ?? ''}
                                    title={ product?.name ?? '' }
                                    layout = 'fill'
                                    containerClassNames={'product-image'}

                                />
                            </div>
                            <div className='flex flex-col justify-between'>
                                <p className="my-2 mt-4 text-base font-sf-pro-display text-center h-24 truncate-p">{ product?.name ?? '' }</p>
                                <div className='flex justify-between mt-auto'>
                                    <p className='uppercase font-sf-pro-display-medium align-middle mb-0 flex flex-col justify-center'>{product?.price+' РУБ.' ?? ''}</p>
                                    <AddToCart product={product} isItemCard={true}></AddToCart>
                                </div>
                            </div>
                            
                        </a>
                    </Link>
                    : null
                }
            </div>
		</div>
	)
}

export default Product;

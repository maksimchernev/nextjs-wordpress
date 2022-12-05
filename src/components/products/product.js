import Link from 'next/link';
import Image from '../image';
import { sanitize } from '../../utils/miscellaneous'
import { isEmpty } from 'lodash';
import { useState ,useEffect } from 'react';

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
        permalink = permalink.replace('https', 'http')
        permalink = (permalink.split(process.env.NEXT_PUBLIC_SITE_URL)[1])
    }
    
	return (
		<div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 flex justify-center mb-7">
            <div className='flex-col flex-grow product-card-container'>
                { isMounted ? 
                    <Link href={permalink ?? '/'}>
                        <a>
                            <div className='flex justify-center'>
                                <Image
                                    sourceUrl={ img?.src ?? '' }
                                    altText={ img?.alt ?? ''}
                                    title={ product?.name ?? '' }
                                    layout = 'fill'
                                    containerClassNames={'product-image-border'}

                                />
                            </div>
                            <h6 className="my-2 tracking-0.5px mt-4">{ product?.name ?? '' }</h6>
                        </a>
                    </Link>
                    : null
                }
            </div>
		</div>
	)
}

export default Product;

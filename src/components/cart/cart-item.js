import React, { useEffect, useState, useRef } from 'react';
import {isEmpty} from "lodash";
import Image from '../image';
import { deleteCartItem, updateCart } from '../../utils/cart';
import { Cross } from '../icons';
import { roundToTwo, sanitizeTags } from '../../utils/miscellaneous';
import Link from 'next/link';

const CartItem = ( {item,products,setCart} ) => {	
	const [productCount, setProductCount] = useState( item.quantity );
	const [updatingProduct, setUpdatingProduct] = useState( false );
	const [removingProduct, setRemovingProduct] = useState( false );
	const productImg = item?.data?.images?.[0] ?? '';
	
	const isMounted = useRef( false );
	
	useEffect( () => {
		isMounted.current = true
		
		// When component is unmounted, set isMounted.current to false.
		return () => {
			isMounted.current = false
		}
	}, [] )
	
	const handleRemoveProductClick = ( event, cartKey ) => {
		event.stopPropagation();
		
		// If the component is unmounted, or still previous item update request is in process, then return.
		if ( !isMounted || updatingProduct ) {
			return;
		}
		
		deleteCartItem( cartKey, setCart, setRemovingProduct );
	};

	const handleQtyChange = ( event, cartKey, type ) => {
		
		if ( typeof window !== 'undefined' ) {
			
			event.stopPropagation();
			let newQty;
			
			// If the previous cart request is still updatingProduct or removingProduct, then return.
			if ( updatingProduct || removingProduct || ( 'decrement' === type && (item.data?.purchase_note ? 2 : 1) === productCount ) ) {
				return;
			}
			
			if ( !isEmpty( type ) ) {
				newQty = 'increment' === type ? productCount + 1 : productCount - 1;
			} /* else {
				// If the user tries to delete the count of product, set that to 1 by default ( This will not allow him to reduce it less than zero )
				newQty = ( event.target.value ) ? parseInt( event.target.value ) : 1;
			} */
			
			// Set the new qty in state.
			setProductCount( newQty );
			
			if ( products.length ) {
				updateCart(item?.key, newQty, setCart, setUpdatingProduct);
			}
			
		}
	};
	
	return (
		<div className="flex mb-5 sm:mb-6 w-full">
			<Link href={`/product/${item.data?.slug || ''}`}>
				<a>
					<figure className='w-20 h-20 flex '>
						<Image
							layout='fill'
							altText={productImg?.alt || item?.data?.name}
							sourceUrl={! isEmpty( productImg?.src ) ? productImg?.src : ''} 
							containerClassNames='border border-brand-grayCF product-image-preview'
						/>
					</figure>
				</a>
			</Link>
			<div className="flex md:items-center ml-3 flex-col md:flex-row w-full relative">
				<div className='w-full'>
					<h3 className="mb-1 md:mb-0 cart-item-name text-16px leading-7 md:pr-2 w-full truncate-p ">{ sanitizeTags(item?.data?.name) }</h3>
					{item.data?.purchase_note && <p className='hidden md:block w-full text-14px my-1'>{item.data?.purchase_note}</p>}
					<div className='flex justify-between items-center my-0.5 sm:my-1'>
						{item.data?.regular_price && <span className='font-sf-pro-display-bold'>{roundToTwo(item.data?.regular_price)} ₽</span>}
						<button className="w-8 hover:bg-brand-yellow mx-2 aspect-square md:hidden flex items-center justify-center text-22px leading-22px bg-transparent" onClick={ ( event ) => handleRemoveProductClick( event, item?.key ) }><Cross/></button>
					</div>
				</div>
				<div className={`flex items-center justify-end flex-wrap flex-row-reverse md:flex-nowrap md:flex-row`}>
					{item.data?.purchase_note && <p className='block md:hidden mr-4 w-full text-14px my-1 '>{item.data?.purchase_note}</p>}
					<div className="quantity-counter-cart mr-2 text-brand-gray88 border-brand-grayCF border">
						<span className={`${ updatingProduct ? 'cursor-not-allowed' : 'cursor-pointer' }  minus `} onClick={( event ) => handleQtyChange( event, item?.cartKey, 'decrement' )}>-</span>
						<input type="text" 
							/* type="number" */
							/* onChange={ ( event ) => handleQtyChange( event, item?.cartKey, '' ) } */
							min={item.data?.purchase_note ? 2 : 1}
							value={ productCount } 
							readOnly={true} 
							data-cart-key={ item?.data?.cartKey } 
							className={ `${ updatingProduct ? 'cursor-not-allowed' : '' } ` }
							disabled={updatingProduct}
						/>
						<span className={`${ updatingProduct ? 'cursor-not-allowed' : 'cursor-pointer' }  plus `} onClick={( event ) => handleQtyChange( event, item?.cartKey, 'increment' )}>+</span>
					</div>
					<button className="w-14 mx-2 aspect-square hidden md:flex items-center justify-center text-22px leading-22px bg-transparent  " onClick={ ( event ) => handleRemoveProductClick( event, item?.key ) }><Cross/></button>
				</div>
			</div>
		</div>
	)
};

export default CartItem;

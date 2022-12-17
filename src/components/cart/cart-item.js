import React, { useEffect, useState, useRef } from 'react';
import {isEmpty} from "lodash";
import Image from '../image';
import { deleteCartItem, updateCart } from '../../utils/cart';
import { roundToTwo } from '../../utils/miscellaneous';
import { Cross } from '../icons';

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
			if ( updatingProduct || removingProduct || ( 'decrement' === type && 1 === productCount ) ) {
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
		<div className="flex items-center mb-6">
			<div >
				<figure className='w-20 h-20 flex justify-center items-center'>
					<Image
						layout='fill'
						altText={productImg?.alt || item?.data?.name}
						sourceUrl={! isEmpty( productImg?.src ) ? productImg?.src : ''} // use normal <img> attributes as props
						containerClassNames='border border-brand-grayCF product-image-preview'
					/>
				</figure>
			</div>
			<div className="relative flex items-end md:items-center ml-3 flex-col md:flex-row">
				<h3 className="mb-2 md:mb-0 text-20px leading-7 mr-12 md:mr-2">{ item?.data?.name }</h3>
				<div className='flex items-center'>
					<div className="quantity-counter mr-2 text-brand-gray88 border-brand-grayCF border">
						<span className={`${ updatingProduct ? 'cursor-not-allowed' : 'cursor-pointer' }  minus `} onClick={( event ) => handleQtyChange( event, item?.cartKey, 'decrement' )}>-</span>
						<input type="text" 
							/* type="number" */
							/* onChange={ ( event ) => handleQtyChange( event, item?.cartKey, '' ) } */
							min="1" 
							value={ productCount } 
							readOnly={true} 
							data-cart-key={ item?.data?.cartKey } 
							className={ `${ updatingProduct ? 'cursor-not-allowed' : '' } ` }
							disabled={updatingProduct}
						/>
						<span  className={`${ updatingProduct ? 'cursor-not-allowed' : 'cursor-pointer' }  plus `} onClick={( event ) => handleQtyChange( event, item?.cartKey, 'increment' )}>+</span>
					</div>
					<button className="w-14 mx-2 aspect-square hidden md:flex items-center justify-center text-22px leading-22px bg-transparent  " onClick={ ( event ) => handleRemoveProductClick( event, item?.key ) }><Cross/></button>
				</div>
				<button className="absolute top-0 right-0 w-8 hover:bg-brand-yellow mx-2 aspect-square md:hidden flex items-center justify-center text-22px leading-22px bg-transparent  " onClick={ ( event ) => handleRemoveProductClick( event, item?.key ) }><Cross/></button>

			</div>

		</div>
	)
};

export default CartItem;

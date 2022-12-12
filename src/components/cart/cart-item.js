import React, { useEffect, useState, useRef } from 'react';
import {isEmpty} from "lodash";
import Image from '../image';
import { deleteCartItem, updateCart } from '../../utils/cart';
import { roundToTwo } from '../../utils/miscellaneous';

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
		<div className="grid grid-cols-3 gap-6  border-y pt-5 px-5 mx-2">
			<div className="col-span-1">
				<figure >
					<Image
						width="300"
						height="300"
						altText={productImg?.alt || item?.data?.name}
						sourceUrl={! isEmpty( productImg?.src ) ? productImg?.src : ''} // use normal <img> attributes as props
					/>
				</figure>
			</div>
			
			<div className="col-span-2 cart-right-col">
				<div className="flex justify-between flex-col h-full">
					<div className="relative">
						<h3 className="mr-14 mb-5 text-26px">{ item?.data?.name }</h3>
						{item?.data?.description ? <p className='mb-5'>{item?.data?.description}</p> : ''}
						<button className="absolute right-0 top-0 px-4 py-2 flex items-center text-22px leading-22px bg-transparent border " onClick={ ( event ) => handleRemoveProductClick( event, item?.key ) }>&times;</button>
					</div>
					
					<div className=" flex justify-between p-2 border-t">
						<div className="flex flex-col justify-center">
							<span className="text-18px">{roundToTwo(item?.line_subtotal)} {item?.currency}</span>
						</div>
						
						<div className='flex items-center'>
							<div className="quantity-counter">
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

							{/* <button className="text-24px" onClick={( event ) => handleQtyChange( event, item?.cartKey, 'decrement' )} >-</button>
							<input
								
								min="1"
								style={{ textAlign: 'center', width: '50px', paddingRight: '0' }}
								data-cart-key={ item?.data?.cartKey }
								className={ ` ml-3 ${ updatingProduct ? 'disabled bg-brand-grayCF' : '' } ` }
								value={ productCount }
								
							/>
							<button className=" text-20px" onClick={( event ) => handleQtyChange( event, item?.cartKey, 'increment' )}>+</button> */}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
};

export default CartItem;

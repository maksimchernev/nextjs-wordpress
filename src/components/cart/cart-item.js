import React, { useEffect, useState, useRef } from 'react';
import {isEmpty} from "lodash";
import Image from '../image';
import { deleteCartItem, updateCart } from '../../utils/cart';

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
			} else {
				// If the user tries to delete the count of product, set that to 1 by default ( This will not allow him to reduce it less than zero )
				newQty = ( event.target.value ) ? parseInt( event.target.value ) : 1;
			}
			
			// Set the new qty in state.
			setProductCount( newQty );
			
			if ( products.length ) {
				updateCart(item?.key, newQty, setCart, setUpdatingProduct);
			}
			
		}
	};
	
	return (
		<div className="cart-item-wrap grid grid-cols-3 gap-6 mb-5 border border-brand-bright-grey p-5">
			<div className="col-span-1 cart-left-col">
				<figure >
					<Image
						width="300"
						height="300"
						altText={productImg?.alt ?? ''}
						sourceUrl={! isEmpty( productImg?.src ) ? productImg?.src : ''} // use normal <img> attributes as props
					/>
				</figure>
			</div>
			
			<div className="col-span-2 cart-right-col">
				<div className="flex justify-between flex-col h-full">
					<div className="cart-product-title-wrap relative">
						<h3 className="cart-product-title text-brand-orange font-bold mr-14 mb-5">{ item?.data?.name }</h3>
						{item?.data?.description ? <p>{item?.data?.description}</p> : ''}
						<button className="cart-remove-item absolute right-0 top-0 px-4 py-2 flex items-center text-22px leading-22px bg-transparent border border-brand-bright-grey" onClick={ ( event ) => handleRemoveProductClick( event, item?.key ) }>&times;</button>
					</div>
					
					<div className="cart-product-footer flex justify-between p-4 border-t">
						<div className="">
							<span className="cart-total-price">{item?.currency}{item?.line_subtotal}</span>
						</div>
						{/* { updatingProduct ? <img className="woo-next-cart-item-spinner" width="24" src="/cart-spinner.gif"  alt="spinner"/> : null } */}
						{/*Qty*/}
						<div style={{ display: 'flex', alignItems: 'center' }}>
							<button className="decrement-btn text-24px" onClick={( event ) => handleQtyChange( event, item?.cartKey, 'decrement' )} >-</button>
							<input
								type="number"
								min="1"
								style={{ textAlign: 'center', width: '50px', paddingRight: '0' }}
								data-cart-key={ item?.data?.cartKey }
								className={ `woo-next-cart-qty-input ml-3 ${ updatingProduct ? 'disabled' : '' } ` }
								value={ productCount }
								onChange={ ( event ) => handleQtyChange( event, item?.cartKey, '' ) }
							/>
							<button className="increment-btn text-20px" onClick={( event ) => handleQtyChange( event, item?.cartKey, 'increment' )}>+</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
};

export default CartItem;

import React, { useContext, useState } from 'react';
import { AppContext } from '../context';
import CartItem from './cart-item';
import { roundToTwo } from '../../utils/miscellaneous';
import Link from 'next/link';
import { clearCart } from '../../utils/cart';
import { Bin } from '../icons';

const CartItemsContainer = () => {
	const [ cart, setCart ] = useContext( AppContext );
	const { cartItems, totalPrice, totalQty } = cart || {};
	const [ isClearCartProcessing, setClearCartProcessing ] = useState( false );
	let totalQtyText
	if(totalQty >4) {
		totalQtyText = 'товаров на сумму'
	} else if (totalQty >1) {
		totalQtyText = 'товара на сумму'
	} else {
		totalQtyText = 'товар на сумму'
	}
	// Clear the entire cart.
	const handleClearCart = async ( event ) => {
		event.stopPropagation();
		
		if (isClearCartProcessing) {
			return;
		}
		
		await clearCart( setCart, setClearCartProcessing );

	};
	
	return (
		<div className="container mx-auto  mb-7">
			<div >
				
				{ cart ? (
					<div className="grid lg:grid-cols-3 gap-4 border-t border-brand-grayCF">
						{/*Cart Items*/ }
						<div className="lg:col-span-2 pb-5 border-r-0 lg:border-r border-b border-brand-grayCF">
							<div className='flex justify-between items-center'>
								<h1 className="uppercase tracking-0.5px text-4xl my-10">Корзина</h1>
								{/*Clear entire cart*/}
								<div className="">
									<button
										className={`flex items-center ${ isClearCartProcessing ? 'cursor-not-allowed' : 'cursor-pointer' }`}
										onClick={(event) => handleClearCart(event)}
										disabled={isClearCartProcessing}
									>	{ !isClearCartProcessing ? <Bin/> : null

										}
										
										<span className="ml-1 mr-4">{!isClearCartProcessing ? " Очистить корзину" : "Очистка..."}</span>
									</button>
								</div>
							</div>
						
							{ cartItems.length &&
							cartItems.map( ( item ) => (
								<CartItem
									key={ item.product_id }
									item={ item }
									products={ cartItems }
									setCart={setCart}
								/>
							) ) }
						</div>
						
						{/*Cart Total*/ }
						<div className="lg:col-span-1 p-5 pt-0">
							<h2 className='my-10'>Итого</h2>
							<div className="grid grid-cols-3  mb-4">
								<p className="col-span-2 p-2 mb-0">{totalQty} {totalQtyText}</p>
								<p className="col-span-1 p-2 mb-0 flex justify-end ">{roundToTwo(totalPrice)  } {cartItems?.[0]?.currency ?? ''}</p>
							</div>
							
							<div className="flex justify-between">
								
								{/*Checkout*/}
								<Link href="/checkout">
									<button className="button-form-black">
											Оформить заказ
									</button>
								</Link>
							</div>
						</div>
					</div>
					
				) : (
					<div className="mt-14">
						<h1 className="uppercase tracking-0.5px text-4xl my-10">Корзина</h1>
						<h2>В корзине пусто</h2>
						<Link href="/#brands">
							<button className="button-form-black my-5">
								Перейти в каталог
							</button>
						</Link>
					</div>
				) }
			</div>
		</div>
	);
};

export default CartItemsContainer;

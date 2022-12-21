import React, { useContext, useState } from 'react';
import { AppContext } from '../context';
import CartItem from './cart-item';
import { roundToTwo } from '../../utils/miscellaneous';
import Link from 'next/link';
import { clearCart } from '../../utils/cart';
import { Bin } from '../icons';
import CheckoutForm from '../checkout/checkout-form';
import cx from 'classnames';


const CartItemsContainer = () => {
	const [ cart, setCart ] = useContext( AppContext );
	const { cartItems, totalPrice, totalQty } = cart || {};
	const [ isClearCartProcessing, setClearCartProcessing ] = useState( false );
	const [ isOrderProcessing, setIsOrderProcessing ] = useState( false );
	const [ requestError, setRequestError ] = useState( null );
	const [ orderSuccessful, setOrderSuccessful] = useState (null)
	const [shippingType, setShippingType] = useState('Самовывоз')
	const [paymentType, setPaymentType] = useState('Наличными')
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
		<div className="container mx-auto">
			<div >
				
				{ cart ? (
					<div className="grid lg:grid-cols-3 gap-4 border-t border-brand-grayCF relative px-2">
						{/*Cart Items*/ }
						<div className="lg:col-span-2 pb-5 border-r-0 lg:border-r  border-brand-grayCF">
							<div className='flex justify-between items-center flex-wrap'>
								<h1 className="uppercase tracking-0.5px sm:text-4xl my-10 text-3xl">Корзина</h1>
								{/*Clear entire cart*/}
								<div className='mr-1'>
									<button
										className={`flex items-center w-full justify-end ${ isClearCartProcessing ? 'cursor-not-allowed' : 'cursor-pointer' }`}
										onClick={(event) => handleClearCart(event)}
										disabled={isClearCartProcessing}
									>	{ !isClearCartProcessing ? <Bin/> : null

										}
										
										<span className='ml-1 mr-4 hidden sm:block'>{!isClearCartProcessing ? " Очистить корзину" : "Очистка..."}</span>
									</button>
								</div>
							</div>
							<div className='mb-14 border-b border-brand-grayCF'>
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
							<CheckoutForm 
								cart={cart} setCart={setCart} 
								isOrderProcessing={isOrderProcessing} setIsOrderProcessing={setIsOrderProcessing}
								requestError={requestError} setRequestError={setRequestError}
								orderSuccessful={orderSuccessful} setOrderSuccessful={setOrderSuccessful}
								shippingType={shippingType} setShippingType={setShippingType}
								paymentType={paymentType} setPaymentType={setPaymentType}
							/>
						</div>
						
						
						{/*Cart Total*/ }
						<div className="lg:col-span-1 p-5 pt-0 totals-container top-20 overflow-auto self-start ">
							<h2 className='my-10'>Итого</h2>
							<div className="grid grid-cols-2  mb-4">
								<p className="col-span-1 p-1 mb-0">{totalQty} {totalQtyText}</p>
								<p className="col-span-1 p-1 mb-0 flex justify-end text-end">{roundToTwo(totalPrice)  } {cartItems?.[0]?.currency ?? ''}</p>
								<p className="col-span-1 p-1 mb-0">Способ доставки</p>
								<p className="col-span-1 p-1 mb-0 flex justify-end text-end">{shippingType}</p>
								<p className="col-span-1 p-1 mb-0">Способ оплаты</p>
								<p className="col-span-1 p-1 mb-0 flex justify-end text-end">{paymentType}</p>

							</div>
							
							<div className="flex justify-between">
								
								{/*Checkout*/}
								<div>
									{/* Order */ }
									<button
										disabled={ isOrderProcessing }
										className={ cx(
											'button-form-black',
											{ 'opacity-50 cursor-not-allowed ': isOrderProcessing },
											{ ' cursor-pointer': !isOrderProcessing },
										) }
										form='my-form'
										type="submit"
									>
										{ isOrderProcessing ? 'Обработка...' : 'Оформить заказ' }
									</button>
									{/* Checkout Loading*/ }
									{ requestError && <p>Error : { requestError } :( Please try again</p> }
								</div>
							</div>
						</div>
					</div>
					
				) : ( 
					<div className="mt-14 px-2">
						<h1 className="uppercase tracking-0.5px text-4xl my-10">Корзина</h1>
						<h2>В корзине пусто</h2>
						{orderSuccessful && <p>Ваш заказ оформлен! В ближайшее время с вами свяжется оператор!</p>}
						<Link href="/shop">
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

import { useState} from 'react';
import validateAndSanitizeCheckoutForm from '../../validator/checkout';
import { handleCheckout } from '../../utils/checkout';
import UserForm from './user-form';


// Use this for testing purposes, so you dont have to fill the checkout form over an over again.
/* const defaultCustomerInfo = {
	city: 'Mumbai',
	address: '123 Abc farm',
	firstName: 'Imran',
	lastName: 'Sayed',
	phone: '9883778278',
	email: 'codeytek.academy@gmail.com',
	errors: null,
}; */

const defaultCustomerInfo = {
	city: '',
	address: '',
	firstName: '',
	lastName: '',
	phone: '',
	email: '',
	errors: null
}

const CheckoutForm = ({cart, setCart, isOrderProcessing, setIsOrderProcessing, requestError, setRequestError, orderSuccessful, setOrderSuccessful, shippingType, setShippingType, paymentType, setPaymentType}) => {
	const initialState = {
		shipping: {
			...defaultCustomerInfo,
		},
		orderNotes: '',
		isShipping: false,
		isBankPayment: false,
		paymentMethod: 'Наличными'
	};

	const [ input, setInput ] = useState( initialState );
	const [ createdOrderData, setCreatedOrderData ] = useState( {} );

	const handleFormSubmit = async ( event ) => {
		event.preventDefault();
		const shippingValidationResult = validateAndSanitizeCheckoutForm( input?.shipping, false, input?.isShipping );
		setInput( {
			...input,
			shipping: { ...input.shipping, errors: shippingValidationResult.errors },
		} );
		//console.log('shippingValidationResult.isValid', shippingValidationResult)
		// If there are any errors, return.
		if ( ! shippingValidationResult.isValid) {
			return null;
		}
		/* const customerOrderData = */ await handleCheckout( input, cart?.cartItems, setRequestError, setCart, setIsOrderProcessing, setCreatedOrderData );
		//console.log( 'hey', customerOrderData );
		setRequestError( null );
		setOrderSuccessful(true)
	};
	const handleOnChange = async ( event ) => {
		const { target } = event || {};		
		const newState = { ...input, [ target.name ]: target.value, shipping: { ...input?.shipping, [ target.name ]: target.value } };
		setInput( newState );
	};
	
	const handleShippingChange = ( event ) => {
		const { target } = event || {};		
		let newShippingType = input.isShipping ? 'Самовывоз' : 'Доставка'
		const newState = { ...input, [ target.name ]: ! input.isShipping };
		setShippingType(newShippingType)
		setInput( newState );
	};
	const handlePaymentChange = ( event ) => {
		const { target } = event || {};	
		let payment 	
		if (input.isBankPayment) {
			payment = 'Наличными'
		} else {
			payment = 'Банковской картой'
		}
		setPaymentType(payment)
		const newState = { ...input, [ target.name ]: ! input.isBankPayment, paymentMethod: payment };
		
		setInput( newState ); 
	};

	return (
		<>
			{ cart ? (
				<form onSubmit={ handleFormSubmit } className="woo-next-checkout-form" id='my-form' >
					<div className="">
						<div>
							<div className="billing-details">
								<h2 className="font-sf-pro-display-medium text-40px my-8">Оформление заказа</h2>
								<UserForm input={ input } 
									handleOnChange={( event ) => handleOnChange( event )} 
									handleShippingChange={(event) => handleShippingChange(event)}
									handlePaymentChange={(event) => handlePaymentChange(event)}>
								</UserForm>
							</div>

						</div>
						
					</div>
				</form>
			) : null }
		</>
	);
};

export default CheckoutForm;

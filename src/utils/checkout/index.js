import { isEmpty } from 'lodash';
import { createTheOrder, createTheOrderNote, getCreateOrderData, getCreateNotesData } from './order';
import { clearCart } from '../cart';
/**
 * Handle Other Payment Method checkout.
 *
 * @param input
 * @param products
 * @param setRequestError
 * @param setCart
 * @param setIsOrderProcessing
 * @param setCreatedOrderData
 * @return {Promise<{orderId: null, error: string}|null>}
 */
export const handleCheckout = async ( input, products, setRequestError, setCart, setIsOrderProcessing, setCreatedOrderData ) => {
	setIsOrderProcessing( true );
	const orderData = getCreateOrderData( input, products);
	
	const customerOrderData = await createTheOrder( orderData, setRequestError, '');
	let customerOrderNoteData
	if (!isEmpty(input.orderNotes) && customerOrderData.orderId) {
		const noteData = getCreateNotesData(input.orderNotes, customerOrderData.orderId)
		customerOrderNoteData = await createTheOrderNote( noteData, setRequestError);
	}
	
	const cartCleared = await clearCart( setCart, () => {
	} );

	setIsOrderProcessing( false );
	if ( cartCleared?.error ) {
		setRequestError( 'Clear cart failed' );
		return null;
	}
	
	setCreatedOrderData( customerOrderData );
	
	return customerOrderData;
};

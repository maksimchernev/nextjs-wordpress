/**
 * Get line items for create order
 *
 * @param {array} products Products.
 *
 * @returns {*[]|*} Line items, Array of objects.
 */
import { isArray, isEmpty } from 'lodash';

export const getCreateOrderLineItems = ( products ) => {
	
	if ( isEmpty( products ) || ! isArray( products ) ) {
		return [];
	}
	
	return products?.map(
		( { product_id, quantity } ) => {
			return {
				quantity,
				product_id,
				// variation_id: '', // @TODO to be added.
			};
		},
	);
};

/**
 * Get Formatted create order data.
 *
 * @param order
 * @param products
 * @return {{shipping: {country: *, city: *, phone: *, address_1: (string|*), address_2: (string|*), postcode: (string|*), last_name: (string|*), company: *, state: *, first_name: (string|*), email: *}, payment_method_title: string, line_items: (*[]|*), payment_method: string, billing: {country: *, city: *, phone: *, address_1: (string|*), address_2: (string|*), postcode: (string|*), last_name: (string|*), company: *, state: *, first_name: (string|*), email: *}}}
 */
export const getCreateOrderData = ( order, products ) => {
	return {
		shipping: {
			first_name: order?.shipping?.firstName,
			last_name: order?.shipping?.lastName,
			address_1: order?.shipping?.address,
			city: order?.shipping?.city,
			email: order?.shipping?.email,
			phone: order?.shipping?.phone,
		},
		payment_method: order?.paymentMethod,
		payment_method_title: order?.paymentMethod,
		line_items: getCreateOrderLineItems( products ),
	};
};
export const getCreateNotesData = ( notes, orderId ) => {
	return {
		orderId: orderId,
		note: notes,
	};
};

/**
 * Create order.
 *
 * @param {Object} orderData Order data.
 * @param {function} setOrderFailedError sets the react state to true if the order creation fails.
 * @param {string} previousRequestError Previous request error.
 *
 * @returns {Promise<{orderId: null, error: string}>}
 */
export const createTheOrder = async ( orderData, setOrderFailedError, previousRequestError, notes ) => {
	let response = {
		orderId: null,
		total: '',
		currency: '',
		error: '',
	};

	// Don't proceed if previous request has error.
	if ( previousRequestError ) {
		response.error = previousRequestError;
		return response;
	}
	
	setOrderFailedError( '' );
	
	try {
		const request = await fetch( '/api/create-order', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify( orderData ),
		} );
		
		const result = await request.json();
		if ( result.error ) {
			response.error = result.error;
			setOrderFailedError( 'Something went wrong. Order creation failed. Please try again' );
		}
		response.orderId = result?.orderId ?? '';
		response.total = result.total ?? '';
		response.currency = result.currency ?? '';
		response.paymentUrl = result.paymentUrl ?? '';
		
		
	} catch ( error ) {
		// @TODO to be handled later.
		console.warn( 'Handle create order error', error?.message );
	}

	
	return response;
};

export const createTheOrderNote = async (note, setOrderFailedError) => {
	let noteResponse = {
		noteId: null,
		note: '',
		error: '',
	}
	if (note) {
		try {
			const request = await fetch( '/api/create-order-notes', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify( note ),
			} );

			const result = await request.json();
			if ( result.error ) {
				noteResponse.error = result.error;
				setOrderFailedError( 'Something went wrong setting order notes. Note creation failed. Please try again' );
			}
			noteResponse.noteId = result?.noteId ?? '';
			noteResponse.note = result.note ?? '';
			
			
		} catch ( error ) {
			// @TODO to be handled later.
			console.warn( 'Handle Note creation failed', error?.message );
		}
	}
	return noteResponse
}
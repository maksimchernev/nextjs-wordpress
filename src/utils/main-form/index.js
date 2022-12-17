async function sentEmail (formData, setRequestError){
    let response = {
		status: '',
		message: '',
		error: '',
	};
	setRequestError( '' );
	try {
		const request = await fetch( '/api/sent-email', {
			method: 'POST',
            headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(formData),
		} );
		
		const result = await request.json();
		if ( result.error ) {
			response.error = result.error;
			setRequestError( 'Something went wrong. Order creation failed. Please try again' );
		}
		response.status = result?.status ?? '';
		response.message = result.mesage ?? '';		
		
	} catch ( error ) {
		console.warn( 'Handle create order error', error?.message );
	}
	return response;
}

function getCreateEmailData (data){
    let formData = {
        name: data.name,
        phone: data.phone
    }
    return formData
}

export const handleSentForm = async ( input, setRequestError, setIsFormSumbitProcessing, setCreatedFormSubmitData ) => {
	setIsFormSumbitProcessing( true );

    const dataToBeSent = getCreateEmailData(input)
	const sentFormResponse = await sentEmail( dataToBeSent, setRequestError);
	setIsFormSumbitProcessing( false );	
	setCreatedFormSubmitData( sentFormResponse );
	return sentFormResponse;
};

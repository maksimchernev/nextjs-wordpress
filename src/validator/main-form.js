import validator from 'validator';
import isEmpty from './is-empty';


const validateAndSanitizeMainForm = ( data ) => {
	
	let errors = {};
	let sanitizedData = {};
	
	/**
	 * Set the firstName value equal to an empty string if user has not entered the firstName, otherwise the Validator.isEmpty() wont work down below.
	 * Note that the isEmpty() here is our custom function defined in is-empty.js and
	 * Validator.isEmpty() down below comes from validator library.
	 * Similarly we do it for for the rest of the fields
	 */
	data.name = ( ! isEmpty( data.name ) ) ? data.name : '';
	data.phone = ( ! isEmpty( data.phone ) ) ? data.phone : '';
	// data.paymentMethod = ( ! isEmpty( data.paymentMethod ) ) ? data.paymentMethod : '';
	
	/**
	 * Checks for error if required is true
	 * and adds Error and Sanitized data to the errors and sanitizedData object
	 *
	 * @param {String} fieldName Field name e.g. First name, last name
	 * @param {String} errorContent Error Content to be used in showing error e.g. First Name, Last Name
	 * @param {Integer} min Minimum characters required
	 * @param {Integer} max Maximum characters required
	 * @param {String} type Type e.g. email, phone etc.
	 * @param {boolean} required Required if required is passed as false, it will not validate error and just do sanitization.
	 */
	const addErrorAndSanitizedData = ( fieldName, errorContent, min, max, type = '', required ) => {
		
		/**
		 * Please note that this isEmpty() belongs to validator and not our custom function defined above.
		 *
		 * Check for error and if there is no error then sanitize data.
		 */
		if ( !validator.isLength( data[ fieldName ], { min, max } ) && required ){
			errors[ fieldName ] = `Значение "${errorContent}" должно быть от ${min} до ${max} символов`;
		}
		
		if ( 'phone' === type && ! validator.isMobilePhone( data[ fieldName ] ) ) {
			errors[ fieldName ] = `Значение недействительно`;
		}
		
		if ( required && validator.isEmpty( data[ fieldName ] ) ) {
			errors[ fieldName ] = `Поле "${errorContent}" не может быть пустым`;
		}
		
		// If no errors
		if ( ! errors[ fieldName ] ) {
			sanitizedData[ fieldName ] = validator.trim( data[ fieldName ] );
			sanitizedData[ fieldName ] = validator.escape( sanitizedData[ fieldName ] );
		}
		
	};
	
	addErrorAndSanitizedData( 'name', 'Имя', 2, 35, 'string', true );
	addErrorAndSanitizedData( 'phone', 'Телефон', 10, 15, 'phone', true );

	return {
		sanitizedData,
		errors,
		isValid: isEmpty( errors )
	}
};

export default validateAndSanitizeMainForm;

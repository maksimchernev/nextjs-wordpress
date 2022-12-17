import Error from "../error";
import PropTypes from 'prop-types';

const InputField = ({ handleOnChange, inputValue, name, type, errors, placeholder, required, containerClassNames, multiline}) => {
	if (!multiline) {
		return (
		   <div className={containerClassNames}>
			   <input
				   onChange={ handleOnChange }
				   defaultValue={ inputValue }
				   placeholder={placeholder }
				   type={type}
				   name={name}
				   className="w-full bg-brand-grayEE border border-brand-grayCF p-2 font-sf-pro-display-light text-brand-gray3E focus:bg-transparent outline-none transition-colors duration-200 ease-in-out"
				   id={name}
			   />
			   <Error errors={ errors } fieldName={ name }/>
		   </div>
	   )
	} else {
		return (
			<div className={containerClassNames}>
				<textarea
					rows="5"
					onChange={ handleOnChange }
					defaultValue={ inputValue }
					placeholder={placeholder }
					type={type}
					name={name}
					className="w-full bg-brand-grayEE border border-brand-grayCF p-2 font-sf-pro-display-light text-brand-gray3E focus:bg-transparent outline-none transition-colors duration-200 ease-in-out"
					id={name}
				/>
				<Error errors={ errors } fieldName={ name }/>
			</div>
		)
	}
}

InputField.propTypes = {
	handleOnChange: PropTypes.func,
	inputValue: PropTypes.string,
	name: PropTypes.string,
	type: PropTypes.string,
	label: PropTypes.string,
	placeholder: PropTypes.string,
	errors: PropTypes.object,
	required: PropTypes.bool,
	containerClassNames: PropTypes.string
}

InputField.defaultProps = {
	handleOnChange: () => null,
	inputValue: '',
	name: '',
	type: 'text',
	label: '',
	placeholder: '',
	errors: {},
	required: false,
	containerClassNames: ''
}

export default InputField;

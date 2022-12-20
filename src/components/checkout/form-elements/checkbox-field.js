import PropTypes from 'prop-types';

const CheckboxField = ({ handleOnChange, checked, name, label, placeholder, containerClassNames, type }) => {
	
	return (
		
		<div className={containerClassNames}>
			{/*  <label key={term.id} className={`${!term.isVisible ? 'cursor-not-allowed text-gray-300 ': 'cursor-pointer checkbox-wrapper-hover text-brand-gray3E'}  checkbox-wrapper  font-sf-pro-display-light `}  >
				<span dangerouslySetInnerHTML={{ __html: sanitize(term.name) }}></span>
				<input type="checkbox" 
					disabled={!term.isVisible} 
					value={term.id} 
					id={term.name} 
					name={attribute.name} 
					onChange={() => handleOnChange(attribute.id,term.name)}
					/>
				<span className="checkmark"></span>
			</label> */}
			<label className="leading-7 text-md text-gray-700 flex items-center cursor-pointer checkbox-wrapper " htmlFor={name}>
			<span >{ label || '' }</span>
				<input
					onChange={ handleOnChange }
					placeholder={placeholder}
					type={type}
					checked={checked}
					name={name}
					id={name}
				/>
				<span className="checkmark top-1"></span>
			</label>
		</div>
	)
}

CheckboxField.propTypes = {
	handleOnChange: PropTypes.func,
	checked: PropTypes.bool,
	name: PropTypes.string,
	type: PropTypes.string,
	label: PropTypes.string,
	placeholder: PropTypes.string,
	containerClassNames: PropTypes.string
}

CheckboxField.defaultProps = {
	handleOnChange: () => null,
	checked: false,
	name: '',
	label: '',
	placeholder: '',
	errors: {},
	containerClassNames: ''
}

export default CheckboxField;

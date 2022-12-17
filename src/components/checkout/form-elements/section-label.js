import PropTypes from 'prop-types';

const SectionLabel = ({ number, label, containerClassNames}) => {

	return (
		<div className={`${containerClassNames} flex items-center`}>
			<span className='flex justify-center items-center w-14 h-14 border rounded-full border-brand-gray88 text-brand-gray88 text-20px font-sf-pro-display-medium'>{number}</span>
            <label className='ml-2 font-sf-pro-display-medium text-32px'>{label}</label>
        </div>
	)
}

SectionLabel.propTypes = {
	number: PropTypes.number
}

SectionLabel.defaultProps = {
	number: 0
}

export default SectionLabel;

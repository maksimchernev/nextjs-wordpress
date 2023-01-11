import PropTypes from 'prop-types';

const SectionLabel = ({ number, label, containerClassNames}) => {

	return (
		<div className={`${containerClassNames} flex items-center`}>
			<span className='flex justify-center flex-shrink-0 items-center w-12 h-12 sm:w-14 sm:h-14 border rounded-full border-brand-gray88 text-brand-gray88 text-20px font-sf-pro-display-medium'>{number}</span>
            <label className='pl-2 font-sf-pro-display-medium text-24px sm:text-32px'>{label}</label>
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

import PropTypes from 'prop-types';
import CheckboxField from './form-elements/checkbox-field';
import InputField from "./form-elements/input-field";
import SectionLabel from './form-elements/section-label';
/* import CountrySelection from "./country-selection";
import StateSelection from "./states-selection"; */


const UserForm = ({input, handleOnChange, handleShippingChange , handlePaymentChange}) => {
	
	const {errors} = input || {};
	
	return (
		<>	
			<SectionLabel
				number={1}
				label="Ваш город"
				containerClassNames={'mb-6 lg:mr-10 '}
			/>
			<InputField
				name="city"
				required
				placeholder='Город'
				inputValue={input?.shipping.city}
				handleOnChange={handleOnChange}
				errors={input.shipping.errors}
				containerClassNames="mb-4 lg:mr-10"
			/>
			<SectionLabel
				number={2}
				label="Способ получения заказа"
				containerClassNames={'mb-6 mt-10'}
			/>
			<CheckboxField
				name="isShipping"
				type="checkbox"
				checked={ input?.isShipping }
				handleOnChange={handleShippingChange}
				label="Доставка"
				containerClassNames={`${input?.isShipping ? `bg-brand-grayEE` : `bg-white`} mb-4 lg:mr-10 p-2  border border-brand-grayCF  font-sf-pro-display-light text-brand-gray3E outline-none transition-colors duration-200 ease-in-out`}
			/>
			<CheckboxField
				name="isShipping"
				type="checkbox"
				checked={ !input?.isShipping}
				label="Самовывоз"
				containerClassNames={`${!input?.isShipping ? `bg-brand-grayEE` : `bg-white`} mb-4 lg:mr-10 p-2  border border-brand-grayCF  font-sf-pro-display-light text-brand-gray3E outline-none transition-colors duration-200 ease-in-out`}
			/>
			{input?.isShipping ? (
				<div>
					<h3 className='ml-2 font-sf-pro-display-medium text-32px'>Ваш адрес:</h3>
					<InputField
					name="address"
					inputValue={input?.shipping.address}
					required={input?.isShipping ? true : false}
					handleOnChange={handleOnChange}
					placeholder="Адрес"
					errors={input.shipping.errors}
					containerClassNames="mb-4 lg:mr-10"
					/>
				</div>
			
			) : <div>
					<h3 className='ml-2 font-sf-pro-display-medium text-32px'>Адрес пункта самовывоза:</h3>
					<p className='ml-2'>Санкт-Петербург,ул. Прилукская д.22</p>
				</div>		
			}
			<SectionLabel
				number={3}
				label="Контактные данные"
				containerClassNames={'mb-6 mt-10'}
			/>
			<div className='grid grid-cols-2 gap-4 lg:mr-10'>
				<InputField
					name="firstName"
					inputValue={input?.shipping.firstName}
					required
					handleOnChange={handleOnChange}
					placeholder="Имя"
					errors={input.shipping.errors}
					containerClassNames="w-full overflow-hidden"
				/>
				<InputField
					name="lastName"
					inputValue={input?.shipping.lastName}
					required
					handleOnChange={handleOnChange}
					placeholder="Фамилия"
					errors={input.shipping.errors}
					containerClassNames="w-full overflow-hidden "
				/>
				<InputField
					name="phone"
					inputValue={input?.shipping.phone}
					required
					placeholder="Телефон"
					handleOnChange={handleOnChange}
					errors={input.shipping.errors}
					containerClassNames="w-full overflow-hidden"
				/>
				<InputField
					name="email"
					type="email"
					inputValue={input?.shipping.email}
					required
					placeholder="Почта"
					handleOnChange={handleOnChange}
					errors={input.shipping.errors}
					containerClassNames="w-full overflow-hidden "
				/>
			</div>
			<SectionLabel
				number={4}
				label="Способ оплаты"
				containerClassNames={'mb-6 mt-10'}
			/>
			<CheckboxField
				name="isBankPayment"
				type="checkbox"
				checked={ !input?.isBankPayment }
				handleOnChange={handlePaymentChange}
				label="Наличными"
				containerClassNames={`${!input?.isBankPayment ? `bg-brand-grayEE` : `bg-white`} mb-4 lg:mr-10 p-2  border border-brand-grayCF  font-sf-pro-display-light text-brand-gray3E outline-none transition-colors duration-200 ease-in-out`}
			/>
			<CheckboxField
				name="isBankPayment"
				type="checkbox"
				checked={ input?.isBankPayment}
				label="Банковской картой"
				containerClassNames={`${input?.isBankPayment ? `bg-brand-grayEE` : `bg-white`} mb-4 lg:mr-10 p-2  border border-brand-grayCF  font-sf-pro-display-light text-brand-gray3E outline-none transition-colors duration-200 ease-in-out`}
			/>
			<SectionLabel
				number={5}
				label="Комментарий"
				containerClassNames={'mb-6 mt-10'}
			/>
			<InputField
				multiline={true}
				name="orderNotes"
				inputValue={input?.orderNotes}
				placeholder="Комментарий"
				handleOnChange={handleOnChange}
				errors={input.shipping.errors}
				containerClassNames="mb-4 lg:mr-10"
			/>
		</>
	);
};

UserForm.propTypes = {
	input: PropTypes.object,
	handleOnChange: PropTypes.func,
	handleShippingChange: PropTypes.func,
}

UserForm.defaultProps = {
	input: {},
	handleOnChange: () => null,
	isShipping: false,
	handleShippingChange: () => null
}

export default UserForm	;

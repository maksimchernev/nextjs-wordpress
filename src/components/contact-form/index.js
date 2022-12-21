import { handleSentForm } from "../../utils/main-form";
import validateAndSanitizeMainForm from "../../validator/main-form";
import Error from "../checkout/error";
import InputField from "../checkout/form-elements/input-field";
import cx from 'classnames';
import { useState, useEffect} from 'react';
import { Cross } from "../icons"



const ContactForm = ({bgWhite, handleOnClick}) => { 
    const initialState = {
        name: '',
		phone: '',
        errors: ''
	};

	const [ input, setInput ] = useState( initialState );
    const [ createdFormSubmitData, setCreatedFormSubmitData ] = useState( null );
    const [requestError, setRequestError] = useState(false)
    const [ isFormSumbitProcessing, setIsFormSumbitProcessing ] = useState( false );
    const [orderSuccessful, setOrderSuccessful] = useState(false)
    const handleSubmit = async (event) => {
        event.preventDefault();
		const mainFormValidationResult = validateAndSanitizeMainForm( input );
		setInput( {
			...input, 
            errors: mainFormValidationResult.errors,
		} );
		// If there are any errors, return.
		if ( ! mainFormValidationResult.isValid) {
			return null;
		}
		/* const customerOrderData = */ 
        const response = await handleSentForm( input, setRequestError, setIsFormSumbitProcessing, setCreatedFormSubmitData);
		//console.log( 'hey', response );
		setRequestError( null );
		setOrderSuccessful(true)
    }
    const handleOnChange = ( event ) => {
		const { target } = event || {};		
		const newState = { ...input, [ target.name ]: target.value };
		setInput( newState );
	};
    const handleClose = () => {
        handleOnClick()
        setCreatedFormSubmitData(null)
        setInput(initialState)
    }

    const handleSentMore = () => {
        setCreatedFormSubmitData(null)
        setInput(initialState)
    }

    return (
        <div className={`${bgWhite ? 'text-brand-gray3E py-10 w-4/5 sm:w-3/4 lg:w-3/5 2xl:w-1/2' : 'text-white lg:mt-0 mb-10 my-1 w-full sm:w-3/4 mx-auto overflow-hidden md:w-1/2 lg:w-2/5'} px-1 `} >
            {bgWhite && <button className="absolute top-5 right-5 w-8 hover:bg-brand-yellow mx-2 aspect-square flex items-center justify-center text-22px leading-22px bg-transparent"
                onClick={()=>handleClose()}
            ><Cross/></button>}
            {createdFormSubmitData 
                ?   <>
                        <p className="text-xl xl:text-2xl mb-5 text-center md:text-left font-sf-pro-display-bold">Спасибо за обращение!</p>
                        <p className="text-xl xl:text-xl mb-5 text-center md:text-left font-sf-pro-display-light">В ближайшее время с Вами свяжется наш менеджер!</p>
                        <button 
                            className='w-44 button-form cursor-pointer'
                            onClick={()=>handleSentMore()}>
                                Отправить еще
                        </button>
                    </>
                :   <>
                        <p className={`${bgWhite ? 'text-brand-gray3E text-center' : 'text-white text-center md:text-left'} text-xl xl:text-2xl uppercase mb-5  font-sf-pro-display-medium`}>Наш специалист поможет выбрать конфигурацию под Ваш проект!</p>
                        <form onSubmit={ handleSubmit } className="flex flex-col">
                        <input 
                            name="name"  
                            placeholder="Имя"
                            defaultValue={ input.name } 
                            onChange={( event ) => handleOnChange( event )}
                            type="text" 
                            id="name" 
                            className={`${bgWhite ? 'text-brand-gray3E border-brand-gray3E' : 'text-white border-white'} bg-transparent focus:outline-none border-b  py-2 mb-3 `}
                            />  
                        <Error errors={input.errors} fieldName='name'></Error>
                        <input 
                            name="phone" 
                            placeholder="Телефон"
                            defaultValue={ input.phone } 
                            onChange={handleOnChange}
                            type="text" 
                            id="phone" 
                            /* pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"  */
                            className={`${bgWhite ? 'text-brand-gray3E border-brand-gray3E' : 'text-white border-white'} bg-transparent focus:outline-none border-b  py-2 mb-3 mt-4`}
                        />
                        <Error errors={input.errors} fieldName='phone'></Error>
                        <div className={`${bgWhite ? 'flex justify-center': 'block'} mt-4`}>
                            <button type="submit" 
                                disabled={ isFormSumbitProcessing ? true : false }
                                className={ cx(
                                    'w-36 ',
                                    { 'button-form': !bgWhite},
                                    { 'button-form-black': bgWhite},
                                    { 'opacity-50 cursor-not-allowed ': isFormSumbitProcessing },
                                    { ' cursor-pointer': !isFormSumbitProcessing },
                                ) }>
                                { isFormSumbitProcessing ? 'Обработка...' : 'Отправить' }
                                
                            </button>
                        </div>
                        <p className="text-xs text-gray-400 my-3 text-center md:text-left">Нажимая кнопку “Отправить” я принимаю условия Политики приватности</p>
                    </form>
                    </>
            }
            
        </div>
    )
}

export default ContactForm
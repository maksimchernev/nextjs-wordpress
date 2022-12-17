import { handleSentForm } from "../../utils/main-form";
import validateAndSanitizeMainForm from "../../validator/main-form";
import Error from "../checkout/error";
import InputField from "../checkout/form-elements/input-field";
import cx from 'classnames';
import { useState, useEffect} from 'react';



const ContactForm = () => { 
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
    useEffect(()=> {
    }, [input])
    return (
        <div className="my-1 px-1 overflow-hidden w-1/2 hidden lg:block text-white lg:mt-0 mt-10" >
            {createdFormSubmitData 
                ?   <>
                        <p className="text-xl xl:text-2xl mb-5 text-center md:text-left font-sf-pro-display-bold">Спасибо за обращение!</p>
                        <p className="text-xl xl:text-xl mb-5 text-center md:text-left font-sf-pro-display-light">В ближайшее время с Вами свяжется наш менеджер!</p>
                        <button 
                            className='w-44 button-form cursor-pointer'
                            onClick={()=>setCreatedFormSubmitData(null)}>
                                Отправить еще
                        </button>
                    </>
                :   <>
                        <p className="text-xl xl:text-2xl uppercase mb-5 text-center md:text-left font-sf-pro-display-medium">Наш специалист поможет выбрать конфигурацию под Ваш проект!</p>
                        <form onSubmit={ handleSubmit } className="flex flex-col">
                        <input 
                            name="name"  
                            placeholder="Имя"
                            defaultValue={ input.name } 
                            onChange={( event ) => handleOnChange( event )}
                            type="text" 
                            id="name" 
                            className="text-white bg-transparent border-b border-white py-2 mb-7" 
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
                            className="text-white bg-transparent border-b border-white py-2 mb-7"  
                        />
                        <Error errors={input.errors} fieldName='phone'></Error>

                        <button type="submit" 
                            disabled={ isFormSumbitProcessing ? true : false }
                            className={ cx(
                                'w-36 button-form',
                                { 'opacity-50 cursor-not-allowed ': isFormSumbitProcessing },
                                { ' cursor-pointer': !isFormSumbitProcessing },
                            ) }>
                            { isFormSumbitProcessing ? 'Обработка...' : 'Отправить' }
                            
                        </button>
                        <p className="text-xs text-gray-400 my-3 text-center md:text-left">Нажимая кнопку “Отправить” я принимаю условия Политики приватности</p>
                    </form>
                    </>
            }
            
        </div>
    )
}

export default ContactForm
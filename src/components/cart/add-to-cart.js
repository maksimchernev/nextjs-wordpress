import { isEmpty } from 'lodash';
import { addToCart } from '../../utils/cart';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context';
import Link from 'next/link';
import cx from 'classnames';

const AddToCart = ( { product } ) => {
    const [ cart, setCart ] = useContext( AppContext );
    const [ isAddedToCart, setIsAddedToCart ] = useState( false );
	const [ loading, setLoading ] = useState( false ); 
	const [quantity, setQuantity] = useState(1)

    const increaseQuantity = () => {
        setQuantity(prevQuantity => prevQuantity+1)
        
    }
    const decreaseQuantity = () => {
        setQuantity(prevQuantity => prevQuantity-1)
    }
	
	const addToCartBtnClasses = cx(
		'duration-500  add-to-cart-button uppercase font-thin',
		{
			'add-to-cart-button-normal': ! loading,
			'add-to-cart-button-loading': loading,
		},
	);
/* 	useEffect(()=> {
        //console.log(quantity)
    }, [quantity]) */
	if ( isEmpty( product ) ) {
		return null;
	}
	
	return (
		<>
                <div className="mb-5 flex ">
                    <div className="quantity-counter">
                        <span className="minus" onClick={()=>decreaseQuantity()}>-</span>
                        <input type="text" readOnly={true} value={quantity}/>
                        <span className="plus" onClick={()=>increaseQuantity()}>+</span>
                    </div>
                    <span className="dimention-tag flex items-center ml-1 font-thin font-base">шт.</span>
                </div>
                <div className='flex'>
                    <button
                        className={ addToCartBtnClasses } 
                        onClick={ () => addToCart( product?.id ?? 0, quantity ?? 1, setCart, setIsAddedToCart, setLoading ) }
                        disabled={ loading }
                        >
                        { loading ? 'Добавление...' : 'В корзину' }  
                    </button>
                    { isAddedToCart && ! loading ? (
                        <Link href="/cart">
                            <a
                                className="ml-3 duration-500 view-cart-button uppercase font-thin"
                            >
                                Перейти в корзину
                            </a>
                        </Link>
                    ) : null } 
                </div>
		</>
	);
};

export default AddToCart;

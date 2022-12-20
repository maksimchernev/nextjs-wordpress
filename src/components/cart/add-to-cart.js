import { isEmpty } from 'lodash';
import { addToCart } from '../../utils/cart';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context';
import Link from 'next/link';
import cx from 'classnames';
import { Bag } from '../icons';
import Image from 'next/image';

const AddToCart = ( { product, isItemCard } ) => {
    
    const [ cart, setCart ] = useContext( AppContext );
    const [ isAddedToCart, setIsAddedToCart ] = useState( false );
	const [ loading, setLoading ] = useState( false ); 
	const [quantity, setQuantity] = useState(1)
    if ( isEmpty( product ) ) {
		return null;
	}
    const increaseQuantity = () => {
        setQuantity(prevQuantity => prevQuantity+1)
        
    }
    const decreaseQuantity = () => {
        setQuantity(prevQuantity => prevQuantity-1)
    }
	
	const addToCartBtnClasses = cx(
		{
			'add-to-cart-button-normal': ! loading,
			'add-to-cart-button-loading': loading,
		},
	);
    const addToCartBtnIconClasses = cx(
		{
			'bg-brand-gray88': loading,
		},
	);
	
    if (!isItemCard) {
        return (
            <>
                    <div className="mb-5 flex flex-wrap">
                        <div className="quantity-counter my-2 mr-3 border border-brand-gray88 text-brand-gray88">
                            <span className="minus cursor-pointer" onClick={()=>decreaseQuantity()}>-</span>
                            <input type="text" readOnly={true} value={quantity}/>
                            <span className="plus cursor-pointer" onClick={()=>increaseQuantity()}>+</span>
                        </div>

                        <button
                            className={` ${addToCartBtnClasses} mr-3 duration-500 add-to-cart-button uppercase font-thin my-2`} 
                            onClick={ () => addToCart( product?.id ?? 0, quantity ?? 1, setCart, setIsAddedToCart, setLoading ) }
                            disabled={ loading }
                            >
                            { loading ? 'Добавление...' : 'В корзину' }  
                        </button>
                        { isAddedToCart && ! loading ? (
                            <Link href="/cart">
                                <a
                                    className="duration-500 view-cart-button uppercase font-thin my-2"
                                >
                                    Перейти в корзину
                                </a>
                            </Link>
                        ) : null } 
                    </div>
            </>
        );
    } else {
        return (
            <div className='flex'>
            <button
                className={` ${addToCartBtnIconClasses}  add-to-cart-button-icon ${!loading ? `bg-brand-light-gray88 hover:bg-brand-gray78` : `bg-white` }  duration-100 flex justify-center items-center`} 
                onClick={ () => addToCart( product?.id ?? 0, quantity ?? 1, setCart, setIsAddedToCart, setLoading ) }
                disabled={ loading }
                >
                { loading ? <Image width="20" height="20" src="/cart-spinner.gif"  alt="spinner"/> :  <Bag className='text-brand-yellow  fill-current'></Bag>}  
            </button>
            </div>
        )
    }
};

export default AddToCart;

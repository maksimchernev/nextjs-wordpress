import { isArray, isEmpty } from 'lodash';
import Product from './product';

const ProductList = ({products}) => {
    //console.log('ProductProps', products)
    if ( isEmpty( products ) || !isArray( products ) ) {
		return <p className='text-center text-2xl'>Не найдено :(</p>;
	}
    return (
        <div className="flex flex-wrap justify-around mx-auto overflow-hidden container product-list my-20">
			{ products.length ? products.map( (product, index) => {
				return (
					<Product key={ index } product={product} />
				)
			} ) : null
			
			}
		
		</div>
    )
}
export default ProductList
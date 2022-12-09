import { isArray, isEmpty } from 'lodash';
import Product from './product';

const ProductList = ({products}) => {
    if ( isEmpty( products ) || !isArray( products ) ) {
		return <p className='text-center text-2xl'>Не найдено :(</p>;
	}
    return (
        <div className="w-2/3 md:w-3/4 flex flex-wrap justify-between mx-auto  container product-list">
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
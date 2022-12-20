import { isArray, isEmpty } from 'lodash';
import Product from './product';

const ProductList = ({products}) => {
    if ( isEmpty( products ) || !isArray( products ) ) {
		return (
			<div className="w-2/3 md:w-3/4 xl:w-4/5 flex justify-center">
				<p className='text-center text-2xl'>Не найдено :(</p>
			</div>
			);
	}
    return (
        <div className="w-2/3 md:w-3/4 xl:w-4/5 flex flex-wrap justify-between product-list">
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
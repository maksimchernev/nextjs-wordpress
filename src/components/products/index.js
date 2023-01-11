import { isArray, isEmpty } from 'lodash';
import Product from './product';

const ProductList = ({products}) => {
    if ( isEmpty( products ) || !isArray( products ) ) {
		return (
			<div className="w-full lg:w-3/4 xl:w-4/5 flex justify-center mt-7 lg:mt-0">
				<p className='text-center text-2xl font-sf-pro-display-medium'>Не найдено :(</p>
			</div>
			);
	}
    return (
        <div className="w-full lg:w-3/4 xl:w-4/5 flex flex-wrap justify-between product-list">
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
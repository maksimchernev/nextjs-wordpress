import Layout from '../src/components/layouts';
import { HEADER_FOOTER_ENDPOINT } from '../src/utils/constants/endpoints';

import axios from 'axios'

export default function Cart({headerFooter}) {
    return (
        <div>
            <p>Im cart</p>
        </div>
    )
}

export async function getStaticProps() {
	
	const { data: headerFooterData } = await axios.get( HEADER_FOOTER_ENDPOINT );
	//const { data: products } = await getProductsData();
	
	return {
		props: {
			headerFooter: headerFooterData?.data ?? {},
			//products: products ?? {}
		},
		revalidate: 1,
	};
}

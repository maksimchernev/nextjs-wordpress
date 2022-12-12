import Layout from '../src/components/layout';
import { HEADER_FOOTER_ENDPOINT } from '../src/utils/constants/endpoints';
import axios from 'axios';
import CartItemsContainer from '../src/components/cart/cart-item-container';
import BackButton from '../src/components/backBtn';

export default function Cart({ headerFooter }) {
	return (
		<Layout headerFooter={headerFooter || {}} initialHeader={'black'} isBagYellow={true}>
			<div className='mt-28 container mx-auto'>
				<BackButton />
				<CartItemsContainer/>
			</div>
		</Layout>
	);
}

export async function getStaticProps() {
	
	const { data: headerFooterData } = await axios.get( HEADER_FOOTER_ENDPOINT );
	
	return {
		props: {
			headerFooter: headerFooterData?.data ?? {},
		},
		revalidate: 10,
	};
}

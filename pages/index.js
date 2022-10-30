import Layout from '../src/components/layouts';
import Hero from '../src/components/hero'
import About from '../src/components/about';
import Howto from '../src/components/howto/howto';
import ChooseBrand from '../src/components/chooseBrand';

import { HEADER_FOOTER_ENDPOINT, GET_PRODUCTS_ENDPOINT, GET_CATEGORIES_ENDPOINT} from '../src/utils/constants/endpoints';

import axios from 'axios'

export default function Home(props) {
  console.warn('propss', props)

  return (
    <Layout headerFooter={props.headerFooter}>
       <Hero></Hero>
       <About></About>
       <Howto></Howto>
       <ChooseBrand categories={props.categories}></ChooseBrand>
    </Layout>
  )
}

export async function getStaticProps() {
	
	const { data: headerFooterData } = await axios.get( HEADER_FOOTER_ENDPOINT );
	const { data: productsData } = await axios.get(GET_PRODUCTS_ENDPOINT);
  const { data: categoriesData } = await axios.get(GET_CATEGORIES_ENDPOINT);
  console.log(categoriesData)
	return {
		props: {
			headerFooter: headerFooterData?.data ?? {},
			products: productsData?.products ?? {},
      categories: categoriesData?.categories ?? {}
		},
		revalidate: 1,
	};
}

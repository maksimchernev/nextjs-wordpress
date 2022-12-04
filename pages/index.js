import axios from 'axios'

import Layout from '../src/components/layout';
import Hero from '../src/components/hero'
import About from '../src/components/about';
import Howto from '../src/components/howto/howto';
import ChooseBrand from '../src/components/choose-brand';

import { HEADER_FOOTER_ENDPOINT} from '../src/utils/constants/endpoints';
import { getSubCategoriesById } from '../src/utils/categories';

export default function Home({headerFooter, brands}) {
  /* console.warn('propsMain', headerFooter, brands) */

  return (
    <Layout headerFooter={headerFooter} initialHeader={'white'} isBagYellow={false}>
       <Hero h1Content={'Просто о сложном'} text={'Магнитные системы для вашей жизни'} button={'Заказать рассчет'} isMain={true}/>
       <About/>
       <Howto/>
       <ChooseBrand brands={brands}/>
    </Layout>
  )
}

export async function getStaticProps() {
	const { data: headerFooterData } = await axios.get( HEADER_FOOTER_ENDPOINT );
  const brands = await getSubCategoriesById(0);
	return {
		props: {
			headerFooter: headerFooterData?.data ?? {},
      brands: brands ?? {}
		},
		revalidate: 1,
	};
}

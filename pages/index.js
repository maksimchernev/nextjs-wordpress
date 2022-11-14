import Layout from '../src/components/layouts';
import Hero from '../src/components/hero'
import About from '../src/components/about';
import Howto from '../src/components/howto/howto';
import ChooseBrand from '../src/components/chooseBrand';

import { HEADER_FOOTER_ENDPOINT} from '../src/utils/constants/endpoints';

import axios from 'axios'
import { getCategoriesData } from '../src/utils/categories';

export default function Home(props) {
  //console.warn('propss', props)

  return (
    <Layout headerFooter={props.headerFooter} initialHeader={'white'} isHeaderVisible={true}>
       <Hero h1Content={'Просто о сложном'} text={'Магнитные системы для вашей жизни'} button={'Заказать рассчет'}/>
       <About/>
       <Howto/>
       <ChooseBrand categories={props.categories}/>
    </Layout>
  )
}

export async function getStaticProps() {
	
	const { data: headerFooterData } = await axios.get( HEADER_FOOTER_ENDPOINT );
  const { data: categories } = await getCategoriesData();
  //console.log('categories', categories)
	return {
		props: {
			headerFooter: headerFooterData?.data ?? {},
			
      categories: categories ?? {}
		},
		revalidate: 1,
	};
}

import axios from 'axios'

import Layout from '../src/components/layout';
import Hero from '../src/components/hero'
import About from '../src/components/about';
import Howto from '../src/components/howto';
import ChooseBrand from '../src/components/choose-brand';

import { HEADER_FOOTER_ENDPOINT, HERO_ENDPOINT} from '../src/utils/constants/endpoints';
import { getSubCategoriesById } from '../src/utils/categories';
import ContactUs from '../src/components/contact-us';

export default function Home({headerFooter, brands, hero}) {
  return (
    <Layout headerFooter={headerFooter} initialHeader={'white'} isBagYellow={false}>
       <Hero h1Content={hero.heroTitle} text={hero.heroDescription} button={hero.heroBtnTxt} isMain={true} image={hero.heroImgURL} header={headerFooter.header}/>
       <About/>
       <Howto/>
       <ContactUs/>
       <ChooseBrand brands={brands}/>
    </Layout>
  )
}

export async function getStaticProps() {
	const { data: headerFooterData } = await axios.get( HEADER_FOOTER_ENDPOINT );
  const { data: hero } = await axios.get( HERO_ENDPOINT );
  const brands = await getSubCategoriesById(0);
	return {
		props: {
			headerFooter: headerFooterData?.data ?? {},
      brands: brands ?? {},
      hero: hero.heroSection ?? {}
		},
		revalidate: 10,
	};
}

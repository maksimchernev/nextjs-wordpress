import axios from 'axios'
import Link from "next/link"
import { useRouter } from 'next/router';
import Layout from '../../../../src/components/layouts';
import {getBrandsAndSeries, getCategoryData} from '../../../../src/utils/categories'
import {HEADER_FOOTER_ENDPOINT} from '../../../../src/utils/constants/endpoints'
import Image from '../../../../src/components/image' 
import BackButton from '../../../../src/components/backBtn';
import Hero from '../../../../src/components/hero';
import ProductList from '../../../../src/components/productList';
import {getProductsData} from '../../../../src/utils/products'

export default function Series(props) {
  console.log('propsSeries', props)
  const router = useRouter()
  if (router.isFallback) {
    return <h1>Loaddddd</h1>
  }
  return (
    <Layout headerFooter={props.headerFooter} initialHeader={'black'} isHeaderVisible={false}>
        <BackButton isHeaderVisible={false}/>
        <Hero h1Content={props?.seriesData?.name} h1Bottom={true}/>
        <ProductList/>
        <div className='w-full flex flex-wrap overflow-hidden container mx-auto px-12 justify-center'>
          {props?.seriesData?.description}
        </div>

        <div className="w-full flex flex-wrap overflow-hidden container mx-auto py-12">
       
        </div>
        <div className="w-full flex flex-wrap overflow-hidden container mx-auto py-12">
          
        </div>
        
        <div className="w-full flex flex-wrap overflow-hidden container mx-auto py-24" id='series'>
        
        </div>
    </Layout>
  )
}

export async function getStaticPaths() {
    const paths = await getBrandsAndSeries()
    return {
      paths,
      fallback: true,
    };
} 

export async function getStaticProps(context) {
  const { data: headerFooterData } = await axios.get( HEADER_FOOTER_ENDPOINT );
  const {params} = context
  const seriesData = await getCategoryData(params.seriesId)
  const { data: products } = await getProductsData(50, seriesData?.id)
  if (!seriesData?.id) {
    return {
      notFound: true
    }
  }
  
	return {
		props: {
      headerFooter: headerFooterData?.data ?? {},
      seriesData: seriesData ?? {},
      products: products ?? {},
		},
    revalidate: 1,
	};
} 


import axios from 'axios'
import Link from "next/link"
import { useRouter } from 'next/router';
import Layout from '../../../../../src/components/layout';
import {getBrandsAndSeriesPaths, getSubCategoriesById, getCategoryDataBySlug, getCategoryDataById} from '../../../../../src/utils/categories'
import {HEADER_FOOTER_ENDPOINT} from '../../../../../src/utils/constants/endpoints'
import Image from '../../../../../src/components/image' 
import BreadCrumb from '../../../../../src/components/breadcrumb';
import Hero from '../../../../../src/components/hero';
import { isArray } from 'lodash';

export default function Series(props) {
  const router = useRouter()
  if (router.isFallback) {
    return <h1>Loading...</h1>
  }  
  return (
    <Layout headerFooter={props.headerFooter} initialHeader={'white'} isBagYellow={true}>
        <BreadCrumb isMain={true} bgProduct={false}/>
        <Hero h1Content={props?.seriesData?.name} isMain={false} />
        <div className="w-full flex flex-wrap  container mx-auto py-20 md:py-24" id='series'>
          {props.typeCategoryData?.length && isArray(props.typeCategoryData) ? props.typeCategoryData.map((type)=> {
            const slug = type?.slug?.slice(0, type?.slug?.indexOf('-'))
            const img = type?.image
            return (
              <div key={type.id} className='p-3 w-full md:w-1/2 '>
                <h2 className='text-4xl uppercase my-4 md:mb-12 font-sf-pro-display-medium'>{type.name}</h2>
                <Link href={{
                        pathname: '/brand/[brandId]/series/[seriesId]/type/[typeId]',
                        query: { brandId: router.query.brandId, seriesId: router.query.seriesId, typeId: slug },
                      }}>
                  <a>
                    <div className='flex-col relative'
                      >
                      <Image
                        sourceUrl={ img?.src || '' }
                        altText={ img?.alt || type?.name}
                        title={ type?.name || '' }
                        layout = 'fill'
                        containerClassNames={'card series-card h-80 md:h-52 lg:h-80 xl:h-96'}
                        className={'rounded-2xl'}
                      />
                    </div>
                  </a>
                </Link>
              </div>
            )
            }) : null
          }
        </div>
    </Layout>
  )
}

export async function getStaticPaths() {
    const paths = await getBrandsAndSeriesPaths()
    return {
      paths,
      fallback: true,
    };
} 

export async function getStaticProps({params}) {
  const { data: headerFooterData } = await axios.get( HEADER_FOOTER_ENDPOINT );
  const seriesData = await getCategoryDataBySlug(params.seriesId)
  const {data: brandData} = await getCategoryDataById(seriesData?.parent)
  const typeCategoryData = await getSubCategoriesById(seriesData?.id, 'Сопутствующие')
  if (!seriesData?.id) {
    return {
      notFound: true
    }
  }
  
	return {
		props: {
      headerFooter: headerFooterData?.data ?? {},
      seriesData: seriesData ?? {},
      brandData: brandData || {},
      typeCategoryData: typeCategoryData || {}
		},
    revalidate: 10,
	};
} 


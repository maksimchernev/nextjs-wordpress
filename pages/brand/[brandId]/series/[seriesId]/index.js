import axios from 'axios'
import Link from "next/link"
import { useRouter } from 'next/router';
import Layout from '../../../../../src/components/layout';
import {getBrandsAndSeriesPaths, getSubCategoriesById, getCategoryDataBySlug, getCategoryDataById} from '../../../../../src/utils/categories'
import {HEADER_FOOTER_ENDPOINT} from '../../../../../src/utils/constants/endpoints'
import Image from '../../../../../src/components/image' 
import BackButton from '../../../../../src/components/backBtn';
import Hero from '../../../../../src/components/hero';
import { isArray } from 'lodash';

export default function Series(props) {
 //console.log'propsSeries', props)
  const router = useRouter()
  if (router.isFallback) {
    return <h1>Loading...</h1>
  }  
  return (
    <Layout headerFooter={props.headerFooter} initialHeader={'white'} isBagYellow={true}>
        <BackButton isMain={true}/>
        <Hero h1Content={props?.seriesData?.name} isMain={false} brandData={props.brandData}/>
        <div className="w-full flex flex-wrap overflow-hidden container mx-auto py-24" id='series'>
          {props.typeCategoryData?.length && isArray(props.typeCategoryData) ? props.typeCategoryData.map((type)=> {
            const slug = type?.slug?.slice(0, type?.slug?.indexOf('-'))
            const img = type?.image
            return (
              <div key={type.id} className='my-2 px-2 md:w-1/2 sm:w-full overflow-hidden'>
                <h2 className='text-4xl uppercase mb-12'>{type.name}</h2>
                <Link href={{
                        pathname: '/brand/[brandId]/series/[seriesId]/type/[typeId]',
                        query: { brandId: router.query.brandId, seriesId: router.query.seriesId, typeId: slug },
                      }}>
                  <a>
                    <div className='flex-col relative'
                      >
                      <Image
                        sourceUrl={ img?.src ?? '' }
                        altText={ img?.alt ?? ''}
                        title={ type?.name ?? '' }
                        width="800"
                        height="500"
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
    revalidate: 1,
	};
} 


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
import Loader from '../../../../../src/components/loader';

export default function Series(props) {
  const router = useRouter()
  if (router.isFallback) {
    return <Loader/>
  }  
  return (
    <Layout isMain={false} headerFooter={props.headerFooter} initialHeader={'white'} isBagYellow={true} title={props?.seriesData?.name}>
        <BreadCrumb isAbs={true}/>
        <Hero h1Content={props?.seriesData?.name} isMain={false} />
        <div className="w-full flex flex-wrap justify-center container mx-auto my-6 sm:my-12 md:py-16 category-card" id='series'>
          {props.typeCategoryData?.length && isArray(props.typeCategoryData) ? props.typeCategoryData.map((type)=> {
            const slug = type?.slug
            const img = type?.image
            return (
              <div key={type.id} className='w-full sm:w-1/2 lg:w-1/3 p-3'>
                <Link href={{
                        pathname: '/brand/[brandId]/series/[seriesId]/type/[typeId]',
                        query: { brandId: router.query.brandId, seriesId: router.query.seriesId, typeId: slug },
                      }}>
                  <a>                 
                    <div className='flex-col relative'
                      >
                      <Image
                        sourceUrl={ img?.src || '/lamps.jpg' }
                        altText={ img?.alt || type?.name}
                        title={ type?.name || '' }
                        layout = 'fill'
                        containerClassNames={'card series-card h-24 sm:h-80 md:h-52 lg:h-80 xl:h-96 '}
                        className={'rounded-2xl brightness-50'}
                      />
                      <h3 className='text-white uppercase series-card-text mb-0 font-sf-pro-display-medium cursor-pointer text-center w-full text-26px'>{type.name}</h3>

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
  let seriesData = await getCategoryDataBySlug(params.seriesId)
 
  if (!seriesData?.id) {
    return {
      notFound: true
    }
  }
  const {data: brandData} = await getCategoryDataById(seriesData?.parent)
  if (!brandData.id) {
    return {
        notFound: true
    }
  }
  const typeCategoryData = await getSubCategoriesById(seriesData?.id)
  if (!typeCategoryData?.[0].id) {
    return {
        notFound: true
    }
  }
  typeCategoryData.sort((one, two) => {
    if (one.name == 'Шинопроводы') {
      return -1
    } else {
      return 1
    }

  }) 
	return {
		props: {
      headerFooter: headerFooterData?.data ?? {},
      seriesData: seriesData ?? {},
      brandData: brandData || {},
      typeCategoryData: typeCategoryData || []
		},
    revalidate: 10,
	};
} 


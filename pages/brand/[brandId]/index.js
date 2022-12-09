import Layout from '../../../src/components/layout';
import {getAllBrandsPaths, getCategoryDataBySlug, getSubCategoriesById} from '../../../src/utils/categories'
import {HEADER_FOOTER_ENDPOINT} from '../../../src/utils/constants/endpoints'
import axios from 'axios'
import Image from '../../../src/components/image' 
import Link from "next/link"
import BackButton from '../../../src/components/backBtn';
import { ArrowDown } from '../../../src/components/icons';
import { Embedded } from '../../../src/components/icons';
import { Overhead } from '../../../src/components/icons';
import { Profile } from '../../../src/components/icons';
import {useRouter} from 'next/router'


export default function Brand(props) {
  const router = useRouter()
  if (router.isFallback) {
    return <h1>Loaddddd</h1>
  }
  const img = props?.brandData?.image ?? {}
  let pecOne
  if (props?.series?.length > 1) {
    pecOne = `${props?.series?.length} отдельные системы светильников`
  } else {
    pecOne = null
  }
  let pecs = []
  props?.series ? props?.series.map(name => { 
    let descrArr = name.description.split('\r\n')
    if(descrArr[descrArr.indexOf('Особенности:')+1]) {
      pecs.push ({
        name: name.name,
        peculiarity: descrArr[descrArr.indexOf('Особенности:')+1],
      })
    }
  }) : null

  let availablePics = ['встраиваемый', 'накладной', 'профиль']
  
  let options = props?.series ? props?.series.map(name => { 
    let descrArr = name.description.split('\r\n')
    return descrArr[descrArr.indexOf('Варианты установки:')+1]
  }) : null
  options? options = options.join() : options = null
  let instOptions = []
  for (let picName of availablePics) {
    if (options && options.includes(picName)) {
      instOptions.push(picName)
    } 
  }

  return (
    <Layout headerFooter={props.headerFooter} initialHeader={'black'} isHeaderVisible={true} isBagYellow={false}>
        <BackButton isHeaderVisible={true}/>
        <div className='w-full flex flex-wrap overflow-hidden container mx-auto px-12 justify-center'>
          <Image 
            sourceUrl={img?.src ?? ''}
            altText={img?.alt ?? ''}
            title={props?.brandData?.name ?? ''}
            width={'250px'}
            height={'50px'}
            className={' filter-red'}
          /> 
        </div>

        <div className="w-full flex flex-wrap overflow-hidden container mx-auto py-12">
          <div className='flex w-full pl-7 md:pl-0 md:w-1/2 h-86 bg-red flex-col text-xl leading-8'>
            <p className='pl-1 font-medium text-20px lg:text-26px uppercase'>Особенности:</p>
              <ol className="pl-6 list-disc pt-4 overflow-visible">
                {pecOne && <li className='text-base lg:text-20px mb-2'>{pecOne}</li>}
                {pecs?.length ? pecs.map((pec, index) => {
                  return (
                    <li key={ index } className='text-base lg:text-20px mb-2'>{`${pec.name} - ${pec.peculiarity}`}</li>
                  )
                }) : null}
              </ol>
          </div>
          <div className='flex w-full md:w-1/2 pt-7 md:pt-0 h-86 bg-red flex-col pl-7 md:pl-12  text-xl leading-8'>
            <p className='font-medium text-20px lg:text-26px uppercase'>Варианты установки:</p>
              <div className='flex flex-row flex-wrap justify-between lg:justify-start '>
                {instOptions?.length ? instOptions?.map((option, index) => {
                  let icon 

                  switch (option) {
                    case 'встраиваемый':
                      icon = <Embedded/>
                      break
                    case 'накладной':
                      icon = <Overhead/>
                      break
                    case 'профиль':
                      icon = <Profile/>
                      break
                    default:
                      icon = null
                  }
                  return (
                    <div className='flex items-center pr-12 pt-7 flex-col lg:pr-28' key={ index }>
                      {icon}
                      <p className='capitalize pt-2 text-brand-gray78'>{option}</p>
                    </div>
                  )
                }) : null}
              </div>
          </div>
         
        </div>
        <div className="w-full flex flex-wrap overflow-hidden container mx-auto my-4">
          <p className='w-full flex justify-center uppercase text-20px lg:text-26px font-sf-pro-display-medium'>Выбрать серию</p>
          <div className='flex w-full justify-center my-4'>
            <Link href='#series'>
              <a className="flex mt-4 lg:inline-block lg:mt-0 text-black hover:text-black">
                <span className="flex flex-row items-center lg:flex-col">
                  <ArrowDown className="mr-1 lg:mr-0 fill-current h-8 w-8 down-btn"/>
                </span>
              </a>
            </Link>
          </div>
        </div>
        
        <div className="w-full flex flex-wrap  container mx-auto py-12" id='series'>
          <h1 className='w-full flex text-2xl font-sf-pro-display uppercase text-26px lg:text-40px mb-12 ml-1'>Магнитные трековые системы {props?.brandData?.name ?? ""}</h1>
          {
            props.series?.length ? props.series?.map ( name => {
              let img = name.image
              return (
                <div className='w-full md:w-1/2 p-3' key={name.id}>
                  <Link href={{
                    pathname: '[brandId]/series/[seriesId]',
                    query: { brandId: router.query.brandId, seriesId: name?.slug },
                  }}>
                    <a>
                      <div className='flex-col relative'>
                        <Image
                          sourceUrl={ img?.src ?? '' }
                          altText={ img?.alt ?? ''}
                          title={ name?.name ?? '' }
                          layout = 'fill'
                          containerClassNames={'card series-card h-80 md:h-52 lg:h-80 xl:h-96'}
                          className={'rounded-2xl'}
                        />
                        <p className='text-white uppercase self-end series-card-text'>{name?.name}</p>
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
    const paths = await getAllBrandsPaths()
    return {
      paths,
      fallback: true,
    };
  } 

export async function getStaticProps({params}) {
  const { data: headerFooterData } = await axios.get( HEADER_FOOTER_ENDPOINT );
  const brandData = await getCategoryDataBySlug(params.brandId)
  const series = await getSubCategoriesById(brandData?.id)
  if (!brandData?.id) {
    return {
      notFound: true
    }
  }
	return {
		props: {
      headerFooter: headerFooterData?.data ?? {},
      brandData: brandData ?? {},
      series: series ?? {}
		},
    revalidate: 1,
	};
} 


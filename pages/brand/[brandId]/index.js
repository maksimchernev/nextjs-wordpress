import Layout from '../../../src/components/layout';
import {getAllBrandsPaths, getCategoryDataBySlug, getSubCategoriesById} from '../../../src/utils/categories'
import {HEADER_FOOTER_ENDPOINT} from '../../../src/utils/constants/endpoints'
import axios from 'axios'
import Image from '../../../src/components/image' 
import Link from "next/link"
import BreadCrumb from '../../../src/components/breadcrumb';
import { ArrowDown } from '../../../src/components/icons';
import { Embedded } from '../../../src/components/icons';
import { Overhead } from '../../../src/components/icons';
import { Profile } from '../../../src/components/icons';
import {useRouter} from 'next/router'
import { capitalized, sanitizeTags } from '../../../src/utils/miscellaneous';
import { useMemo } from 'react';
import Loader from '../../../src/components/loader';


export default function Brand(props) {
  const {img, pecOne, pecs, instOptions} = useMemo(function generateCharData() {
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
    return {img, pecOne, pecs, instOptions}
  }, [props?.brandData?.image, props?.series])

  const router = useRouter()
  if (router.isFallback) {
    return <Loader/>
  }  

  return (
    <Layout isMain={false} headerFooter={props.headerFooter} initialHeader={'black'} isHeaderVisible={true} isBagYellow={false} title={props?.brandData?.name}>
        <BreadCrumb/>
        <div className='w-full flex flex-wrap overflow-hidden container mx-auto px-12 justify-center'>
          <Image 
            sourceUrl={img?.src ?? ''}
            altText={img?.alt || capitalized(props?.brandData?.name)}
            title={props?.brandData?.name ?? ''}
            width={'250px'}
            height={'50px'}
            className={' filter-red'}
          /> 
        </div>

        {instOptions.length && pecs.length ? <div className="w-full flex flex-wrap overflow-hidden container mx-auto py-6 sm:py-12 px-2">
          {pecs.length ? <div className='flex w-full sm:w-1/2 h-86 bg-red flex-col text-xl leading-8'>
            <p className='pl-1 font-sf-pro-display-medium text-20px lg:text-26px uppercase'>Особенности:</p>
              <ol className="pl-6 list-disc mt-7  overflow-visible">
                {pecOne && <li className='text-base lg:text-20px mb-2'>{pecOne}</li>}
                {pecs.map((pec, index) => {
                  return (
                    <li key={ index } className='text-base lg:text-20px mb-2'>{`${sanitizeTags(pec.name)} - ${sanitizeTags(pec.peculiarity)}`}</li>
                  )
                }) }
              </ol>
          </div> : null}
          {instOptions.length ? <div className='flex w-full sm:w-1/2 pt-7 sm:pt-0 h-86 bg-red flex-col md:pl-12  text-xl leading-8'>
            <p className='font-sf-pro-display-medium text-20px lg:text-26px uppercase pl-1'>Варианты установки:</p>
              <div className='flex flex-row flex-wrap justify-between  mt-7 installation-options'>
                {instOptions?.map((option, index) => {
                  let icon 
                  switch (option) {
                    case 'встраиваемый':
                      icon = <Embedded />
                      break
                    case 'накладной':
                      icon = <Overhead />
                      break
                    case 'профиль':
                      icon = <Profile />
                      break
                    default:
                      icon = null
                  }
                  return (
                    <div className='flex items-center flex-wrap justify-center md:items-start flex-col w-1/3' key={ index }>
                      <div className='flex flex-col items-center w-28'>
                        {icon}
                        <p className='pt-2 text-brand-gray78'>{capitalized(option)}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
          </div>
          : null}
         
        </div> : null}
        <div className="w-full md:flex hidden flex-wrap overflow-hidden container mx-auto md:my-4 px-2">
          <p className='w-full flex md:justify-center uppercase text-20px lg:text-26px font-sf-pro-display-medium'>Выбрать серию</p>
          <div className='flex w-full justify-center md:my-4'>
            <Link href='#series'>
              <a className="flex md:mt-4 lg:inline-block lg:mt-0 text-black hover:text-black">
                <span className="flex flex-row items-center lg:flex-col">
                  <ArrowDown className="mr-1 lg:mr-0 fill-current h-8 w-8 down-btn"/>
                </span>
              </a>
            </Link>
          </div>
        </div>
        
        <div className="w-full flex flex-wrap  container mx-auto py-6 sm:py-12 px-2" id='series'>
          <h1 className='w-full flex text-2xl font-sf-pro-display uppercase text-26px lg:text-40px mb-3 sm:mb-6 ml-1'>Магнитные трековые системы {props?.brandData?.name ?? ""}</h1>
          <div className='category-card flex flex-wrap w-full my-3 sm:my-6'>

            {
              props.series?.length ? props.series?.map ( name => {
                let img = name.image
                return (
                  <div className='w-full sm:w-1/2 lg:w-1/4 p-3 ' key={name.id}>
                    <Link href={{
                      pathname: '[brandId]/series/[seriesId]',
                      query: { brandId: router.query.brandId, seriesId: name?.slug },
                    }}>
                      <a>
                        <div className='flex-col relative '>
                          <Image
                            sourceUrl={ img?.src ?? '' }
                            altText={ img?.alt || name?.name}
                            title={ name?.name ?? '' }
                            layout = 'fill'
                            containerClassNames={'card series-card h-24 sm:h-80 md:h-52 lg:h-80 xl:h-96 '}
                            className={'rounded-2xl brightness-50'}
                          />
                          <h3 className='text-white uppercase series-card-text mb-0 font-sf-pro-display-medium cursor-pointer text-center w-full text-26px'>{capitalized(name?.name)}</h3>
                        </div>
                      </a>
                    </Link>
                  </div>
                )
              }) : null 
            }
          </div>
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
  if (!brandData?.id) {
    return {
      notFound: true
    }
  }
  const series = await getSubCategoriesById(brandData?.id)
  if (!series?.[0].id) {
    return {
      notFound: true
    }
  }
	return {
		props: {
      headerFooter: headerFooterData?.data ?? {},
      brandData: brandData ?? {},
      series: series ?? []
		},
    revalidate: 10,
	};
} 


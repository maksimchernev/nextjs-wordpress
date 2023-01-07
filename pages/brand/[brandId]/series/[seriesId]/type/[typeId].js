import Layout from '../../../../../../src/components/layout';
import { HEADER_FOOTER_ENDPOINT } from '../../../../../../src/utils/constants/endpoints';
import {getProductsDataByCategoryId} from '../../../../../../src/utils/products'
import {getBrandsSeriesTypePaths, getCategoryDataBySlug, getCategoryDataById} from '../../../../../../src/utils/categories'
import axios from 'axios'
import { useRouter } from 'next/router';
import BreadCrumb from '../../../../../../src/components/breadcrumb';
import Hero from '../../../../../../src/components/hero';
import { getRelatedAttributesData } from '../../../../../../src/utils/attributes';
import ProductList from '../../../../../../src/components/products';
import Filters from '../../../../../../src/components/filters';
import { useState, useEffect } from 'react';
import { getObjectOfArray, getWindowDimensions, splitIntoPages } from '../../../../../../src/utils/miscellaneous';
import Pagination from '../../../../../../src/components/products/pagination';
import {isArray, isEmpty} from 'lodash'
import { FiltersIcon } from '../../../../../../src/components/icons';

export default function Type(props) {
    /* product display states */
    const [products, setProducts] = useState(splitIntoPages(props?.products, 30))
    const [page, setPage] = useState(1)
    const [currentProducts, setCurrentProducts] = useState(products[page-1])
    const [productsPerPage, setProductsPerPage] = useState(30)

    /* filtration states */
    const [filters, setFilters] = useState(props?.relatedAttributes?.filtersObj || {})
    const [attributes, setAttributes] = useState( props?.relatedAttributes?.relatedAttributes || [])
    const [attrChosenLast, setAttrChosenLast] = useState([])
    const [isOpened, setIsOpened] = useState(getObjectOfArray(props?.relatedAttributes?.relatedAttributes, false))

    /* mobile filters statesw */
    const [isShowFilters, setIsShowfilters] = useState(false)
    const [isMobile, setIsMobile] = useState()
    useEffect(()=> {
        let newProducts = [...props?.products]
        for (const filter in filters ) {
            //click filters
            if (filters[filter]?.length && filter != 'length' && filter != 'width' && filter != 'height' ) {
                let midNewproducts = newProducts?.filter(product => {
                    let condition 
                    for (const attribute of product?.attributes) {
                        if (attribute?.id == filter ) {
                            for (let attributeTerm of attribute?.options) {
                                if(filters[filter]?.includes(attributeTerm)) {
                                    condition = true
                                    break
                                }
                            }
                        }
                        if (condition) {
                            break
                        }  
                    }
                    if (condition) {
                        return product
                    }  
                })
                newProducts = midNewproducts
            } else if (filter == 'length' || filter == 'width' || filter == 'height') {
                //dimention filters
                let midNewproducts = newProducts?.filter(product=> {
                    let condition 
                    for (const dimension in product?.dimensions) {
                        if (dimension == filter ) {
                            if(Number(filters[filter]?.from) <= Number(product?.dimensions[dimension]) && Number(filters[filter]?.till) >= Number(product?.dimensions[dimension])) {
                                condition = true
                                break   
                            }
                        }
                        if (condition) {
                            break
                        }  
                    }
                    if (condition) {
                        return product
                    }  
                })
                newProducts = midNewproducts
            }

        }
        if (newProducts?.length == 0) {
            //когда ниче не нашел
            let newAttributesArray = props?.relatedAttributes?.relatedAttributes
            if (newAttributesArray && isArray(newAttributesArray) && newAttributesArray.length) {
                for (let attribute of newAttributesArray) {
                    if (attribute?.hasOwnProperty('terms')){
                        for (let term of attribute?.terms) {
                            term.isVisible = true
                        }
                    }
                }
            }
            setCurrentProducts([])
            
        } else {
            const isFiltersEmpty = Object.values(filters)?.every(value => {
                if (typeof value != 'object') {
                    if (!value?.length) {
                      return true;
                    }
                    return false;
                } else {
                    if (value?.till != 99999999 && value?.from != 0) {
                        return true;
                    }
                    return false;
                }
              });
            if (!isFiltersEmpty) {
                //modify available attributes
                let newAttributesArray = props?.relatedAttributes?.relatedAttributes
                if (newAttributesArray && isArray(newAttributesArray) && newAttributesArray.length) {
                    for (let attribute of newAttributesArray) {
                        //не обнуляем последний измененный фильтр
                        if(attribute?.id != attrChosenLast[attrChosenLast?.length-1]) {
                            if (attribute?.hasOwnProperty('terms')){
                                for (let term of attribute?.terms) {
                                    term.isVisible = false
                                    
                                } 
                            }
                        }
                    }
                }
                for (let product of newProducts) {
                    for (let productAttribute of product.attributes) {
                        if (newAttributesArray && isArray(newAttributesArray) && newAttributesArray.length) {
                            for (let attribute of newAttributesArray) {
                                if (attribute?.hasOwnProperty('terms')){
                                    for (let term of attribute?.terms) {
                                        if (productAttribute?.options?.includes(term?.name)) {
                                            term.isVisible = true   
                                        } 
                                    }
                                }
                            }
                        }
                    }
                }
                setAttributes([...newAttributesArray])
            } else {
                //if filters became empty
                let newAttributesArray = props.relatedAttributes?.relatedAttributes
                if (newAttributesArray && isArray(newAttributesArray) && newAttributesArray.length) {
                    for (let attribute of newAttributesArray) {
                        if (attribute?.hasOwnProperty('terms')){
                            for (let term of attribute?.terms) {
                                term.isVisible = true
                            }
                        }
                    }
                }
            }
            
            newProducts = splitIntoPages(newProducts, productsPerPage)
            setProducts(newProducts)
            if(isEmpty(newProducts[page-1])) {
                setPage(1)
            }
            setCurrentProducts(newProducts[page-1])
        }
    }, [filters, page, productsPerPage])
    useEffect(()=> {
        function handleResize() {
            let {width} = getWindowDimensions()
            if (width >= 1536) {
                setProductsPerPage(32)
            } else if (width < 1536){
                setProductsPerPage(30)
            }
            if (width >=1024) {
                setIsMobile(false)
            } else {
                setIsMobile(true)
            }
        }      
        handleResize()
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [])  
    const router = useRouter()
    if (router.isFallback) {
        return <h1>Loading...</h1>
    }
    const typeId = router?.query?.typeId
    let h1text 
    if (typeId.includes('tracks')) {
        h1text = 'Трековые системы'
    } else if (typeId.includes('lamps')){
        h1text = 'Светильники'
    } else if (typeId.includes('accessory')) {
        h1text = 'Аксессуары'
    }

    const handleRemoveFilters = () => {
        if (isMobile) {
            const newIsOpened = 
                Object
                    .keys(isOpened)
                    .reduce((result, k) => { 
                    return { ...result, [k]: false };
                }, {})
            setIsOpened(newIsOpened)
        } 
        setFilters(props?.relatedAttributes?.filtersObj || {})
        setProducts(splitIntoPages(props?.products, productsPerPage))
        setCurrentProducts(products[page-1])
    }
    return (
        <Layout isMain={false} headerFooter={props?.headerFooter} initialHeader={'white'} isBagYellow={true} title={`${h1text} ${props?.brandData?.name}`}>
            <BreadCrumb isAbs={true}/>
            <Hero h1Content={h1text} isMain={false} image={typeId?.slice(0, typeId?.indexOf('-')) == 'tracks' ? '/tracks.jpg' : '/lamps.jpg'}/>
            <div className='flex flex-col lg:flex-row container mx-auto mt-5 sm:mt-16 relative mb-10 md:mb-20'>
                <button
                    onClick={ () => setIsShowfilters( ! isShowFilters ) }
                    className="flex lg:hidden  items-center w-6 h-6 rounded bg-brand-gray78 justify-center mx-4 hover:bg-brand-gray99 mb-4">
                    {<FiltersIcon className="fill-current h-4 w-3 text-brand-yellow"/>}
                </button>
                <div className={`${isShowFilters ? `px-4` : `px-2 lg:flex`} w-full lg:w-1/4 xl:w-1/5  flex-col flex-wrap lg:pl-2 lg:pr-3`} style={{
                    opacity: isShowFilters || !isMobile ? "1" : "0",
                    transition: isShowFilters ? "all .1s" : 'all 0s',
                    visibility: isShowFilters || !isMobile ? "visible" : "hidden", 
                    height: isMobile && (!isShowFilters && '0') 
                }}>
                    <div className="lg:overflow-auto filters-container lg:pr-3 lg:pl-2 lg:top-20 w-full lg:self-start filter-card-mobile">
                        <Filters
                            filters={filters} setFilters={setFilters} 
                            attributes={attributes} 
                            attrChosenLast={attrChosenLast} setAttrChosenLast={setAttrChosenLast}
                            isOpened={isOpened} setIsOpened={setIsOpened} 
                            handleRemoveFilters={handleRemoveFilters}
                            isMobile={isMobile}
                        ></Filters>
                    </div>
                </div>
                <ProductList products={currentProducts} ></ProductList>
            </div>
            <Pagination pagesNumber={products?.length} page={page} setPage={setPage}></Pagination>
        </Layout>
    )
}

export async function getStaticPaths() {
    const paths = await getBrandsSeriesTypePaths()
    return {
      paths,
      fallback: true,
    };
} 

export async function getStaticProps({params}) {
    const { data: headerFooterData } = await axios.get( HEADER_FOOTER_ENDPOINT );
    const seriesData = await getCategoryDataBySlug(params.seriesId)
    if (!seriesData.id) {
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
    const typeSlug = params?.typeId /* + '-' + params.seriesId */
    const typeData = await getCategoryDataBySlug(typeSlug)
    if (!typeData.id) {
        return {
            notFound: true
        }
    }
    const { headers } = await getProductsDataByCategoryId(100, typeData?.id)
    
    async function awaitAll(count, asyncFn) {
        const promises = [];
        for (let i = 1; i <= count; i++) {
            promises.push(asyncFn(100, typeData?.id, i));
        }
        return Promise.all(promises);
    }
    let products = await awaitAll(Number(headers['x-wp-totalpages']), getProductsDataByCategoryId)
    if (!products[0]) {
        return {
            notFound: true
        }
    } 
    products = products?.map(data => {
        return data?.data
    })
    let productsConcated = products?.reduce((acc, value)=> {
        return acc?.concat(value)
    }) 
    
    
    const relatedAttributes = await getRelatedAttributesData(productsConcated)
    return {
        props: {
            headerFooter: headerFooterData?.data ?? {},
            products: productsConcated   ?? {},
            relatedAttributes: relatedAttributes ?? {},
            brandData: brandData ?? {},
        },
        revalidate: 1000
    };
	
}

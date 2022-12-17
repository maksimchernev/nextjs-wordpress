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
import { splitIntoPages } from '../../../../../../src/utils/miscellaneous';
import Pagination from '../../../../../../src/components/products/pagination';
import {isEmpty} from 'lodash'

export default function Type(props) {

    const [products, setProducts] = useState(splitIntoPages(props.products, 30))
    const [page, setPage] = useState(1)
    const [currentProducts, setCurrentProducts] = useState(products[page-1])
    const [filters, setFilters] = useState(props?.relatedAttributes?.filtersObj || {})
    const [attributes, setAttributes] = useState( props?.relatedAttributes?.relatedAttributes || [])
    const [attrChosenLast, setAttrChosenLast] = useState([])
    
    useEffect(()=> {
        let newProducts = props.products
        
        for (const filter in filters ) {
            if (filters[filter].length) {
                let midNewproducts = newProducts.filter(product=> {
                    let condition 
                    for (const attribute of product.attributes) {
                        if (attribute.id == filter ) {
                            for (let attributeTerm of attribute.options) {
                                if(filters[filter].includes(attributeTerm)) {
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
            }

        }
        if (newProducts.length == 0) {
            //когда ниче не нашел
            let newAttributesArray = props.relatedAttributes.relatedAttributes
            for (let attribute of newAttributesArray) {
                for (let term of attribute.terms) {
                    term.isVisible = true
                }
            }
            setProducts(newProducts)
            setCurrentProducts([])
            
        } else {
            const isFiltersEmpty = Object.values(filters).every(value => {
                if (!value.length) {
                  return true;
                }
                return false;
              });
            if (!isFiltersEmpty) {
                let newAttributesArray = props.relatedAttributes.relatedAttributes
                for (let attribute of newAttributesArray) {
                    if(attribute.id != attrChosenLast[attrChosenLast.length-1]) {
                        for (let term of attribute.terms) {
                            term.isVisible = false
                            
                        } 
                    }
                }
                for (let product of newProducts) {
                    for (let productAttribute of product.attributes) {
                        for (let attribute of newAttributesArray) {
                            for (let term of attribute.terms) {
                                if (productAttribute.options.includes(term.name)) {
                                    term.isVisible = true   
                                } 
                            }
                        }
                    }
                }
                setAttributes([...newAttributesArray])
            } else {
                let newAttributesArray = props.relatedAttributes.relatedAttributes
                for (let attribute of newAttributesArray) {
                    for (let term of attribute.terms) {
                        term.isVisible = true
                    }
                }
            }
            
            newProducts = splitIntoPages(newProducts, 30)
            setProducts(newProducts)
            if(isEmpty(newProducts[page-1])) {
                setPage(1)
            }
            setCurrentProducts(newProducts[page-1])
        }
    }, [filters, page])
    
    /* function getWindowWidth() {
        return window.innerWidth;
    }
    const [windowWidth, setWindowWidth] = useState() */
    
    /* useEffect(() => {
          function handleResize() {
            setWindowWidth(getWindowWidth());
            switch (windowWidth) {
                case windowWidth>1280: 
                    setPerPage(30)
                    break
                case windowWidth>1024: 
                    setPerPage(28)
                    break
                case windowWidth>768: 
                    setPerPage(30)
                    break
                default: 
                    setPerPage(30)
                    break
            }
          }
          window.addEventListener('resize', handleResize);
          return () => window.removeEventListener('resize', handleResize);
    }, []); */
   
    const router = useRouter()
    if (router.isFallback) {
        return <h1>Loading...</h1>
    }
    
    const typeId = router.query.typeId
    let h1text 
    if (typeId == 'tracks') {
        h1text = 'Трековые системы'
    } else if (typeId == 'lamps'){
        h1text = 'Светильники'
    }

    return (
        <Layout headerFooter={props.headerFooter} initialHeader={'white'} isBagYellow={true}>
            <BreadCrumb isMain={true}/>
            <Hero h1Content={h1text} isMain={false} image={typeId == 'tracks' ? '/tracks.jpg' : '/lamps.jpg'}/>
            <div className='flex container mx-auto mt-16 relative mb-10 md:mb-20'>
                <Filters filters={filters} setFilters={setFilters} attributes={attributes} attrChosenLast={attrChosenLast} setAttrChosenLast={setAttrChosenLast}></Filters>
                <ProductList products={currentProducts} ></ProductList>
            </div>
            <Pagination pagesNumber={products.length} page={page} setPage={setPage}></Pagination>
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
    const {data: brandData} = await getCategoryDataById(seriesData?.parent)

    const typeSlug = params.typeId + '-' + params.seriesId
    const typeData = await getCategoryDataBySlug(typeSlug)
    const { headers } = await getProductsDataByCategoryId(100, typeData?.id)
    
    async function awaitAll(count, asyncFn) {
        const promises = [];
        for (let i = 1; i <= count; i++) {
            promises.push(asyncFn(100, typeData?.id, i));
        }
        return Promise.all(promises);
    }
    let products = await awaitAll(Number(headers['x-wp-totalpages']), getProductsDataByCategoryId)
    
    products = products.map(data => {
        return data.data
    })
    let productsConcated = products.reduce((acc, value)=> {
        return acc.concat(value)
    }) 
    
    if (!productsConcated[0]?.id) {
        return {
            notFound: true
        }
    } 
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

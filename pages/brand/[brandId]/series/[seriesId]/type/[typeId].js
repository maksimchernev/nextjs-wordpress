import Layout from '../../../../../../src/components/layout';
import { HEADER_FOOTER_ENDPOINT } from '../../../../../../src/utils/constants/endpoints';
import {getProductsDataByCategoryId} from '../../../../../../src/utils/products'
import {getBrandsSeriesTypePaths, getCategoryDataBySlug, getCategoryDataById} from '../../../../../../src/utils/categories'
import axios from 'axios'
import { useRouter } from 'next/router';
import BackButton from '../../../../../../src/components/backBtn';
import Hero from '../../../../../../src/components/hero';
import { getRelatedAttributesData } from '../../../../../../src/utils/attributes';
import ProductList from '../../../../../../src/components/products';
import Filters from '../../../../../../src/components/filters';
import { useState, useEffect } from 'react';
import { splitIntoPages } from '../../../../../../src/utils/miscellaneous';
import Pagination from '../../../../../../src/components/products/pagination';
import { isEmpty } from 'lodash';

export default function Type(props) {
   //console.log'typeProps', props) 
    const [perPage, setPerPage] = useState(30) 
    const [page, setPage] = useState(1)
    const [products, setProducts] = useState(splitIntoPages(props.products, perPage))
    const [currentProducts, setCurrentProducts] = useState(products[page-1])
    const [filters, setFilters] = useState(props?.relatedAttributes?.filtersObj || {})

    useEffect(()=> {
       //console.log'products', products)
    }, [products])
    useEffect(()=> {
        //console.log('iam here')
        let newProducts = props.products
        for (const filter in filters ) {
            if (filters[filter].length) {
                let midNewproducts = newProducts.filter(product=> {
                    let condition 
                    for (const attribute of product.attributes) {
                        if (attribute.id == filter && filters[filter].includes(attribute.options[0])) {
                            condition = true
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
            setCurrentProducts([])
        } else {
            newProducts = splitIntoPages(newProducts, perPage)
           /*  //console.log('newProducts', newProducts)
            //console.log('allProductsArrayLength_AfterFilterChange', newProducts.length)
            //console.log('currentProductsLength_AfterFilterChange', newProducts[page-1].length) */
            setProducts(newProducts)
            setCurrentProducts(newProducts[page-1])
        /*     //console.log('products_AfterFilterChange', products)
            //console.log('currentProducts_AfterFilterChange', currentProducts) */
        }
    }, [filters, perPage])

    useEffect(()=> {
    setCurrentProducts(products[page-1])
    }, [page] )
    
    
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
            <BackButton isMain={true}/>
            <Hero h1Content={h1text} isMain={false} brandData={props.brandData}/>
            <Filters filters={filters} setFilters={setFilters} attributes={props.relatedAttributes.relatedAttributes}></Filters>
            <ProductList products={currentProducts} ></ProductList>
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
    //console.log('typeSlug', typeSlug)
    const { headers } = await getProductsDataByCategoryId(100, typeData?.id)
    
    async function awaitAll(count, asyncFn) {
        const promises = [];
        for (let i = 1; i <= count; i++) {
            promises.push(asyncFn(100, typeData?.id, i));
        }
        return Promise.all(promises);
    }
    //console.log(`Number(headers['x-wp-totalpages'])`, Number(headers['x-wp-totalpages']))
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
    const relatedAttributes = await getRelatedAttributesData(productsConcated?.[0]?.attributes)
    return {
        props: {
            headerFooter: headerFooterData?.data ?? {},
            products: productsConcated   ?? {},
            relatedAttributes: relatedAttributes ?? {},
            brandData: brandData ?? {},
        },
        revalidate: 100
    };
	
}

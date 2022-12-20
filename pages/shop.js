import { getProductsData } from '../src/utils/products';
import Layout from '../src/components/layout';
import { GET_ALL_PRODUCTS_ENDPOINT, GET_ATTRIBUTES_ENDPOINT, GET_PRODUCTS_ENDPOINT, GET_TERMS_ENDPOINT, HEADER_FOOTER_ENDPOINT } from '../src/utils/constants/endpoints';
import axios from 'axios';
import BreadCrumb from '../src/components/breadcrumb';
import { getBrandsSeriesType, getDataForInitialFilters } from '../src/utils/categories';
import { useEffect, useRef, useState } from 'react';
import Filters from '../src/components/filters';
import ProductList from '../src/components/products';
import Pagination from '../src/components/products/pagination';
import { useRouter } from 'next/router';
import { getObjectOfArray, getWindowDimensions, splitIntoPages } from '../src/utils/miscellaneous';
import ChosenFilters from '../src/components/filters/chosen-filters';
import _, { isArray, isEmpty } from 'lodash';
import useDidMountEffect from '../src/hooks/useDidMountEffect';
import Image from 'next/image';


const getRelatedAttributesDataFromAPi = async (products) => {
    let exampleProductAttributes = products[0].attributes
    if (!(exampleProductAttributes.length && isArray(exampleProductAttributes)) ) {
        return ({relatedAttributes: [], filtersObj: {}})
    }
    //фильтрация основных аттрибутов
    exampleProductAttributes = exampleProductAttributes.filter(attr => !(attr.name == 'Тип товара' || attr.name == 'Модельный ряд' || attr.id == 2 || attr.id ==7) )
    //получение данных по всем возможным аттрибутам для получения id
    let {data: attributes} = await axios.get( `${GET_ATTRIBUTES_ENDPOINT}`)
    attributes = attributes.attributes
    //получение всех возможных значений для аттрибутов
    let relatedAttributes = await Promise.all(exampleProductAttributes.map(async prAttr => {
        const attr = attributes.find(attr => prAttr.id == attr.id)
        const { data: attrTerms } = await axios.get( `${GET_TERMS_ENDPOINT}?attrId=${attr.id}`)
        //фильтрация неиспользуемых значений
        let newAttrTerms = attrTerms.terms.filter(term => {
            let found = false
            for (let product of products) {
                for (let attribute of product.attributes) {
                    if (attribute.options.includes(term.name)) {                        
                        found = true
                        break
                    }
                }
                if (found) {
                    break
                }
            }
            return found
        })
        //добавление в массив значения для фильтрации значений аттрибутов
        newAttrTerms.forEach(element => {
            element.isVisible = true
        });     

        attr.terms = newAttrTerms
        return attr
    }))
    let exampleProductDimentions = []
    for (let product of products) {
        for (let productDim in product.dimensions) {
            if (exampleProductDimentions.length) {
                let foundAlready = false
                for (let dim of exampleProductDimentions) {
                    if (dim.name == productDim) {
                        foundAlready = true
                    }
                } 
                if (!foundAlready) {
                    exampleProductDimentions.push({name: productDim})
                }
            } else {
                exampleProductDimentions.push({name: productDim})
            }
            if (exampleProductDimentions.length >2) {
                break
            }
        }
        if (exampleProductDimentions.length >2) {
            break
        }   
    }
    relatedAttributes = relatedAttributes.concat(exampleProductDimentions)
    const filtersObj = getObjectOfArray(relatedAttributes, [])
    filtersObj['length'] = {from: 0, till: 99999999}
    filtersObj['width'] = {from: 0, till: 99999999}
    filtersObj['height'] = {from: 0, till: 99999999}
    return({relatedAttributes, filtersObj})
}


export default function Shop(props) {
    const [initialFilters, setInitialFilters] = useState(props?.initialFiltersData?.filtersObj || {})
    const [filters, setFilters] = useState({})

    const [initialFiltersData, setInitialFiltersData] = useState (props?.initialFiltersData?.relatedAttributes || [])
    const [attributes, setAttributes] = useState([])

    const [attrChosenLast, setAttrChosenLast] = useState([])
    const [allProducts, setAllProducts] = useState([])
    const [currentProducts, setCurrentProducts] = useState(props.products)

    const [initialPage, setInitialPage] = useState(1)
    const [page, setPage] = useState(1)
    const [productsPerPage, setProductsPerPage] = useState(30)

    const [initialPagesNumber, setInitialPagesNumber] = useState(props.pages)
    const [allPagesNumber, setAllPagesNumber] = useState(props.pages)

    const [showAllFilters, setShowAllFilters] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isInitialOpened, setIsInitialOpened] = useState(getObjectOfArray(props?.initialFiltersData?.relatedAttributes, false))
    const [isOpened, setIsOpened] = useState({})

    useEffect(() => {
        let {width} = getWindowDimensions()
        if (width >= 1536) {
            setProductsPerPage(32)
        } 
    }, []);   

    useEffect(() => {
        (async () => {
            //if one ot two changed
            if ((initialFilters.brands.length && !initialFilters.type.length) || (!initialFilters.brands.length && initialFilters.type.length)) {
                setIsLoading(true)
                for (let filter in initialFilters) {
                    if (initialFilters[filter].length) {
                        let query = []
                        for (let term of initialFilters[filter]) {
                            query.push(term)
                        }
                        const { data: productsData } = await axios.get( `${GET_PRODUCTS_ENDPOINT}?category=${query.join(',')}&per_page=${productsPerPage}&page=${initialPage}`);
                        setInitialPagesNumber(productsData.headers['x-wp-totalpages'])
                        setCurrentProducts(productsData?.products || [])
                    }
                }
                setIsLoading(false)
            } else if (initialFilters.brands.length && initialFilters.type.length){
                setIsLoading(true)
                //if both changed
                let namesOfTypes = []
                for (let chosenTypeId of initialFilters.type) {
                    for (let term of initialFiltersData[1].terms) {
                        if (term.id == chosenTypeId) {
                            namesOfTypes.push(term.name)
                        }
                    }
                }
                let categoryIds = []
                for (let chosenBrandId of initialFilters.brands) {
                    for (let term of initialFiltersData[0].terms) {
                        if (term.id == chosenBrandId) {
                            if (namesOfTypes.length) {
                                for (let name of namesOfTypes) {
                                    if (term.hasOwnProperty(name)) {
                                        categoryIds.push(term[name])
                                    }
                                }
                            }
                        }
                    }
                }
                if (categoryIds.length) {
                    async function awaitAll(count) {
                        const promises = [];
                        for (let i = 1; i <= count; i++) {
                          promises.push(axios.get(`${GET_PRODUCTS_ENDPOINT}?category=${categoryIds.join(',')}&per_page=100&page=${i}`));
                        }
                        return Promise.all(promises);
                    }

                    let { data } = await axios.get(`${GET_PRODUCTS_ENDPOINT}?category=${categoryIds.join(',')}&per_page=100&page=1`)
                    let products = await awaitAll(Number(data.headers['x-wp-totalpages']))
                    
                    products?.length ? products = products.map(data => {
                      return data.data.products
                    }) : products = []
                    if (products.length) {
                        products = products.reduce((acc, value)=> {
                            return acc.concat(value)
                        }) 
                    }
                    
                    let {filtersObj: fObj, relatedAttributes: relAttr} = await getRelatedAttributesDataFromAPi(products)
                    setFilters(fObj)
                    setAttributes(relAttr)                  
                    setIsOpened(getObjectOfArray(relAttr, false))
                    setAllProducts(products)
                    products = splitIntoPages(products, productsPerPage)
                    setInitialPagesNumber(products.length)
                    setCurrentProducts(products[0])
                    setAllPagesNumber(products.length)
                    setShowAllFilters(true)
                } else {
                    setShowAllFilters(false)
                }
                setIsLoading(false)

            } else {
                setIsLoading(true)
                const {headers, data: productsData} = await axios.get(`${GET_ALL_PRODUCTS_ENDPOINT}?per_page=${productsPerPage}&page=${initialPage}`)
                setInitialPagesNumber(productsData.headers['x-wp-totalpages'])
                setCurrentProducts(productsData?.products)
                setIsLoading(false)
            }

        })()
    }, [initialFilters, initialPage, productsPerPage])

    useDidMountEffect(()=> {
        let newProducts = [...allProducts]
        setIsLoading(true)
        for (const filter in filters ) {
            //click filters
            if (filters[filter].length && filter != 'length' && filter != 'width' && filter != 'height' ) {
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
            } else if (filter == 'length' || filter == 'width' || filter == 'height') {
                //dimention filters
                let midNewproducts = newProducts.filter(product=> {
                    let condition 
                    for (const dimension in product.dimensions) {
                        if (dimension == filter ) {
                            if(Number(filters[filter].from) <= Number(product.dimensions[dimension]) && Number(filters[filter].till) >= Number(product.dimensions[dimension])) {
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
        if (newProducts.length == 0) {
            //когда ниче не нашел
            let newAttributesArray = [...attributes]
            if (newAttributesArray && isArray(newAttributesArray) && newAttributesArray.length) {
                for (let attribute of newAttributesArray) {
                    if (attribute.hasOwnProperty('terms')){
                        for (let term of attribute.terms) {
                            term.isVisible = true
                        }
                    }
                }
            }
            setCurrentProducts([])
            
        } else {
            const isFiltersEmpty = Object.values(filters).every(value => {
                if (typeof value != 'object') {
                    if (!value.length) {
                        return true;
                    }
                    return false;
                } else {
                    if (value.till != 99999999 && value.from != 0) {
                        return true;
                    }
                    return false;
                }
                });
            if (!isFiltersEmpty) {
                //modify available attributes
                let newAttributesArray = [...attributes]
                if (newAttributesArray && isArray(newAttributesArray) && newAttributesArray.length) {
                    for (let attribute of newAttributesArray) {
                        //не обнуляем последний измененный фильтр
                        if(attribute.id != attrChosenLast[attrChosenLast.length-1]) {
                            if (attribute.hasOwnProperty('terms')){
                                for (let term of attribute.terms) {
                                    term.isVisible = false
                                    
                                } 
                            }
                        }
                    }
                }
                if (newAttributesArray && isArray(newAttributesArray) && newAttributesArray.length) {
                    for (let product of newProducts) {
                        for (let productAttribute of product.attributes) {
                            for (let attribute of newAttributesArray) {
                                if (attribute.hasOwnProperty('terms')){
                                    for (let term of attribute.terms) {
                                        if (productAttribute.options.includes(term.name)) {
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
                let newAttributesArray = props.relatedAttributes.relatedAttributes
                if (newAttributesArray && isArray(newAttributesArray) && newAttributesArray.length) {
                    for (let attribute of newAttributesArray) {
                        if (attribute.hasOwnProperty('terms')){
                            for (let term of attribute.terms) {
                                term.isVisible = true
                            }
                        }
                    }
                }
            }
            newProducts = splitIntoPages(newProducts, productsPerPage)
            setAllPagesNumber(newProducts.length)
            if(isEmpty(newProducts[page-1])) {
                setPage(1)
            }
            setCurrentProducts(newProducts[page-1])
        }
        setIsLoading(false)
    }, [filters, page])


    
    const router = useRouter()
    if (router.isFallback) {
        return <h1>Loading...</h1>
    }  
    const handleRemoveInitialFilters = () => {
        setShowAllFilters((prev)=> !prev)
        const newInitialFilters = 
            Object
                .keys(initialFilters)
                .reduce((result, k) => { 
                return { ...result, [k]: [] };
            }, {})

        setInitialFilters(newInitialFilters)
        setCurrentProducts(props?.products)
        setInitialPagesNumber(props?.pages)
    }
	return (
		<Layout headerFooter={props.headerFooter || {}} initialHeader={'black'} isBagYellow={true}>
			<div className='mt-28 container mx-auto'>
				<BreadCrumb />
                <div className='flex container mx-auto relative mb-10 md:mb-20'>
                <div className="w-1/3 md:w-1/4 xl:w-1/5 flex flex-col flex-wrap pl-2 pr-3 ">
                    <div className="overflow-auto filters-container pr-3 pl-2 top-20 w-full self-start">
                            {!showAllFilters ? 
                                <Filters
                                    filters={initialFilters} setFilters={setInitialFilters} 
                                    attributes={initialFiltersData} 
                                    useIdForFilters={true}
                                    isOpened={isInitialOpened} setIsOpened={setIsInitialOpened} 
                                    isLoading={isLoading}
                                ></Filters>
                                :
                                <ChosenFilters 
                                    filters={initialFilters} setFilters={setInitialFilters} 
                                    attributes={initialFiltersData} 
                                    handleRemoveInitialFilters={handleRemoveInitialFilters}
                                    >
                                    
                                </ChosenFilters>

                            }
 
                            <div style={{
                                opacity: !showAllFilters ? "0" : "1",
                                transition: "all .2s",
                                visibility: !showAllFilters ? "hidden" : "visible",                        
                            }}>
                                <Filters
                                    filters={filters} setFilters={setFilters} 
                                    attributes={attributes} 
                                    attrChosenLast={attrChosenLast} setAttrChosenLast={setAttrChosenLast}
                                    isOpened={isOpened} setIsOpened={setIsOpened} 
                                    isLoading={isLoading}
                                ></Filters>
                            </div>
                        </div>
                    </div>
                    {isLoading ?  
                    <div className='flex justify-center w-2/3 md:w-3/4 h-full'> 
                        <Image width="100" height='100' src="/cart-spinner.gif"  alt="spinner"/> 
                    </div>
                    : 
                    <ProductList products={currentProducts} ></ProductList>                    
                    }
                </div>
                {!showAllFilters ? 
                    <Pagination pagesNumber={initialPagesNumber} page={initialPage} setPage={setInitialPage}></Pagination>
                    : <Pagination pagesNumber={allPagesNumber} page={page} setPage={setPage}></Pagination>
                }
			</div>
		</Layout>
	);
}

export async function getStaticProps() {
	const { data: headerFooterData } = await axios.get( HEADER_FOOTER_ENDPOINT );
	const { headers, data: products } = await getProductsData(30)
    const initialFiltersData = await getDataForInitialFilters()
    const {brandsCats, seriesCats, typeCats} = await getBrandsSeriesType()
	return {
		props: {
			headerFooter: headerFooterData?.data ?? {},
            pages: headers['x-wp-totalpages'] || '',
            products: products || {},
            initialFiltersData: initialFiltersData || {},
            brandsCats: brandsCats || [], 
            seriesCats: seriesCats || [], 
            typeCats:typeCats || []
		},
		revalidate: 10,
	};
}

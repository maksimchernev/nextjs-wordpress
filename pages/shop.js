import { getProductsData } from '../src/utils/products';
import Layout from '../src/components/layout';
import { GET_ALL_PRODUCTS_ENDPOINT, GET_ATTRIBUTES_ENDPOINT, GET_PRODUCTS_ENDPOINT, GET_TERMS_ENDPOINT, HEADER_FOOTER_ENDPOINT } from '../src/utils/constants/endpoints';
import axios from 'axios';
import BreadCrumb from '../src/components/breadcrumb';
import { getDataForInitialFilters } from '../src/utils/categories';
import { useEffect, useState } from 'react';
import Filters from '../src/components/filters';
import ProductList from '../src/components/products';
import Pagination from '../src/components/products/pagination';
import { useRouter } from 'next/router';
import { capitalized, checkEmptyFilters, getObjectOfArray, getWindowDimensions, splitIntoPages } from '../src/utils/miscellaneous';
import ChosenFilters from '../src/components/filters/chosen-filters';
import _, { isArray, isEmpty } from 'lodash';
import useDidMountEffect from '../src/hooks/useDidMountEffect';
import Image from 'next/image';
import { FiltersIcon } from '../src/components/icons';
import ClearFilters from '../src/components/filters/clear-filters';
import Loader from '../src/components/loader';


const getRelatedAttributesDataFromAPi = async (products) => {
    let isAccessory = products[0].categories.find(category => category.name.includes('Сопутствующие') || category.slug.includes('accessory')) ? true : false
    let exampleProductAttributes = products[0].attributes
    if (!(exampleProductAttributes.length && isArray(exampleProductAttributes)) ) {
        return ({relatedAttributes: [], filtersObj: {}})
    }
    //фильтрация основных аттрибутов
    exampleProductAttributes = exampleProductAttributes.filter(attr => !(isAccessory ? capitalized(attr.name) == 'Модельный ряд' || attr.id == 7 : capitalized(attr.name) == 'Тип товара' || capitalized(attr.name) == 'Модельный ряд' || attr.id == 2 || attr.id == 7) )
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
                    if (attribute.options.includes(capitalized(term.name))) {                        
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
const getProductsOfSiblingCategoriesFromApi = async (idsArray, productsPerPage,initialPage, setInitialPagesNumber,setCurrentProducts) => {
    let query = []
    for (let term of idsArray) {
        query.push(term)
    }
    const { data: productsData } = await axios.get( `${GET_PRODUCTS_ENDPOINT}?category=${query.join(',')}&per_page=${productsPerPage}&page=${initialPage}`);
    setInitialPagesNumber(productsData.headers['x-wp-totalpages'])
    setCurrentProducts(productsData?.products || [])
}
export default function Shopm(props) {
    const [initialFilters, setInitialFilters] = useState(props?.initialFiltersData?.filtersObj || {})
    const [filters, setFilters] = useState({})

    const [initialFiltersData, setInitialFiltersData] = useState (props?.initialFiltersData?.relatedAttributes || [])
    const [attributes, setAttributes] = useState([])

    const [attrChosenLast, setAttrChosenLast] = useState([])
    const [initialChosenLast, setInitialChosenLast] = useState([])

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

    const [isShowFilters, setIsShowfilters] = useState(false)
    const [isMobile, setIsMobile] = useState()

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
    useEffect(() => {
        (async () => {
            let numOfChosen =0
            for (let filter in initialFilters) {
                if (initialFilters[filter].length) {
                    numOfChosen+=1
                }
            }
            //filters hiding
            if (numOfChosen > 0) {
                /* if (!initialChosenLast[initialChosenLast.length-1] === 'type') { */

                    let newAttributesArray = [...initialFiltersData]
                    if (newAttributesArray && isArray(newAttributesArray) && newAttributesArray.length) {
                        for (let attribute of newAttributesArray) {
                            if(attribute.id != initialChosenLast[initialChosenLast.length-1] ) {
                                if (attribute.hasOwnProperty('terms')){
                                    for (let term of attribute.terms) {
                                        term.isVisible = false
                                    } 
                                }
                            }
                        }
                    }
                    if (initialChosenLast[initialChosenLast.length-1] == 'series') {
                        let brandsAvailable = []
                        let typesAvailable = []
                        //1 -series
                        for (let seriesId of initialFilters['series']) {
                            if (newAttributesArray[1].hasOwnProperty('terms')){
                                for (let termSeries of newAttributesArray[1].terms) {
                                    if (seriesId === termSeries.id) {
                                        if (!brandsAvailable.includes(termSeries.brand)) {
                                            brandsAvailable.push(termSeries.brand)
                                        }
                                        for (let type of termSeries.types) {
                                            if (!typesAvailable.includes(type)) {
                                                typesAvailable.push(type)
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        if (brandsAvailable.length) {
                            for (let brand of brandsAvailable) {
                                for (let termBrand of newAttributesArray[0].terms) { 
                                    if (termBrand.id == brand) {
                                        termBrand.isVisible = true
                                    }
                                }
                            }
                        }
                        if (typesAvailable.length) {
                            for (let type of typesAvailable) {
                                for (let termType of newAttributesArray[2].terms) { 
                                    if (termType.id == type) {
                                        termType.isVisible = true
                                    }
                                }
                            }
                        }
                    } else if (initialChosenLast[initialChosenLast.length-1] == 'brands') {
                        let typesAvailable = []
                        if (newAttributesArray[1].hasOwnProperty('terms')){
                            for (let termSeries of newAttributesArray[1].terms) {
                                if (initialFilters['brands'].includes(termSeries.brand)) {
                                    termSeries.isVisible = true
                                    for (let relTypeId of termSeries.types) {
                                        if (!typesAvailable.includes(relTypeId)){
                                            typesAvailable.push(relTypeId)
                                        }
                                    }
                                }
                            }
                        }
                        if (typesAvailable.length) {
                            for (let type of typesAvailable) {
                                for (let termType of newAttributesArray[2].terms) { 
                                    if (termType.id == type) {
                                        termType.isVisible = true
                                    }
                                }
                            }
                        }
                        
                    } else if (initialChosenLast[initialChosenLast.length-1] == 'type') {
                        let brandsAvailable = []
                        
                        if (newAttributesArray[1].hasOwnProperty('terms')){
                            for (let termSeries of newAttributesArray[1].terms) {
                                for (let relTypeId of termSeries.types) {
                                    if (initialFilters['type'].includes(relTypeId)) {
                                        termSeries.isVisible = true
                                        if (!brandsAvailable.includes(termSeries.brand)) {
                                            
                                            brandsAvailable.push(termSeries.brand)
                                        }
                                    }
                                }
                            }
                        }
                        if (brandsAvailable.length) {
                            for (let brand of brandsAvailable) {
                                for (let termBrand of newAttributesArray[0].terms) { 
                                    if (termBrand.id == brand) {
                                        termBrand.isVisible = true
                                    }
                                }
                            }
                        }
                    }
                    setInitialFiltersData([...newAttributesArray])
                /* } */
            } else {
                let newAttributesArray = [...initialFiltersData]
                if (newAttributesArray && isArray(newAttributesArray) && newAttributesArray.length) {
                    for (let attribute of newAttributesArray) {
                        if (attribute.hasOwnProperty('terms')){
                            for (let term of attribute.terms) {
                                term.isVisible = true
                            } 
                        }
                    }
                }
                setInitialFiltersData([...newAttributesArray])
            }
            //filters hiding
            if (numOfChosen==3 || (initialFilters.series.length && initialFilters.type.length)){
                setIsLoading(true)
                //if all changed
                let namesOfTypes = []
                for (let chosenTypeId of initialFilters.type) {
                    
                    for (let term of initialFiltersData[2].terms) {
                        if (term.id == chosenTypeId) {
                            namesOfTypes.push(term.name)
                        }
                    }
                }
                let categoryIds = []
                for (let chosenSeriesId of initialFilters.series) {
                    for (let term of initialFiltersData[1].terms) {
                        if (term.id == chosenSeriesId) {
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
                    setCurrentProducts(products?.[0] || [])
                    setAllPagesNumber(products.length)
                    setShowAllFilters(true)
                } else {
                    setCurrentProducts([])
                    setAllPagesNumber(0)
                    setInitialPagesNumber(0)
                    setShowAllFilters(false)
                }
                setIsLoading(false)

            } else if (numOfChosen == 2) {
                //if some changed
                
                setIsLoading(true)
                if (initialFilters.brands.length && initialFilters.series.length && !initialFilters.type.length) {
                    await getProductsOfSiblingCategoriesFromApi(initialFilters.series, productsPerPage, initialPage, setInitialPagesNumber, setCurrentProducts)
                } else if (initialFilters.brands.length && !initialFilters.series.length && initialFilters.type.length) {
                    let nameOfType
                    for (let chosenTypeId of initialFilters.type) {
                        for (let term of initialFiltersData[2].terms) {
                            if (term.id == chosenTypeId) {
                                nameOfType = term.name
                                break
                            }
                        }
                        if (nameOfType) {
                            break
                        }
                    }
                    let categoryIds = []
                    if (initialFiltersData[1]?.terms?.length) {
                        for (let term of initialFiltersData[1].terms) {
                            if (term.hasOwnProperty(nameOfType)) {
                                for (let brand of initialFilters.brands) {
                                    if (brand === term.brand && !categoryIds.includes(term[nameOfType])) {
                                        categoryIds.push(term[nameOfType])
                                    }
                                }
                                
                            }
                        }
                    }
                    await getProductsOfSiblingCategoriesFromApi(categoryIds, productsPerPage, initialPage, setInitialPagesNumber, setCurrentProducts)
                }
                setIsLoading(false)
            } else if (numOfChosen==1) {
                setIsLoading(true)
                for (let filter in initialFilters) {
                    if (initialFilters[filter].length) {
                        await getProductsOfSiblingCategoriesFromApi(initialFilters[filter], productsPerPage, initialPage, setInitialPagesNumber, setCurrentProducts)
                    }
                }
                setIsLoading(false)
            } else {
                //if none
                setIsLoading(true)
                const {data: productsData} = await axios.get(`${GET_ALL_PRODUCTS_ENDPOINT}?per_page=${productsPerPage}&page=${initialPage}`)
                setInitialPagesNumber(productsData.headers['x-wp-totalpages'])
                setCurrentProducts(productsData?.products || [])
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
            const isFiltersEmpty = checkEmptyFilters(filters) 
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
        return <Loader/>
    }  
    const handleRemoveInitialFilters = () => {
        const isInitialFiltersEmpty = checkEmptyFilters(initialFilters)
        const isFiltersEmpty = checkEmptyFilters(filters)
        if (!isInitialFiltersEmpty || !isFiltersEmpty) {
            setShowAllFilters(false)
            const newInitialFilters = 
                Object
                    .keys(initialFilters)
                    .reduce((result, k) => { 
                    return { ...result, [k]: [] };
                }, {})
            if(isMobile) {
                const newIsOpened = 
                    Object
                        .keys(isOpened)
                        .reduce((result, k) => { 
                        return { ...result, [k]: false };
                    }, {})
                setIsOpened(newIsOpened)
                const newIsInitialOpened = 
                    Object
                        .keys(isInitialOpened)
                        .reduce((result, k) => { 
                        return { ...result, [k]: false };
                    }, {})
                setIsInitialOpened(newIsInitialOpened)
            }
            setInitialFilters(newInitialFilters)
            setCurrentProducts(props?.products)
            setInitialPagesNumber(props?.pages)
        }
    }
    

	return (
		<Layout headerFooter={props.headerFooter || {}} initialHeader={'black'} isBagYellow={false}>
			<div className='mt-28 container mx-auto'>
				<BreadCrumb />
                <div className='flex flex-col lg:flex-row mx-auto relative mb-10 md:mb-20'>

                    <button
                        onClick={ () => setIsShowfilters( ! isShowFilters ) }
                        className="flex lg:hidden  items-center w-8 h-8 rounded bg-brand-gray78 justify-center mx-4 hover:bg-brand-gray99 mb-4">
                        {<FiltersIcon className="fill-current h-4 w-3 text-brand-yellow"/>}
                    </button>
                    <div className={`${isShowFilters ? `px-4` : `px-2 lg:flex`} w-full lg:w-1/4 xl:w-1/5  flex-col flex-wrap lg:pl-2 lg:pr-3`} style={{
                        opacity: isShowFilters || !isMobile ? "1" : "0",
                        transition: isShowFilters ? "all .1s" : 'all 0s',
                        visibility: isShowFilters || !isMobile ? "visible" : "hidden",  
                        height: isMobile && (!isShowFilters && '0')
                    }}>
                        <div className="lg:overflow-auto filters-container lg:pr-3 lg:pl-2 lg:top-20 w-full lg:self-start filter-card-mobile">
                            {!isMobile && <ClearFilters handleRemoveFilters={handleRemoveInitialFilters} isLoading={isLoading}/>}
                            {!showAllFilters ? 
                               
                                <Filters
                                    filters={initialFilters} setFilters={setInitialFilters} 
                                    attributes={initialFiltersData} 
                                    useIdForFilters={true}
                                    isOpened={isInitialOpened} setIsOpened={setIsInitialOpened} 
                                    isLoading={isLoading}
                                    attrChosenLast={initialChosenLast} setAttrChosenLast={setInitialChosenLast}
                                ></Filters>
                                :
                                <ChosenFilters 
                                    filters={initialFilters} setFilters={setInitialFilters} 
                                    attributes={initialFiltersData} 
                                    >
                                    
                                </ChosenFilters>

                            }
 
                            <div style={{
                                opacity: !showAllFilters ? "0" : "1",
                                transition: "all .2s",
                                visibility: !showAllFilters ? "hidden" : "visible",   
                                height: !showAllFilters && '0'                  
                            }}>
                                <Filters
                                    filters={filters} setFilters={setFilters} 
                                    attributes={attributes} 
                                    attrChosenLast={attrChosenLast} setAttrChosenLast={setAttrChosenLast}
                                    isOpened={isOpened} setIsOpened={setIsOpened} 
                                    isLoading={isLoading}
                                ></Filters>
                            </div>
                            {isMobile && <ClearFilters handleRemoveFilters={handleRemoveInitialFilters} isLoading={isLoading}/>}

                        </div>
                    </div>
                    {isLoading ?  
                    <div className='flex justify-center w-full lg:w-3/4 xl:w-4/5 h-full mt-4'> 
                        <Image width="100" height='100' src="/loader.gif"  alt="spinner"/> 
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
	return {
		props: {
			headerFooter: headerFooterData?.data ?? {},
            pages: headers['x-wp-totalpages'] || '',
            products: products || {},
            initialFiltersData: initialFiltersData || {}
		},
		revalidate: 10,
	};
}

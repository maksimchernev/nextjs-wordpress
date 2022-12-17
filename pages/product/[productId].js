import axios from "axios";
import BreadCrumb from "../../src/components/breadcrumb";
import Image from "../../src/components/image";
import Layout from "../../src/components/layout";
import { HEADER_FOOTER_ENDPOINT } from "../../src/utils/constants/endpoints";
import { sanitizeTags } from "../../src/utils/miscellaneous";
import { getAllProductsPaths, getProductData, getProductsDataByCategoryId } from "../../src/utils/products";
import { useRouter } from "next/router";
import AddToCart from "../../src/components/cart/add-to-cart";
import { useState, useEffect } from "react";
import ProductSlider from "../../src/components/products/slider";
import { getCategoryDataById, getSubCategoriesById } from "../../src/utils/categories";
import { isArray } from "lodash";
import { roundToTwo } from "../../src/utils/miscellaneous";

function getWindowDimensions() {
    const { innerWidth: width } = window;
    return width
  }
  
const ProductPage = (props) => {
    const [windowDimensions, setWindowDimensions] = useState();
    const [showProducts, setShowProducts] = useState()
    const [currentImgIndex, setCurrentImgIndex] = useState(props.product?.images?.[0]?.id)
    useEffect(() => {
        
            let width = getWindowDimensions()
            if (width > 1536) {
                setShowProducts(4)
            } else if (width > 1280) {
                setShowProducts(3)
            } else if (width > 600) {
                setShowProducts(2)
            } else {
                setShowProducts(1)
            }
            setWindowDimensions(getWindowDimensions());
 
      }, [windowDimensions]);
    useEffect(()=> {
        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }      
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [])
    const router = useRouter()
    if (router.isFallback) {
        return <h1>Loading...</h1>
    }
    let imgs = props.product?.images ?? [];
    let img = imgs.length ? imgs.find(img =>img.id == currentImgIndex) : null
    const handleClickOnImage = (id) => {
        setCurrentImgIndex(id)
        imgs = imgs.length ? imgs.filter(img => img.id !== currentImgIndex) : []
    }
     
    
    return (
        <Layout headerFooter={props.headerFooter} initialHeader={'black'} isBagYellow={true} bgProduct={true} metaData={props?.product?.metaData ?? []}> 
            <BreadCrumb isMain={false} bgProduct={true}/>
            <div className="container mx-auto">
                <h1 className="text-center text-42px">{props.product?.name}</h1>
            </div>
            <div className="flex flex-wrap container mx-auto my-16 justify-center">
                <div className="md:w-1/2 px-2 flex flex-col-reverse  flex-wrap sm:flex-row  sm:flex-nowrap sm:justify-center">
                    <div className="flex items-stretch sm:flex-col mt-3 sm:mt-0">
                        {imgs.length ? imgs.map(img => {
                            if (img.id != currentImgIndex) {
                                return (
                                    <a className="cursor-pointer mb-3 mr-7 duration-250 ease-in" key={img.id} onClick={()=> handleClickOnImage(img.id)}>
                                        <Image
                                            sourceUrl={ img?.src ?? '' }
                                            altText={img?.alt || props.product?.name}
                                            title={ props.product?.name ?? '' }
                                            layout='fill'
                                            containerClassNames={`border border-brand-gray78 product-image-preview`}
                                        />
                                    </a>
                                )
                            }
                        }) : null}
                    </div>
                    <div className="duration-250 ease-in">
                        <Image
                            sourceUrl={ img?.src ?? '' }
                            altText={img?.alt || props.product?.name}
                            title={ props.product?.name ?? '' }
                            layout='fill'
                            containerClassNames={`border border-brand-grayCF w-80 h-80 sm:w-96 sm:w-96 md:w-64 md:h-64 lg:w-96 lg:h-96`}
                        />
                    </div>
                </div>

                <div className="w-full md:w-1/2 px-2 leading-6 mt-5 md:mt-0">
                    <p className="mb-5"><span className="font-sf-pro-display-light text-20px">Артикул: </span><span className="font-sf-pro-display-medium">{sanitizeTags(props.product?.sku)} </span></p>
                    <p className="flex flex-col mb-5"><span>Цена:</span><span className="text-5xl font-sf-pro-display-bold"> {roundToTwo(sanitizeTags(props.product?.price))}₽</span></p>
                    <p className="mb-5 font-sf-pro-display-light text-20px leading-7" ><span > {sanitizeTags(props.product?.description)}</span></p>
                    <div className="mb-5">
                        {/* {props.product?.attributes?.length ? props.product?.attributes?.map(attr => {
                            return (
                                    <p key={attr.id} className='font-sf-pro-display-light text-20px leading-7'><span>{sanitizeTags(attr.name)}</span>: 
                                        {attr.options.length ? attr.options.map((option, index) => {
                                            return (
                                                <span key={index} className='ml-1'>{sanitizeTags(option)}</span>
                                            )
                                        }): null
                                        }
                                    </p>
                                    
                                    
                                )
                            }) : null
                        } */}
                    </div>
                    <div>
                        <AddToCart product={props.product}/>
                    </div>
                </div>
            </div>
            { props.supportingProducts && isArray(props.supportingProducts) && props?.supportingProducts?.length && showProducts ? 
                <div className="mb-12">
                    <h2 className="flex justify-center text-40px my-3 ">Сопутствующие товары</h2>
                    <ProductSlider products={props.supportingProducts} show={showProducts}></ProductSlider>
                </div>
                : null
            }
            { props.accessories && isArray(props.accessories) && props?.accessories?.length && showProducts?
                <div className="mb-12">
                    <h2 className="flex justify-center text-40px my-3 px-2">Аксессуары</h2>
                    <ProductSlider products={props.accessories} show={showProducts}></ProductSlider>
                </div>
                : null
            }
        </Layout>
    )
}

export async function getStaticPaths() {
    const paths = await getAllProductsPaths()
    return {
      paths,
      fallback: true,
    };
} 

export async function getStaticProps({params}) {
    const { data: headerFooterData } = await axios.get( HEADER_FOOTER_ENDPOINT );
    const {data: product} = await getProductData(params.productId)
    if (!product[0]?.id) {
        return {
          notFound: true
        }
    }
    async function awaitAll(parentCategories) {
        const promises = [];
        for (let category of parentCategories) {
            promises.push(getCategoryDataById(category.id));
        }
        return Promise.all(promises);
    }
    let parentCategories = await awaitAll(product[0].categories)

    parentCategories = parentCategories.map(data => {
        return data.data
    })
    let seriesId = parentCategories.find(category => category.parent != 0 && (category.name == 'Шинопроводы' || category.name == 'Светильники' || category.name == 'Сопутствующие'))
    
    
    let accessoriesCatId,
        typeCategories
    if (seriesId)  {
        typeCategories = await getSubCategoriesById(seriesId.parent)
        accessoriesCatId = typeCategories.find(cat => cat.name.includes('Сопутствующие'))
    }
    

    let accessories
    if (accessoriesCatId) {
        accessoriesCatId = accessoriesCatId.id
        let {data} = await getProductsDataByCategoryId(15, accessoriesCatId, 1)
        accessories = data
    } 

    let addsCatId
    let add = product[0].attributes.find(attr => attr.name == 'Тип товара')
    if (add && typeCategories) {
        add.options.includes('Светильник') ? add = 'Шинопроводы' : add = 'Светильники'
        addsCatId = typeCategories.find(cat => cat.name.includes(add))
        
    }
    let supportingProducts
    if (addsCatId) {
        addsCatId = addsCatId.id
        const {data} = await getProductsDataByCategoryId(15, addsCatId, 1) 
        supportingProducts = data
    } 

    
    return {
		props: {
			headerFooter: headerFooterData?.data ?? {},
            product: product[0] ?? [],
            accessories: accessories ?? [],
            supportingProducts: supportingProducts ?? []
		},
        revalidate: 10
	};
}
export default ProductPage
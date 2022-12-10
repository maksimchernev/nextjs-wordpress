import axios from "axios";
import BackButton from "../../src/components/backBtn";
import Image from "../../src/components/image";
import Layout from "../../src/components/layout";
import { HEADER_FOOTER_ENDPOINT } from "../../src/utils/constants/endpoints";
import { sanitize, sanitizeTags } from "../../src/utils/miscellaneous";
import { getAllProductsPaths, getProductData, getProductsDataByCategoryId } from "../../src/utils/products";
import { useRouter } from "next/router";
import AddToCart from "../../src/components/cart/add-to-cart";
import { useState, useEffect } from "react";
import ProductSlider from "../../src/components/products/slider";
import { getCategoryDataById, getSubCategoriesById } from "../../src/utils/categories";
import { isArray } from "lodash";

function getWindowDimensions() {
    const { innerWidth: width } = window;
    return width
  }
  
const ProductPage = (props) => {
    const [windowDimensions, setWindowDimensions] = useState();
    const [showProducts, setShowProducts] = useState()
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
    useEffect(()=> {
        console.log(windowDimensions)
        console.log(showProducts)
    }, [showProducts])
    const router = useRouter()
    if (router.isFallback) {
        return <h1>Loading...</h1>
    }
    
    const img = props.product?.images?.[0] ?? {};
    return (
        <Layout headerFooter={props.headerFooter} initialHeader={'black'} isBagYellow={true} bgProduct={true}> 
            <BackButton isMain={false} bgProduct={true}/>
            <div className="container mx-auto">
                <h1 className="text-center text-42px">{props.product?.name}</h1>
            </div>
            <div className="flex flex-wrap container mx-auto my-16">
                <div className="w-full md:w-1/2 px-2 ">
                    <Image
                        sourceUrl={ img?.src ?? '' }
                        altText={img?.alt ?? ''}
                        title={ props.product?.name ?? '' }
                        width='480'
                        height='480'
                    />
                </div>
                <div className="w-full md:w-1/2 px-2 leading-6 mt-5 md:mt-0">
                    <p className="mb-5"><span className="font-sf-pro-display-light text-20px">Артикул: </span><span className="font-sf-pro-display-medium">{sanitizeTags(props.product?.sku)} </span></p>
                    <p className="flex flex-col mb-5"><span>Цена:</span><span className="text-5xl font-sf-pro-display-bold"> {sanitizeTags(props.product?.price)}₽</span></p>
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
            { props.accessories && isArray(props.accessories) && props?.accessories?.length && showProducts?
                <div className="mb-12">
                    <h2 className="flex justify-center text-40px my-3">Аксессуары</h2>
                    <ProductSlider products={props.accessories} show={showProducts}></ProductSlider>
                </div>
                : null
            }
            { props.supportingProducts && isArray(props.supportingProducts) && props?.supportingProducts?.length && showProducts ? 
                <div className="mb-12">
                    <h2 className="flex justify-center text-40px my-3">Сопутствующие товары</h2>
                    <ProductSlider products={props.supportingProducts} show={showProducts}></ProductSlider>
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
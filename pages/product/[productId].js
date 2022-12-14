import axios from "axios";
import BreadCrumb from "../../src/components/breadcrumb";
import Image from "../../src/components/image";
import Layout from "../../src/components/layout";
import { HEADER_FOOTER_ENDPOINT } from "../../src/utils/constants/endpoints";
import { getArrayOfObject, getWindowDimensions, sanitizeTags } from "../../src/utils/miscellaneous";
import { getAllProductsPaths, getProductData, getProductsDataByCategoryId } from "../../src/utils/products";
import { useRouter } from "next/router";
import AddToCart from "../../src/components/cart/add-to-cart";
import { useState, useEffect, useCallback } from "react";
import ProductSlider from "../../src/components/products/slider";
import { getCategoryDataById, getLinkToSubCatalog, getSubCategoriesById } from "../../src/utils/categories";
import { isArray } from "lodash";
import { roundToTwo } from "../../src/utils/miscellaneous";
import Loader from "../../src/components/loader";


  
const ProductPage = (props) => {
    const [windowDimensions, setWindowDimensions] = useState();
    const [showProducts, setShowProducts] = useState()
    const [currentImg, setCurrentImg] = useState()
    const router = useRouter()
    useEffect(()=> {
        window.scrollTo(0, 0)
    }, [router.pathname])
    useEffect(() => {
            let {width} = getWindowDimensions()
            if (width > 1536) {
                setShowProducts(5)
            } else if (width > 1280) {
                setShowProducts(4)
            } else if (width > 1024){
                setShowProducts(3)
            } else if (width > 640) {
                setShowProducts(2)
            } else if (width > 400) {
                setShowProducts(3)
            } else {
                setShowProducts(2)
            }

            setWindowDimensions(width);
 
      }, [windowDimensions]);
    useEffect(()=> {
        function handleResize() {
            let {width} = getWindowDimensions()
            setWindowDimensions(width);
        }      
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [])
   
    const handleClickOnImage = useCallback((id) => {
        setCurrentImg(props.product?.images.find(img => img.id == id))
    }, [props.product?.images])

    if (router.isFallback) {
        return <Loader/>
    }
     
    const dimensions = getArrayOfObject(props.product.dimensions)
    return (
        <Layout headerFooter={props.headerFooter} 
            initialHeader={'black'} 
            isBagYellow={true} 
            metaData={props?.product?.metaData ?? []} 
            title={props?.product?.name}
            > 
            <BreadCrumb isAbs={false} />
            <div className="container mx-auto">
                <h1 className="text-center text-32px sm:text-40px">{sanitizeTags(props.product?.name)}</h1>
            </div>
            <div className="flex flex-wrap container mx-auto my-8 md:my-16 justify-center ">
                <div className="flex flex-col-reverse md:w-1/2 md:justify-end lg:flex-row xl:pr-10">
                    <div className="flex flex-wrap lg:flex-col lg:h-96 lg:flex-wrap-reverse">
                        {props.product?.images?.length ? props.product?.images.map(img => {
                            return (
                                <a className="cursor-pointer duration-250 ease-in m-1" key={img.id} onClick={()=> handleClickOnImage(img.id)}>
                                    <Image
                                        sourceUrl={ img?.src ?? '' }
                                        altText={img?.alt || props.product?.name}
                                        title={ props.product?.name ?? '' }
                                        layout='fill'
                                        containerClassNames={`${img.id === currentImg?.id ? 'border-brand-gray78 product-card-image-preview-shadow' : 'border-brand-grayCF'} border product-image-preview`}
                                    />
                                </a>
                            )
                        }) : null}
                    </div>
                    <div className="duration-250 ease-in mb-2 sm:mb-0 p-1 flex sm:justify-center md:justify-start">
                        <Image
                            sourceUrl={!currentImg ? props.product.images?.[0]?.src : currentImg.src }
                            altText={currentImg?.src.alt || props.product?.name}
                            title={ props.product?.name ?? '' }
                            layout='fill'
                            containerClassNames={`border border-brand-grayCF w-80 h-80 sm:w-96 sm:w-96 md:w-80 md:h-80 xl:w-96 xl:h-96`}
                        />
                    </div>
                </div>

                <div className="w-full md:w-1/2 px-2 leading-6 mt-5 md:mt-0">
                    <p className="mb-5"><span className="font-sf-pro-display-light text-20px">??????????????: </span><span className="font-sf-pro-display-medium ">{sanitizeTags(props.product?.sku)} </span></p>
                    <p className="flex flex-col"><span>????????:</span><span className="text-5xl font-sf-pro-display-bold"> {roundToTwo(props.product?.price)}???</span></p>
                    <p className="font-sf-pro-display-light">{sanitizeTags(props.product?.purchase_note)}</p>
                    <p className="my-5 font-sf-pro-display-light text-20px leading-7" ><span > {sanitizeTags(props.product?.description)}</span></p>
                    <div className="mb-5">
                        {props.product?.attributes?.length ? props.product?.attributes?.map(attr => {
                            return (
                                    <p key={attr.id} className='font-sf-pro-display-light text-20px leading-7'><span>{sanitizeTags(attr.name+':')}</span> 
                                        {attr.options.length ? attr.options.map((option, index) => {
                                            return (
                                                <span key={index} className='ml-1'>{sanitizeTags(option)}</span>
                                            )
                                        }): null
                                        }
                                    </p>
                                )
                            }) : null
                        }
                    </div>
                    <div className="mb-5">
                        {dimensions?.length ? dimensions.map(dimension => {
                            if (dimension.value) { 
                                let dimensionName 
                                switch (dimension.name) {
                                    case 'length' :
                                        dimensionName = '??????????'
                                        break
                                    case 'width' :
                                        dimensionName = '????????????'
                                        break
                                    case 'height' :
                                        dimensionName = '????????????'
                                        break
                                }
                                return (
                                    <p key={dimension.name} className='font-sf-pro-display-light text-20px leading-7'><span >{sanitizeTags(dimensionName+':')}</span>
                                        <span className='ml-1'>{sanitizeTags(dimension.value+' mm')}</span>
                                    </p>
                                )
                            }
                        }) : null
                        }
                    </div>
                    <div>
                        <AddToCart product={props.product}/>
                    </div>
                </div>
            </div>
            { props.supportingProducts && isArray(props.supportingProducts) && props?.supportingProducts?.length && showProducts ? 
                <div className="mb-12 flex flex-col items-center">
                    <h2 className="flex justify-center text-36px my-3 px-2">?????????????????????????? ????????????</h2>
                    <ProductSlider products={props.supportingProducts} show={showProducts}></ProductSlider>
                    <a href={props.addsLink} target="_blank" rel="noreferrer" className="button-form-black flex w-fit justify-center mt-5 md:mt-10">?????????????? ?? ??????????????????????????</a>
                </div>
                : null
            }
            { props.accessories && isArray(props.accessories) && props?.accessories?.length && showProducts?
                <div className="mb-12 flex flex-col items-center">
                    <h2 className="flex justify-center text-36px my-3 px-2">????????????????????</h2>
                    <ProductSlider products={props.accessories} show={showProducts}></ProductSlider>
                    <a href={props.accessoriesLink} target="_blank" rel="noreferrer" className="button-form-black flex w-fit justify-center mt-5 md:mt-10">?????????????? ?? ??????????????????????</a>
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
    let seriesId = parentCategories.find(category => category.parent != 0 && (category.name == '??????????????????????' || category.name == '??????????????????????' || category.name == '??????????????????????????'))
    
    
    let accessoriesCatId,
        typeCategories
    if (seriesId)  {
        typeCategories = await getSubCategoriesById(seriesId.parent)
        accessoriesCatId = typeCategories.find(cat => cat.name.includes('??????????????????????????'))
    }
    
    let accessories
    if (accessoriesCatId) {
        accessoriesCatId = accessoriesCatId.id
        let {data} = await getProductsDataByCategoryId(15, accessoriesCatId, 1)
        accessories = data
    } 

    let addsCatId
    let add = product[0].attributes.find(attr => attr.name == '?????? ????????????')
    if (add && typeCategories) {
        add.options.includes('????????????????????') ? add = '??????????????????????' : add = '??????????????????????'
        addsCatId = typeCategories.find(cat => cat.name.includes(add))
        
    }
    let supportingProducts
    if (addsCatId) {
        addsCatId = addsCatId.id
        const {data} = await getProductsDataByCategoryId(15, addsCatId, 1) 
        supportingProducts = data
    } 
    const addsLink = await getLinkToSubCatalog(addsCatId)
    const accessoriesLink = await getLinkToSubCatalog(accessoriesCatId)

    
    return {
		props: {
			headerFooter: headerFooterData?.data ?? {},
            product: product[0] ?? [],
            accessories: accessories ?? [],
            supportingProducts: supportingProducts ?? [],
            addsLink: addsLink ?? '',
            accessoriesLink: accessoriesLink ?? '',
            add: add ?? ''
		},
        revalidate: 10
	};
}
export default ProductPage
import axios from "axios";
import BackButton from "../../src/components/backBtn";
import Image from "../../src/components/image";
import Layout from "../../src/components/layout";
import { HEADER_FOOTER_ENDPOINT } from "../../src/utils/constants/endpoints";
import { sanitize, sanitizeTags } from "../../src/utils/miscellaneous";
import { getAllProductsPaths, getProductData } from "../../src/utils/products";
import { useRouter } from "next/router";
import AddToCart from "../../src/components/cart/add-to-cart";
import { useState, useEffect } from "react";
const Product = (props) => {
    ////console.log('productProps', props)
    const [isMounted, setIsMounted] = useState(false)
    useEffect(()=> {
        setIsMounted(true)
    }, [])
    const router = useRouter()
    if (router.isFallback) {
        return <h1>Loading...</h1>
    }
    
    const img = props.product?.images?.[0] ?? {};
    return (
        <Layout headerFooter={props.headerFooter} initialHeader={'black'} isBagYellow={true} bgProduct={true}> 
            <BackButton isMain={false} bgProduct={true}/>
            <div className="container mx-auto">
                <h1 className="text-center font-bold text-3xl">{props.product?.name}</h1>
            </div>
            <div className="flex flex-wrap container mx-auto my-16">
                <div className="w-1/2">
                    <Image
                        sourceUrl={ img?.src ?? '' }
                        altText={img?.alt ?? ''}
                        title={ props.product?.name ?? '' }
                        width='480'
                        height='480'
                    />
                </div>
                <div className="w-1/2 product-info leading-6">
                    <p className="mb-5"><span className="font-light text-base">Артикул: </span><span>{sanitizeTags(props.product?.sku)} </span></p>
                    <p className="flex flex-col mb-5"><span>Цена:</span><span className="text-5xl font-bold"> {sanitizeTags(props.product?.price)}</span></p>
                    <p className="mb-5"><span > {sanitizeTags(props.product?.description)}</span></p>
                    <div className="mb-5">
                        {props.product?.attributes?.length ? props.product?.attributes?.map(attr => {
                            return (
                                    <p key={attr.id} className='font-light text-base '><span>{sanitizeTags(attr.name)}</span>: <span>{sanitizeTags(attr.options[0])}</span></p>
                                )
                            }) : null
                        }
                    </div>
                    <div>
                        <AddToCart product={props.product}/>
                    </div>
                </div>
            </div>
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
    ////console.log(params.productId)
    const {data: product} = await getProductData(params.productId)
    if (!product[0]?.id) {
        return {
          notFound: true
        }
    }
    return {
		props: {
			headerFooter: headerFooterData?.data ?? {},
            product: product[0] ?? {}
		},
        revalidate: 1
	};
}
export default Product
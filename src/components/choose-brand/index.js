import { isArray, isEmpty } from "lodash"
import Link from "next/link"
import Image from "../image"

const ChooseBrand = ({brands}) => {
    if ( isEmpty(brands) || !isArray(brands)) {
        return null
    }
    return (
        <div id="brands" className="my-7 sm:my-14 md:my-28">
            <div className="flex justify-content flex-wrap py-3 container mx-auto px-2" >
                <div className="w-full pr-12">
                    <h2>
                    Каталог
                    </h2>
                </div>
                {/* w-full mt-7 xl:mt-14 flex flex-wrap justify-center sm:justify-between choose-brand-card */}
                {/* flex align-center justify-center sm:w-1/2 md:w-1/3 xl:w-1/4 w-full */}
                {/* flex justify-center items-center card mb-4 py-4 px-5 hover:bg-brand-grayCF duration-100 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 justify-items-center lg:mt-7 w-full">
                    { brands.length ? brands.map( brand => {
                        const img = brand?.image ?? {}
                            return (
                                <div className="w-full" key={brand.id}> 
                                    <Link 
                                        
                                        href={{
                                            pathname: '/brand/[brandId]',
                                            query: { brandId: brand?.slug },
                                            
                                        }}>
                                        <a className="flex justify-center items-center card py-4 px-5 hover:bg-brand-grayCF duration-100 ">
                                            <Image 
                                                sourceUrl={img?.src ?? ''}
                                                altText={img?.alt || brand?.name}
                                                title={brand?.name ?? ''}
                                                width={'250px'}
                                                height={'50px'}
                                            />
                                        </a>
                                    </Link>
                                </div>
                            )
                    } ) : null }
                </div>
            </div>
        </div>
    )
}

export default ChooseBrand
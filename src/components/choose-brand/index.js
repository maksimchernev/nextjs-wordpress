import { isArray, isEmpty } from "lodash"
import Link from "next/link"
import Image from "../image"

const ChooseBrand = ({brands}) => {
    if ( isEmpty(brands) || !isArray(brands)) {
        return null
    }
    return (
        <div id="brands">
            <div className="flex justify-content flex-wrap py-14 container mx-auto px-2" >
                <div className="w-full pr-12">
                    <h2>
                    Выбрать бренд   
                    </h2>
                </div>
                <div className="w-full my-7 md:my-12 xl:my-24 flex flex-wrap overflow-hidden justify-between -mx-3">
                    { brands.length ? brands.map( brand => {
                        const img = brand?.image ?? {}
                            return (
                                <div className="flex align-center justify-center  mb-4 py-4 px-3 w-1/2 overflow-hidden md:w-1/3 xl:w-1/4 " key={ brand?.id }>
                                    <Link 
                                    href={{
                                        pathname: '/brand/[brandId]',
                                        query: { brandId: brand?.slug },
                                    }}>
                                
                                        <a>
                                            <Image 
                                                sourceUrl={img?.src ?? ''}
                                                altText={img?.alt ?? ''}
                                                title={brand?.name ?? ''}
                                                width={'250px'}
                                                height={'50px'}
                                                className={'filter-gray'}
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
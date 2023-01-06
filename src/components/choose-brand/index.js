import { isArray, isEmpty } from "lodash"
import Link from "next/link"
import Image from "../image"

const ChooseBrand = ({brands}) => {
    if ( isEmpty(brands) || !isArray(brands)) {
        return null
    }
    return (
        <div id="brands" className="my-14 md:my-28">
            <div className="flex justify-content flex-wrap py-3 container mx-auto px-2" >
                <div className="w-full pr-12">
                    <h2>
                    Каталог
                    </h2>
                </div>
                <div className="w-full mt-7 xl:mt-14 flex flex-wrap justify-center sm:justify-between">
                    { brands.length ? brands.map( brand => {
                        const img = brand?.image ?? {}
                            return (
                                <Link 
                                key={brand.id}
                                href={{
                                    pathname: '/brand/[brandId]',
                                    query: { brandId: brand?.slug },
                                    
                                }}>
                                    <a 
                                        className="flex align-center justify-center mb-4 py-4 px-3 w-full sm:w-1/2 md:w-1/3 xl:w-1/4 card" key={ brand?.id }
                                        >
                                        <Image 
                                            sourceUrl={img?.src ?? ''}
                                            altText={img?.alt || brand?.name}
                                            title={brand?.name ?? ''}
                                            width={'250px'}
                                            height={'50px'}
                                            className={'filter-red-on-hover'}
                                        />
                                    </a>
                                </Link>
                            )
                    } ) : null }
                </div>
            </div>
        </div>
    )
}

export default ChooseBrand
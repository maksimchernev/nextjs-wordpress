import { isArray, isEmpty } from "lodash"
import Link from "next/link"
import Image from "../image"

const ChooseBrand = ({categories}) => {
    if ( isEmpty(categories) || !isArray(categories)) {
        return null
    }
    return (
        <div id="brands">
            <div className="flex justify-content flex-wrap py-14 container mx-auto" >
                <div className="w-full pr-12">
                    <h2>
                    Выбрать бренд   
                    </h2>
                </div>
                <div className="w-full my-24 flex flex-wrap -mx-3 overflow-hidden">
                    { categories.length ? categories.map( category => {
                        const img = category?.image ?? {}
                        if (category.parent == 0 && category.slug != 'uncategorized') {
                            return (
                                <div className="flex align-center justify-center  mb-4 py-4 px-3 w-full overflow-hidden sm:w-1/2 md:w-1/3 xl:w-1/4 " key={ category?.id }>
                                    <Link 
                                    href={{
                                        pathname: '/brand/[brandId]',
                                        query: { brandId: category?.slug },
                                    }}>
                                
                                        <a>
                                            <Image 
                                                sourceUrl={img?.src ?? ''}
                                                altText={img?.alt ?? ''}
                                                title={category?.name ?? ''}
                                                width={'250px'}
                                                height={'50px'}
                                            />
                                        </a>
                                    </Link>
                                    
                                </div>
                            )

                        }
                    } ) : null }
                    
                </div>
            </div>
        </div>
    )
}

export default ChooseBrand
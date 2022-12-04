
import Filter from "./filter"
import { useState } from "react"
import { getObjectOfArray } from "../../utils/miscellaneous"
const Filters = ({attributes, filters, setFilters}) => {
    const [isOpened, setIsOpened] = useState(getObjectOfArray(attributes, false))
    //console.log(isOpened)
    return (
        <div className="flex justify-center flex-wrap mt-14 mb-7 container mx-auto px-2 filter-color-gray">
                {attributes?.length ? attributes.map( (attribute) => {
                    return (
                        <Filter key={attribute.id} attribute={attribute} filters={filters} setFilters={setFilters} isOpened={isOpened} setIsOpened={setIsOpened}></Filter>
                    )
                }) : null} 
        </div>
    )
}

export default Filters

import Filter from "./filter"
import { useState } from "react"
import { getObjectOfArray } from "../../utils/miscellaneous"

const Filters = ({attributes, filters, setFilters,attrChosenLast, setAttrChosenLast}) => {
    const [isOpened, setIsOpened] = useState(getObjectOfArray([...attributes], false))
    return (
            <div className="w-1/3 md:w-1/4 flex flex-col flex-wrap mb-7 mx-auto pl-2 pr-3 relative">
                <div className="sticky top-20 overflow-auto filters-container pr-3 pl-2">
                    {attributes?.length ? attributes.map( (attribute, index) => {
                        return (
                            <Filter key={index} attribute={attribute} filters={filters} setFilters={setFilters} isOpened={isOpened} setIsOpened={setIsOpened} attrChosenLast={attrChosenLast} setAttrChosenLast={setAttrChosenLast}></Filter>
                        )
                    }) : null} 
                </div>
            </div>
    )
}

export default Filters
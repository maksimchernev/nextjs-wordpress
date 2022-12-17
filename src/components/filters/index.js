
import Filter from "./filter"
import { useEffect, useState } from "react"
import { getObjectOfArray } from "../../utils/miscellaneous"

const Filters = ({attributes, filters, setFilters,attrChosenLast, setAttrChosenLast}) => {
    const [isOpened, setIsOpened] = useState(getObjectOfArray([...attributes], false))
    useEffect(() => {
        console.log('isOpened', isOpened)
    }, [isOpened])
    return (
            <div className="w-1/3 md:w-1/4 flex flex-col flex-wrap  mx-auto pl-2 pr-3 relative">
                <div className="sticky top-20 overflow-auto filters-container pr-3 pl-2">
                    {attributes?.length ? attributes.map( (attribute, index) => {
                        return (
                            <Filter key={index} attribute={attribute} filters={filters} setFilters={setFilters} isOpened={isOpened} setIsOpened={setIsOpened} attrChosenLast={attrChosenLast} setAttrChosenLast={setAttrChosenLast}></Filter>
                        )
                    }) : null} 
                </div>
                <div className="pl-2 pr-3">
                    <button className="card w-full font-sf-pro-display-medium bg-brand-grayCF">Применить</button>
                </div>
            </div>
    )
}

export default Filters
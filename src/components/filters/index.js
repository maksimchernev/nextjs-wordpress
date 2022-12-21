
import Filter from "./filter"
import { useEffect, useState } from "react"
import { getObjectOfArray } from "../../utils/miscellaneous"

const Filters = ({attributes, filters, setFilters,attrChosenLast, setAttrChosenLast, useIdForFilters, isOpened, setIsOpened, isLoading}) => {
    return (
        <div >
            {attributes?.length ? attributes.map( (attribute, index) => {
                return (
                    <Filter key={index} 
                        attribute={attribute} 
                        filters={filters} setFilters={setFilters} 
                        isOpened={isOpened} setIsOpened={setIsOpened} 
                        attrChosenLast={attrChosenLast} setAttrChosenLast={setAttrChosenLast}
                        useIdForFilters={useIdForFilters}
                        isLoading={isLoading}
                    ></Filter>
                )
            }) : null} 
        </div>
    )
}

export default Filters
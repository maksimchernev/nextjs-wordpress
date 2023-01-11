
import ClearFilters from "./clear-filters"
import Filter from "./filter"

const Filters = ({attributes, filters, setFilters,attrChosenLast, setAttrChosenLast, useIdForFilters, isOpened, setIsOpened, isLoading, handleRemoveFilters, isMobile}) => {
    return (
        <div >
            {handleRemoveFilters && !isMobile && <ClearFilters handleRemoveFilters={handleRemoveFilters} isLoading={isLoading}/>}
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
            {handleRemoveFilters && isMobile && <ClearFilters handleRemoveFilters={handleRemoveFilters} isLoading={isLoading}/>}
        </div>
    )
}

export default Filters
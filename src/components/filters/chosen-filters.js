import ChosenFilter from "./chosen-filter"
import { Bin } from "../icons"

const ChosenFilters = ({attributes, filters, handleRemoveInitialFilters}) => {
    return (
        <div>
            <div className="pt-2 flex justify-center w-full ">
                <button 
                    onClick={()=>handleRemoveInitialFilters()}
                    className='hover:underline mx-2 flex flex-end items-center '
                    >
                    <Bin className='mb-0.5'/> <span className="ml-1">Сбросить фильтры</span>
                </button>
            </div>
            {attributes?.length ? attributes.map( (attribute, index) => {
                return (
                    <ChosenFilter
                        key={index} 
                        attribute={attribute} 
                        filters={filters} 
                        series={attribute.id == 'brands' ? attributes[1] : null}
                        >
                    </ChosenFilter>
                )
            }) : null} 
        </div>
    )
}

export default ChosenFilters
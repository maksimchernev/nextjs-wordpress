import { Bin } from "../icons"

const ClearFilters = ({handleRemoveFilters}) => {
    return (
        <div className="pt-2 flex justify-end sm:justify-center w-full flex-row-reverse">
            <button 
                onClick={()=>handleRemoveFilters()}
                className='sm:hover:underline px-4 flex flex-end items-center '
                >
                <Bin className='mb-0.5 hidden sm:block'/> <span className="sm:ml-1 clear-filters">Сбросить фильтры</span>
            </button>
        </div>
    )
}

export default ClearFilters
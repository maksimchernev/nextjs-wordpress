import { Bin } from "../icons"

const ClearFilters = ({handleRemoveFilters, isLoading}) => {
    let allowedStyles = 'cursor-pointer checkbox-wrapper-hover text-brand-gray3E'
    return (
        <div className="pt-2 flex justify-end sm:justify-center w-full flex-row-reverse">
            <button 
                onClick={()=>handleRemoveFilters()}
                className={`${isLoading ? 'cursor-not-allowed text-gray-300 ' : allowedStyles} sm:hover:underline px-4 flex flex-end items-center`}
                disabled={isLoading}
                >
                <Bin className='mb-0.5 hidden sm:block fill-current'/> <span className="sm:ml-1 clear-filters">Сбросить фильтры</span>
            </button>
        </div>
    )
}

export default ClearFilters
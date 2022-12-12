const Pagination = ({pagesNumber, page, setPage}) => {
    if ( pagesNumber <=1 ) {
		return null;
	}
    const handleOnClick = (num) => {
        setPage(num)
    }
    
    let mapArray = []
    for (let i=1; i<=pagesNumber; i++) {
        mapArray.push(i)
    }
    return (
        <div className="flex flex-wrap justify-center mx-auto overflow-hidden container mb-10 md:mb-20">
            {mapArray?.length ? mapArray.map((num) => {
                return (
                    <a key={num} onClick={()=>handleOnClick(num)} className={`${num == page ? `pointer-events-none bg-gray-200` : 'cursor-pointer'}  w-8 h-8 border-spacing-1 pagination-button flex justify-center items-center mr-2`}>{num}</a>
                )
            }
            )
            : null}
        </div>
    )
}

export default Pagination
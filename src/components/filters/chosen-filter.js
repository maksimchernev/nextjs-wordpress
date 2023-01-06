import { sanitize } from "../../utils/miscellaneous"

const ChosenFilter = ({attribute, filters, series}) => {
    const termsToDisplay = []
    if (filters[attribute.id]?.length) {
        for (let id of filters[attribute.id]) {
            if (attribute.terms?.length) {
                for (let term of attribute.terms) {
                    if (id == term.id) {
                        termsToDisplay.push(term.name)
                    } 
                }
            }
        }
    } else if (attribute.id == 'brands' && series) {
        if (filters['series']?.length) {
            for (let id of filters['series']) {
                for (let term of series.terms) {
                    if (term.id == id) {
                        termsToDisplay.push(term.brandName)
                    }
                }
            }
        }
    }
    return (
        <div className="w-full flex flex-wrap relative py-1 lg:py-2 lg:mt-3 filter-card px-10 sm:px-4 justify-between lg:bg-brand-yellow bg-opacity-85">
            <p className="flex justify-between  text-brand-gray3E my-0 lg:my-1 font-sf-pro-display-medium text-base"><span dangerouslySetInnerHTML={{ __html: sanitize(attribute.name+':') }}></span></p>
            <div className="flex lg:flex-col">
                {termsToDisplay.length ? termsToDisplay.map((term,index) => {
                    return (
                        <p key={index}
                            className="flex justify-start items-center my-0 lg:my-1 text-brand-gray3E font-sf-pro-display-medium text-base"
                        >{term}</p>
                    )
                }) : null }            
            </div>
        </div>
    )
}

export default ChosenFilter
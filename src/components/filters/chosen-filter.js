import { sanitize } from "../../utils/miscellaneous"

const ChosenFilter = ({attribute, filters}) => {
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
    }   
    return (
        <div className="w-full flex flex-wrap relative py-2 mt-3 px-4 card justify-between">
            <p className="flex justify-between  text-brand-gray3E  my-1 font-sf-pro-display-medium text-base"><span dangerouslySetInnerHTML={{ __html: sanitize(attribute.name) }}></span></p>
            <div className="flex flex-col">
                {termsToDisplay.length ? termsToDisplay.map((term,index) => {
                    return (
                        <p key={index}
                            className="flex justify-end items-center  my-1 text-brand-gray3E font-sf-pro-display-medium text-base"
                        >{term}</p>
                    )
                }) : null }            
            </div>
        </div>
    )
}

export default ChosenFilter
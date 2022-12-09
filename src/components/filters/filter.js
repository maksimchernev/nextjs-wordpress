import { filter } from "lodash"
import { sanitize, sanitizeTags } from "../../utils/miscellaneous"
import { ArrowFilter } from "../icons"

const Filter = ({attribute, filters, setFilters, isOpened, setIsOpened, attrChosenLast, setAttrChosenLast}) => {

    const handleOnClick = (id) => {
        const newIsOpened = isOpened
        Object.keys(newIsOpened).forEach((key) => {
            if (key == id) {
                newIsOpened[key] = !newIsOpened[key]
            }
            
        } );
        setIsOpened({...newIsOpened})
    }
    const handleOnChange = (attrName, attrTerm)=> {   
        let isValuePresented = false
        filters[attrName].map(term => {
            if (term == attrTerm) {
                isValuePresented = true
            }
        })
        if (!isValuePresented) {
                setFilters({...filters, [attrName]: [...filters[attrName], attrTerm]});
                setAttrChosenLast([...attrChosenLast, attrName])
        } else {
            if (filters[attrName].length > 0) {
                let newFilters = filters[attrName].filter(term => term != attrTerm)
                setFilters({...filters, [attrName]: newFilters})
                setAttrChosenLast(prevAttrChosenLast => prevAttrChosenLast.slice(0, prevAttrChosenLast.lastIndexOf(attrName)).concat(prevAttrChosenLast.slice(prevAttrChosenLast.lastIndexOf(attrName)+1)))
            }
            
        }       
    }
    
    return (
        <div className="w-full flex flex-wrap relative py-2 mt-3 card">
            <a className="flex justify-between filter-btn w-full mx-4 gray3E font-sf-pro-display-medium" onClick={ () => handleOnClick(attribute.id) }><span dangerouslySetInnerHTML={{ __html: sanitize(attribute.name) }}></span><ArrowFilter className={`${isOpened[attribute.id] ? `rotate-180` :  null} mx-1 filter-arrow fill-current filter-color-gray`}></ArrowFilter></a>
            <div className={`${isOpened[attribute.id] ? `flex ` : `hidden`} flex-col w-full mt-2 mx-4 bg-white font-sf-pro-display-medium`}>
                {attribute.terms?.length ? attribute.terms.map((term) => {
                    return (
                        <label key={term.id} className={`${!term.isVisible ? 'cursor-not-allowed text-gray-300 ': 'cursor-pointer checkbox-wrapper-hover text-brand-gray3E'}  checkbox-wrapper  font-sf-pro-display-light `}  >
                            <span dangerouslySetInnerHTML={{ __html: sanitize(term.name) }}></span>
                            <input type="checkbox" disabled={!term.isVisible} value={term.id} id={term.name} name={attribute.name} onChange={() => handleOnChange(attribute.id,term.name)}/>
                            <span className="checkmark"></span>
                            {/* <label dangerouslySetInnerHTML={{ __html: sanitize(term.name) }} ></label>    */} 
                        </label>
                    )
                }) : null
            }
            </div>
        </div>
    )
}

export default Filter
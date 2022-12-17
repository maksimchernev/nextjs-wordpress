import { sanitize } from "../../utils/miscellaneous"
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
    const handleOnDimentionsChange = (e, name, isFrom) => {
        let fromValue = isFrom && e.target.value
        let tillValue = !isFrom && e.target.value
        setFilters({...filters, [name]: [fromValue, tillValue]});
    }

    let attributeName 
    switch (attribute.name) {
        case 'length' :
            attributeName = 'Длина'
            break
        case 'width' :
            attributeName = 'Ширина'
            break
        case 'height' :
            attributeName = 'Высота'
            break
    }
    return (
        <div className="w-full flex flex-wrap relative py-2 mt-3 card ">
            {attribute.hasOwnProperty('id') ? 
                <>
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
                        }) : null }
                    </div>  
                </>
                : 
                <>
                    <a className="flex justify-between filter-btn w-full mx-4 gray3E font-sf-pro-display-medium" onClick={ () => handleOnClick(attribute.name) }><span>{attributeName}</span><ArrowFilter className={`${isOpened[attribute.id] ? `rotate-180` :  null} mx-1 filter-arrow fill-current filter-color-gray`}></ArrowFilter></a>
                    <div className={`${isOpened[attribute.name] ? `flex ` : `hidden`} flex-col w-full mt-2 mx-4 bg-white font-sf-pro-display-medium`}>
                        <div className="flex flex-col font-sf-pro-display-light">
                            <div className="flex my-2">
                                <span className=" mr-2">От</span>
                                <input type='number' className="w-3/5 border-b focus:outline-none" onChange={(e)=>handleOnDimentionsChange(e, attribute.name, true)}></input>
                                <span className=" ml-2">мм</span>
                            </div>
                            <div className="flex my-2">
                                <span className=" mr-2">До</span>
                                <input type='number' className="w-3/5 border-b focus:outline-none" onChange={(e)=>handleOnDimentionsChange(e, attribute.name, false)}></input>
                                <span className=" ml-2">мм</span>
                            </div>
                        </div>
                    </div>
                </>
            }          
            
        </div>
    )
}

export default Filter
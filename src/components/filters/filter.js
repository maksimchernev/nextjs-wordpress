import { useEffect } from "react"
import inpNum, { blockInvalidChar, sanitize } from "../../utils/miscellaneous"
import { ArrowFilter } from "../icons"
const exceptThisSymbols = ["e", "E", "+", "-", "."];

const Filter = ({attribute, filters, setFilters, isOpened, setIsOpened, attrChosenLast, setAttrChosenLast, useIdForFilters, isLoading}) => {
    const handleOnClick = (id) => {
        const newIsOpened = {...isOpened}
        Object.keys(newIsOpened).forEach((key) => {
            if (key == id) {
                newIsOpened[key] = !newIsOpened[key]
            }
            
        } );
        
        setIsOpened({...newIsOpened})
    }
    const handleOnChange = (attrId, attrTerm, isRadio)=> {  
        let isValuePresented = false
        filters[attrId].map(term => {
            if (term == attrTerm) {
                isValuePresented = true
            }
        })
        if (!isValuePresented) {
                if (isRadio) {
                    setFilters({...filters, [attrId]: [attrTerm]});
                } else {
                    setFilters({...filters, [attrId]: [...filters[attrId], attrTerm]});
                }
                attrChosenLast && setAttrChosenLast([...attrChosenLast, attrId])
        } else {
            if (filters[attrId].length > 0) {
                let newFilters = filters[attrId].filter(term => term != attrTerm)
                setFilters({...filters, [attrId]: newFilters})
                attrChosenLast && setAttrChosenLast(prevAttrChosenLast => prevAttrChosenLast.slice(0, prevAttrChosenLast.lastIndexOf(attrId)).concat(prevAttrChosenLast.slice(prevAttrChosenLast.lastIndexOf(attrId)+1)))
            }
            
        }       
    }
    const handleOnDimentionsChange = (e, name, isFrom) => {      
        let key = isFrom ? 'from' : 'till'
        let value 
        if (!e.target.value && isFrom) {
            value = 0
            attrChosenLast && setAttrChosenLast(prevAttrChosenLast => prevAttrChosenLast.slice(0, prevAttrChosenLast.lastIndexOf('dimention')).concat(prevAttrChosenLast.slice(prevAttrChosenLast.lastIndexOf('dimention')+1)))
        } else if (!e.target.value && !isFrom) {
            value = 99999999
            attrChosenLast && setAttrChosenLast(prevAttrChosenLast => prevAttrChosenLast.slice(0, prevAttrChosenLast.lastIndexOf('dimention')).concat(prevAttrChosenLast.slice(prevAttrChosenLast.lastIndexOf('dimention')+1)))
        } else {
            value = e.target.value
            if (attrChosenLast[attrChosenLast.length-1] !== 'dimention') {
                attrChosenLast && setAttrChosenLast([...attrChosenLast, 'dimention']) 
            }
        }
        setFilters({...filters, [name]: {...filters[name], [key]: value}});
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
                            let attrTerm = useIdForFilters ? term.id : term.name
                            return (
                                <label key={term.id} className={`${!term.isVisible || isLoading ? 'cursor-not-allowed text-gray-300 ': 'cursor-pointer checkbox-wrapper-hover text-brand-gray3E'}  checkbox-wrapper mb-3 font-sf-pro-display-light `}  >
                                    <span dangerouslySetInnerHTML={{ __html: sanitize(term.name) }}></span>
                                    {!attribute.oneAtATime ? 
                                        <input type="checkbox" 
                                        disabled={!term.isVisible || isLoading} 
                                        value={term.id} 
                                            id={term.name} 
                                            name={attribute.name} 
                                            onChange={() => handleOnChange(attribute.id, attrTerm)}
                                            />
                                        :
                                        <input type="radio" 
                                            disabled={!term.isVisible || isLoading} 
                                            value={term.id} 
                                            id={term.name} 
                                            name={attribute.name} 
                                            onChange={() => handleOnChange(attribute.id, attrTerm, true)}
                                            />
                                    }
                                    {!attribute.oneAtATime ? <span className="checkmark top-0.5"></span> : <span className="checkmark-rounded top-0.5"></span>}
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
                            <div className="flex mb-2 mt-1">
                                <span className="mr-2 leading-6">От</span>
                                <input type='number' 
                                    className="w-2/5 border-b focus:outline-none leading-5 flex self-end" 
                                    onChange={(e)=>handleOnDimentionsChange(e, attribute.name, true)}
                                    onKeyDown={e => exceptThisSymbols.includes(e.key) && e.preventDefault()}

                                    ></input>
                                <span className="ml-2 leading-6">мм</span>
                            </div>
                            <div className="flex my-2">
                                <span className="mr-2 leading-6">До</span>
                                <input type='number' 
                                    className="w-2/5 border-b focus:outline-none leading-5 flex self-end" 
                                    onChange={(e)=>handleOnDimentionsChange(e, attribute.name, false)}
                                    onKeyDown={e => exceptThisSymbols.includes(e.key) && e.preventDefault()}

                                ></input>
                                <span className="ml-2 leading-6">мм</span>
                            </div>
                        </div>
                    </div>
                </>
            }          
            
        </div>
    )
}

export default Filter
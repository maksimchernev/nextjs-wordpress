import { useState } from "react"
import { sanitize } from "../../utils/miscellaneous"
import { ArrowFilter } from "../icons"
import { useEffect } from "react"

const Filter = ({attribute, filters, setFilters, isOpened, setIsOpened}) => {

    const handleOnClick = (id) => {
        const newIsOpened = isOpened
        Object.keys(newIsOpened).forEach((key) => {
            if (key == id) {
                newIsOpened[key] = !newIsOpened[key]
            } else {
                newIsOpened[key] = false
            }
            
        } );
        setIsOpened({...newIsOpened})
    }
    const handleOnChange = (attrName, attrTerm)=> {   
        let isKeyPresented = false
        let isValuePresented = false
        if (filters[attrName]) {
            isKeyPresented = true
            filters[attrName].map(term => {
                if (term == attrTerm) {
                    isValuePresented = true
                }
            })
        }
        /* //console.log('isKeyPresented',isKeyPresented)
        //console.log('isValuePresented',isValuePresented) */
        if (!isValuePresented) {
            if (isKeyPresented) {
                setFilters({...filters, [attrName]: [...filters[attrName], attrTerm]});
            } else {
                setFilters({...filters, [attrName]: [attrTerm]});
            }
        } else {
            if (filters[attrName].length > 1) {
                let newFilters = filters[attrName].filter(term => term != attrTerm)
                setFilters({...filters, [attrName]: newFilters})
            } else {
                const { [attrName]: val, ...withoutKey } = filters;
                setFilters(withoutKey)
            }
        }       
    }
    
    return (
        <div className="w-1/4 flex relative mt-3">
            <a className="flex filter-btn w-full justify-center filter-color-gray font-light" onClick={ () => handleOnClick(attribute.id) }><span className="filter-text filter-color-gray" dangerouslySetInnerHTML={{ __html: sanitize(attribute.name) }}></span><ArrowFilter className={`${isOpened[attribute.id] ? `rotate-180` :  null} mx-1 filter-arrow fill-current filter-color-gray`}></ArrowFilter></a>
            <div className={`${isOpened[attribute.id] ? `flex ` :  `hidden`} flex-col absolute mt-6 bg-white dropdown-filter text-base mx-auto z-10`}>
                {attribute.terms?.length ? attribute.terms.map((term) => {
                    return (
                        <div key={term.id} className="leading-loose font-light">
                            <input type="checkbox" value={term.id} id={term.name} name={attribute.name} onChange={() => handleOnChange(attribute.id,term.name)}/>
                            <label htmlFor={term.name} dangerouslySetInnerHTML={{ __html: sanitize(term.name) }} className="ml-1"></label>    
                        </div>
                    )
                }) : null
            }
            
            </div>
        </div>
    )
}

export default Filter
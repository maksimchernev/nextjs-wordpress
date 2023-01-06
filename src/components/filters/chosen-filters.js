import ChosenFilter from "./chosen-filter"
const ChosenFilters = ({attributes, filters}) => {
    return (
        <div>
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
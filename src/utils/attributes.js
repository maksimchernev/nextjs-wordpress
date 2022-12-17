import { isArray } from "lodash";
import { getBrandsAndSeriesPaths } from "./categories";
import { getObjectOfArray } from "./miscellaneous";

const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;

const api = new WooCommerceRestApi({
  url: process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL,
  consumerKey: process.env.WC_CONSUMER_KEY,
  consumerSecret:process.env.WC_CONSUMER_SECRET,
  version: "wc/v3"
});

export const getAttributesData = async () => {
    return await api.get(
        'products/attributes',
        {
            hide_empty: true,
            per_page: 100
        }
    )
}

export const getAttributeTermsByAttributeName = async (attrName) => {
    const {data: attributes} = await getAttributesData()
    const attrObj = attributes.find(attribute => attribute.name == attrName)
    const attrId = attrObj.id
    return await api.get(
        `products/attributes/${attrId}/terms`,
        {
            hide_empty: true,
            per_page: 100
        }
    )
}

export const getRelatedAttributesData = async (products) => {
    let exampleProductAttributes = products[0].attributes
    if (!(exampleProductAttributes.length && isArray(exampleProductAttributes)) ) {
        return ({relatedAttributes: [], filtersObj: {}})
    }
    //фильтрация основных аттрибутов
    exampleProductAttributes = exampleProductAttributes.filter(attr => !(attr.name == 'Тип товара' || attr.name == 'Модельный ряд' || attr.id == 2 || attr.id ==7) )
    //получение данных по всем возможным аттрибутам для получения id
    const {data: attributes} = await getAttributesData()
    //получение всех возможных значений для аттрибутов
    let relatedAttributes = await Promise.all(exampleProductAttributes.map(async prAttr => {
        const attr = attributes.find(attr => prAttr.id == attr.id)
        const { data: attrTerms } = await api.get(
            `products/attributes/${attr.id}/terms`,
            {
                per_page: 100,
                hide_empty: true,
            }
        )
        //фильтрация неиспользуемых значений
        let newAttrTerms = attrTerms.filter(term => {
            let found = false
            for (let product of products) {
                for (let attribute of product.attributes) {
                    if (attribute.options.includes(term.name)) {                        
                        found = true
                        break
                    }
                }
                if (found) {
                    break
                }
            }
            return found
        })
        //добавление в массив значения для фильтрации значений аттрибутов
        newAttrTerms.forEach(element => {
            element.isVisible = true
        });     

        attr.terms = newAttrTerms
        return attr
    }))
    let exampleProductDimentions = []
    for (let product of products) {
        for (let productDim in product.dimensions) {
            if (exampleProductDimentions.length) {
                let foundAlready = false
                for (let dim of exampleProductDimentions) {
                    if (dim.name == productDim) {
                        foundAlready = true
                    }
                } 
                if (!foundAlready) {
                    exampleProductDimentions.push({name: productDim})
                }
            } else {
                exampleProductDimentions.push({name: productDim})
            }
            if (exampleProductDimentions.length >2) {
                break
            }
        }
        if (exampleProductDimentions.length >2) {
            break
        }   
    }
    console.log('exampleProductDimentions', exampleProductDimentions)
    relatedAttributes = relatedAttributes.concat(exampleProductDimentions)
    const filtersObj = getObjectOfArray(relatedAttributes, [])
    return({relatedAttributes, filtersObj})
}

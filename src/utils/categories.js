import { isArray } from "lodash";
import { getObjectOfArray } from "./miscellaneous";
const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;

const api = new WooCommerceRestApi({
  url: process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL,
  consumerKey: process.env.WC_CONSUMER_KEY,
  consumerSecret:process.env.WC_CONSUMER_SECRET,
  version: "wc/v3"
});
export const getAllCategoriesData = async (per_page = 100) => {
    return await api.get(
      'products/categories',
      {
        per_page: per_page,
        hide_empty: true
      }
  )
}
export const getCategoriesData = async (per_page = 100, parent) => {
      return await api.get(
          'products/categories',
          {
            per_page: per_page ,
            parent: parent,
            hide_empty: true
          }
      )
    }

export async function getAllCategories(per_page) {
  const { data: categories } = await getAllCategoriesData(per_page);
  return categories ?? {}
}
export async function getCategories(per_page, parent) {
  const { data: categories } = await getCategoriesData(per_page, parent);
  return categories ?? {}
}

//used for sitemap too
export async function getSubCategoriesById(id, nameToBeExcluded) {
  if (id == 0) {
    const categories = await getCategories(100,id);
    const brands = []
    if (categories.length && isArray(categories)) {
      for (let i=0; i<categories.length; i++ ) {
        if (categories[i].slug !== 'uncategorized' && categories[i].slug !== 'lamps' && categories[i].slug !== 'accessory' && categories[i].slug !== 'tracks' && categories[i].slug !== 'osnovanie-dlya-svetilnikov') {
          brands.push(categories[i])
        }
      }
    }
    return brands
  } else {
      if (nameToBeExcluded) {
        let categories = await getCategories(100,id);
        return categories.filter(category => category?.name !== nameToBeExcluded)
      }
      return await getCategories(100, id)
  }
}

export async function getCategoryDataBySlug(slug) {
  const categories = await getCategories()
  const categoryData = categories.filter(category => category.slug == slug)
  return categoryData[0] || {}
}

export async function getCategoryDataById(id) {
  return await api.get(
    `products/categories/${id}`
  )
}

export async function getDataForInitialFilters() {
  const {brandsCats, seriesCats, typeCats} = await getBrandsSeriesType()
  let relatedAttributes = [{id: 'brands', name: 'Бренд', terms: []}, {id: 'series', name: 'Серия', terms: []}, {id: 'type', name: 'Категория товара', oneAtATime: true, terms: []}]
  const categories = await getAllCategories(100)
  const allTypeCats = categories.filter(category => category.parent == 0 && category.slug != 'uncategorized' && (category.slug == 'lamps' || category.slug == 'accessory' || category.slug == 'tracks' || category.slug == 'osnovanie-dlya-svetilnikov')) 

  for (let brand of brandsCats) {
    relatedAttributes[0].terms.push({id: brand.id, name: brand.name, isVisible:true})
    for (let series of seriesCats) {
      if (series.parent == brand.id) {
        let childrenObject = {}
        let typesArray = []
        for (let type of typeCats) {
          if (type.parent == series.id) {
            childrenObject[type.name] = type.id
            for (let typeAllProducts of allTypeCats) {
              if (type.name === typeAllProducts.name) {
                if (!typesArray.includes(typeAllProducts.id)) {
                  typesArray.push(typeAllProducts.id)
                }
              }
            }
          }
        }
        relatedAttributes[1].terms.push({id: series.id, name: series.name, brand: brand.id, brandName: brand.name, isVisible:true, ...childrenObject, types: typesArray})
      }
    }
  }

  for (let type of allTypeCats) {
      relatedAttributes[2].terms.push({id: type.id, name: type.name, isVisible:true})
  }
  const filtersObj = getObjectOfArray(relatedAttributes, [])
  return({relatedAttributes, filtersObj})
}

export async function getLinkToSubCatalog(id) {
  const {brandsCats, seriesCats, typeCats} = await getBrandsSeriesType()
  let typeSlug
  let typeParent
  for (let type of typeCats) {
    if (type.id == id) {
      typeSlug = type.slug
      typeParent = type.parent
    }
  }
  let seriesSlug
  let seriesParent
  for (let series of seriesCats) {
    if (series.id == typeParent) {
      seriesSlug = series.slug
      seriesParent = series.parent
    }
  }
  let brandSlug
  for (let brand of brandsCats) {
    if (brand.id == seriesParent) {
      brandSlug = brand.slug
    }
  }
  if (typeSlug && seriesSlug && brandSlug) {
    return `/brand/${brandSlug}/series/${seriesSlug}/type/${typeSlug}`
  } else {
    return ''
  }


}

/////////////
/// Paths ///
/////////////
export async function getAllBrandsPaths() {
  const brands = await getSubCategoriesById(100, 0)
  return brands.map(brand => {
      return {
        params: {
          brandId: brand?.slug
        }
      }
  }) 
}

function findAllChildsOfCategories (categories, childCategories, nameToBeExcluded) {
  return childCategories.filter(seriesOrType => {
    let found = false
    categories.length && isArray(categories) ? categories.map(brand => { 
      let condition = nameToBeExcluded ? brand.id == seriesOrType.parent && seriesOrType.name != nameToBeExcluded : brand.id == seriesOrType.parent
      if (condition) {
        found = true
      }
    }) : null
    return found
  })
}



export async function getBrandsAndSeries() {
  const categories = await getAllCategories(100)
  const brandsCats = categories.filter(category => category.parent == 0 && category.slug != 'uncategorized' && category.slug != 'lamps' && category.slug != 'accessory' && category.slug != 'tracks' && category.slug != 'osnovanie-dlya-svetilnikov') 
  const seriesAndTypesCats = categories.filter(category => category.parent !== 0) 
  const seriesCats = findAllChildsOfCategories(brandsCats, seriesAndTypesCats)
  return {brandsCats, seriesCats}
}

export async function getBrandsAndSeriesPaths() {
  const {brandsCats, seriesCats} = await getBrandsAndSeries()
  return seriesCats?.map(series => {
    let brand = brandsCats.find(brand => brand?.id == series.parent)
    return {
      params: {
        brandId: brand?.slug,
        seriesId: series?.slug,
      }
    }
  })
}
export async function getBrandsSeriesType() {
  const categories = await getAllCategories(100)
  const brandsCats = categories.filter(category => category.parent == 0 && category.slug != 'uncategorized' && category.slug != 'lamps' && category.slug != 'accessory' && category.slug != 'tracks' && category.slug != 'osnovanie-dlya-svetilnikov') 
  const seriesAndTypesCats = categories.filter(category => category.parent !== 0) 
  const seriesCats = findAllChildsOfCategories(brandsCats, seriesAndTypesCats)
  const typeCats = findAllChildsOfCategories(seriesCats, seriesAndTypesCats)
  return {brandsCats, seriesCats, typeCats}
}


export async function getBrandsSeriesTypePaths() {
  const {brandsCats, seriesCats, typeCats} = await getBrandsSeriesType()
  return typeCats?.map(type => {
    let series = seriesCats.find(series => series?.id == type.parent)
    let brand = brandsCats.find(brand => brand?.id == series.parent)
    return {
      params: {
        brandId: brand?.slug,
        seriesId: series?.slug,
        typeId: type?.slug
      }
    }
  })
}





//used for sitemap only
export async function getSeriesSTMP(brands) {
  const categories = await getAllCategories(100)
  const seriesAndTypesCats = categories.filter(category => category.parent !== 0) 
  return findAllChildsOfCategories(brands, seriesAndTypesCats)
}
export async function getTypeSTMP(series) {
  const categories = await getAllCategories(100)
  const seriesAndTypesCats = categories.filter(category => category.parent !== 0) 
  return findAllChildsOfCategories(series, seriesAndTypesCats, 'Сопутствующие')
} 
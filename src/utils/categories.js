import { isEmpty, isArray } from "lodash";
import { func } from "prop-types";
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
        if (categories[i].slug !== 'uncategorized' && categories[i].slug !== 'lamp' && categories[i].slug !== 'accessory' && categories[i].slug !== 'track') {
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

/////////////
/// Paths ///
/////////////
export async function getAllBrandsPaths() {
  const brands = await getSubCategoriesById(100, 0)
  ////console.log('brands', brands)
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
  const brandsCats = categories.filter(category => category.parent == 0 && category.slug != 'uncategorized' && category.slug != 'lamp' && category.slug != 'accessory' && category.slug != 'track') 
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
  const brandsCats = categories.filter(category => category.parent == 0 && category.slug != 'uncategorized' && category.slug != 'lamp' && category.slug != 'accessory' && category.slug != 'track') 
  const seriesAndTypesCats = categories.filter(category => category.parent !== 0) 
  const seriesCats = findAllChildsOfCategories(brandsCats, seriesAndTypesCats)
  const typeCats = findAllChildsOfCategories(seriesCats, seriesAndTypesCats, 'Сопутствующие')
  return {brandsCats, seriesCats, typeCats}
}
export async function getBrandsSeriesTypePaths() {
  const {brandsCats, seriesCats, typeCats} = await getBrandsSeriesType()
  return typeCats?.map(type => {
    let slug = type?.slug?.slice(0, type?.slug?.indexOf('-'))
    let series = seriesCats.find(series => series?.id == type.parent)
    let brand = brandsCats.find(brand => brand?.id == series.parent)
    return {
      params: {
        brandId: brand?.slug,
        seriesId: series?.slug,
        typeId: slug
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
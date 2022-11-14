const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;

const api = new WooCommerceRestApi({
  url: process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL,
  consumerKey: process.env.WC_CONSUMER_KEY,
  consumerSecret:process.env.WC_CONSUMER_SECRET,
  version: "wc/v3"
});

export const getCategoriesData = async () => {
    return await api.get(
        'products/categories'
    )
}
 
export async function getCategories() {
  const { data: categories } = await getCategoriesData();
  return categories ?? {}
}
export async function getAllBrands() {
  const categories = await getCategories()
  const brands = categories.filter(category => category.parent == 0 && category.slug !== 'uncategorized') 
  console.log('brands', brands)
  return brands.map(brand => {
      return {
        params: {
          brandId: brand?.slug
        }
      }
  })
}
export async function getBrandsAndSeries() {
  const categories = await getCategories()
  const brands = categories.filter(category => category.parent == 0 && category.slug !== 'uncategorized') 
  const series = categories.filter(category => category.parent !== 0) 
  return series.map(seriesName => {
      let brand = brands.find(brand => brand?.id == seriesName.parent)
      return {
        params: {
          brandId: brand?.slug,
          seriesId: seriesName?.slug
        }
      }
  })
}

export async function getSeriesOfABrand(brandId) {
  const categories = await getCategories()
  const series = categories.filter(category => category.parent == brandId) 
  return series || {}
}

export async function getCategoryData(slug) {
  const categories = await getCategories()
  const categoryData = categories.filter(category => category.slug == slug)
  return categoryData[0] || {}
}
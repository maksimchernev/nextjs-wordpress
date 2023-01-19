const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;

const api = new WooCommerceRestApi({
  url: process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL,
  consumerKey: process.env.WC_CONSUMER_KEY,
  consumerSecret:process.env.WC_CONSUMER_SECRET,
  version: "wc/v3"
});
/**
 * Get Products.
 *
 * Endpoint /api/get-products or '/api/get-products?perPage=2'
 *
 * @param req
 * @param res
 * @return {Promise<void>}
 */

export const getProductsDataByCategoryId = async (per_page, category, page) => {
    return await api.get(
            'products',
            {
              per_page: per_page || 100,
              category: category || 0,
              page: page || 1,
              orderby: 'title'
            }
        )
}

export const getProductsData = async (per_page, page) => {
    return await api.get(
      'products',
      {
        per_page: per_page || 100,
        page: page || 1,
        orderby: 'title'
      }
  )
}
export const getProductData = async (slug) => {
  return await api.get(
    'products',
    {
      slug: slug || '',
    }
  )
}
  
//used for sitemap too
export const getAllProducts = async() => {
  async function awaitAll(count, asyncFn) {
      const promises = [];
      for (let i = 1; i <= count; i++) {
        promises.push(asyncFn(100, i));
      }
      return Promise.all(promises);
  }
  const { headers } = await getProductsData(100)
  let products = await awaitAll(Number(headers['x-wp-totalpages']), getProductsData)
  products = products.map(data => {
    return data.data
  })
  return products.reduce((acc, value)=> {
      return acc.concat(value)
  }) 
}


export const getAllProductsPaths = async() => {
  const products = await getAllProducts()
  return products.map(product => {
    return {
      params: {
        productId: decodeURI(product.permalink.split('product/')[1].slice(0,-1))
      }
    }
})
}
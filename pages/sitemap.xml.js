import * as fs from 'fs'
import { getBrandsAndSeries, getBrandsAndSeriesSTMP, getSeriesSTMP, getSubCategoriesById, getTypeSTMP } from '../src/utils/categories'
import { getAllProducts } from "../src/utils/products"


const Sitemap = () => {
  return null
}

export const getServerSideProps = async ({ res }) => {
  const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL

  const staticPaths = fs
  .readdirSync("pages")
  .filter(staticPage => {
    return ![
      "brand",
      "index.js",
      "product",
      "api",
      "_app.js",
      "_document.js",
      "404.js",
      "sitemap.xml.js",
    ].includes(staticPage)
  })
  .map(staticPagePath => {
    return `${BASE_URL}/${staticPagePath.split('.')[0]}`
  })

  const products = await getAllProducts()

  const dynamicPathsProducts = products.map(singleProduct => {
    return `${BASE_URL}/product/${singleProduct.slug}`
  })

  const brands = await getSubCategoriesById(0)
  const dynamicPathsBrands = brands.map(singleBrand => {
    return `${BASE_URL}/brand/${singleBrand.slug}`
  })

  const seriesCats = await getSeriesSTMP(brands)
  const dynamicPathsSeries = seriesCats?.map(series => {
    let brand = brands.find(brand => brand?.id == series.parent)
    return `${BASE_URL}/brand/${brand.slug}/series/${series.slug}`
  })

  const typeCats = await getTypeSTMP(seriesCats)
  const dynamicPathsType = typeCats?.map(type => {
    let slug = type?.slug?.slice(0, type?.slug?.indexOf('-'))
    let series = seriesCats.find(series => series?.id == type.parent)
    let brand = brands.find(brand => brand?.id == series.parent)
    return `${BASE_URL}/brand/${brand.slug}/series/${series.slug}/type/${slug}`
  })

  const allPaths = [...staticPaths, ...dynamicPathsBrands, ...dynamicPathsSeries,...dynamicPathsType, ...dynamicPathsProducts]


  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${allPaths.map(url => (
      `<url>
        <loc>${url}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>1.0</priority>
      </url>`
    )).join("")}
    </urlset>
  `

  res.setHeader('Content-Type', 'text/xml')
  res.write(sitemap)
  res.end()

  return {
    props: {}
  }
}

export default Sitemap

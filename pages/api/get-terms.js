const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;

const api = new WooCommerceRestApi({
  url: process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL,
  consumerKey: process.env.WC_CONSUMER_KEY,
  consumerSecret:process.env.WC_CONSUMER_SECRET,
  version: "wc/v3"
});

export default async function handler(req, res) {
    const responseData = {
        success: false,
        terms: []
    }
    const {per_page, attrId} = req?.query ?? {};
    try {
        const {data} = await api.get(
            `products/attributes/${attrId}/terms`,
            {
                per_page: per_page || 100,
                hide_empty: true,
            }
        )
        responseData.success = true;
        responseData.terms = data

        res.json(responseData)   
    } catch(error) {
        responseData.error = error.message
        res.status(500).json(responseData)
    }
}
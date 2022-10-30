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
        categories: []
    }

    try {
        const {data} = await api.get(
            'products/categories'
        )
        responseData.success = true;
        responseData.categories = data

        res.json(responseData)   
    } catch(error) {
        responseData.error = error.message
        res.status(500).json(responseData)
    }
}
const path = require('path');
const allowedImageWordPressDomain = new URL( process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL ).hostname;

module.exports = {
	trailingSlash: false,
	sassOptions: {
		includePaths: [path.join(__dirname, 'styles')]
	},
	images: {
		domains: [ allowedImageWordPressDomain, 'via.placeholder.com' ],
	}
	/**
	 * We specify which domains are allowed to be optimized.
	 * This is needed to ensure that external urls can't be abused.
	 * @see https://nextjs.org/docs/basic-features/image-optimization#domains
	 */
}
  


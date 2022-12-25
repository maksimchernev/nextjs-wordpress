export const HEADER_FOOTER_ENDPOINT = `${ process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL }/wp-json/rae/v1/header-footer?header_location_id=hcms-menu-header&footer_location_id=hcms-menu-footer`;
export const HERO_ENDPOINT = `${ process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL }/wp-json/rae/v1/home`
export const GET_PRODUCTS_ENDPOINT = `${process.env.NEXT_PUBLIC_SITE_URL}/api/get-products`;
export const GET_ALL_PRODUCTS_ENDPOINT = `${process.env.NEXT_PUBLIC_SITE_URL}/api/get-all-products`;
export const GET_ATTRIBUTES_ENDPOINT = `${process.env.NEXT_PUBLIC_SITE_URL}/api/get-attributes`;
export const GET_TERMS_ENDPOINT = `${process.env.NEXT_PUBLIC_SITE_URL}/api/get-terms`;

export const CART_ENDPOINT = `${process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL}/wp-json/rae/v1/cart/items/`;
export const SENT_EMAIL_ENDPOINT = `${process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL}/wp-json/contact-form-7/v1/contact-forms/3514/feedback`
import DOMPurify from 'dompurify';
import { isArray } from 'lodash';

/**
 * Sanitize markup or text when used inside dangerouslysetInnerHTML
 *
 * @param {string} content Plain or html string.
 *
 * @return {string} Sanitized string
 */
export const sanitize = ( content ) => {
	return process.window ? DOMPurify.sanitize( content ) : content;
};
export const sanitizeTags = (content) => {
	return content.replace( /(<([^>]+)>)/ig, '')
}

export const splitIntoPages = (array, perPage) => {
	let products = array
	let resultArray = []
	if (array?.length && isArray(array)) {
		for (let i = 0; i <= products.length; i += perPage) {
			let chunk = products.slice(i, i+perPage);
			resultArray.push(chunk);
		}
	} else {
		resultArray = [[]]
	}
	return resultArray
}
export const getObjectOfArray = (arrayWithIds, baseValue) => {
	const obj = {}
    for (let i=0; i<arrayWithIds.length; i++) {
        obj[arrayWithIds[i].id] = baseValue
    }
	return obj
}

export const placeholderFunction = (array) => {
	return array
}

export const roundToTwo = (num) => {
    return +(Math.round(num + "e+2")  + "e-2");
}

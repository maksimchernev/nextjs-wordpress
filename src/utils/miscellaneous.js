import DOMPurify from 'dompurify';
import { isArray } from 'lodash';
import { object } from 'prop-types';

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
	if (arrayWithIds?.length) {
		for (let i=0; i<arrayWithIds.length; i++) {
			if (arrayWithIds[i].hasOwnProperty('id')) {
				obj[arrayWithIds[i].id] = baseValue
			} else {
				obj[arrayWithIds[i].name] = baseValue
			}
		}
	}
	return obj
}

export const getArrayOfObject = (object) => {
	const array = []
	for (let key in object) {
		array.push({name: [key][0], value: object[key]})
	}
	return array
}

export default function inpNum(e) {
	e = e || window.event;
	var charCode = (typeof e.which == "undefined") ? e.keyCode : e.which;
	var charStr = String.fromCharCode(charCode);
	if (!charStr.match(/^[0-9]+$/))
	  e.preventDefault();
  }
export const roundToTwo = (num) => {
    return +(Math.round(num + "e+2")  + "e-2");
}


export function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {width, height}
  }
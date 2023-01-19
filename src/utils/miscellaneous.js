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
	return capitalized(unescape(content.replace( /(<([^>]+)>)/ig, '')))
}
function unescape(s) {
	var re = /&(?:amp|#38|lt|#60|gt|#62|apos|#39|quot|#34);/g;
	var unescaped = {
	  '&amp;': '&',
	  '&#38;': '&',
	  '&lt;': '<',
	  '&#60;': '<',
	  '&gt;': '>',
	  '&#62;': '>',
	  '&apos;': "'",
	  '&#39;': "'",
	  '&quot;': '"',
	  '&#34;': '"'
	};
	return s.replace(re, function (m) {
	  return unescaped[m];
	});
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


export function checkEmptyFilters(filters) {
	let values =  Object.values(filters)
	let result = true
	for (let i =0; i<values.length; i++) {
		if (Array.isArray(values[i])) {
			if (values[i].length) {
				result = false;
				break
			}
		} else {
			if (values[i].till !== 99999999 || values[i].from !== 0) {
				result = false;
				break
			}
		}
	}
	return result
}

export function capitalized (str) {return str.replace(str.charAt(0), str.charAt(0).toUpperCase())};


export function getCategoryLinkNameForButton (str) {
	if (!str) return str
	let categoryLinkName
	switch(str) {
		case "Светильники":
			categoryLinkName = 'светильникам'
			break
		case 'Шинопроводы':
			categoryLinkName = 'шинопроводам'
			break
		case 'Сопутствующие':
			categoryLinkName = 'аксессуарам'
			break
		case 'Основание для светильников':
			categoryLinkName = 'основаниям'
			break
		default: 
			categoryLinkName = str
	}
	return categoryLinkName
}
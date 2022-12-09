import { isEmpty } from 'lodash';

export const storeSession = ( session ) => {
	
	if ( isEmpty( session ) ) {
		return null;
	}
	const now = new Date()
	const ttl = 8*60*60*1000
	const sessionObj = {
		sessionKey: session,
		expiry: now.getTime() + ttl,
	}

	localStorage.setItem( 'x-wc-session', JSON.stringify(sessionObj) );
}

export const getSession = () => {
	let sessionObj = localStorage.getItem( 'x-wc-session' )
	if (!sessionObj) {
		return null
	}
	sessionObj= JSON.parse(sessionObj)
	const now = new Date()
	if (now.getTime() > sessionObj.expiry) {
		localStorage.removeItem('x-wc-session')
		return null
	}

	return sessionObj.sessionKey
}


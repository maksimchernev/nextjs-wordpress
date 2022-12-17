import axios from 'axios';
import FormData from 'form-data';
import { isEmpty } from 'lodash';
import { SENT_EMAIL_ENDPOINT } from '../../src/utils/constants/endpoints';

const jsonToFormData = (json) => {
    try {
      const fdata = new FormData()
  
      for (let k in json) {
        fdata.append(k, json[k])
      }
      /*  */
      return fdata
    } catch (error) {
      console.error(error)
      return null
    }
  }

export default async function handler( req, res ) {
	const responseData = {
		success: false,
		status: '',
		message: '',
		
	};
    if ( isEmpty( req.body ) ) {
            responseData.error = 'Required data not sent';
            return responseData;
        }	

	try {
		const {data} = await axios.post(`${SENT_EMAIL_ENDPOINT}`, jsonToFormData(req.body))
		responseData.success = true;
		responseData.status = data.status;
		responseData.message = data.message;	
		res.json( responseData );
		
	} catch ( error ) {
		console.log( 'error', error );
		responseData.error = error.message;
		res.status( 500 ).json( responseData );
	}
}

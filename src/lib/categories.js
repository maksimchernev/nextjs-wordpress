import axios from 'axios'
import { GET_CATEGORIES_ENDPOINT} from '../utils/constants/endpoints'

export async function getAllCategories() {
    const categoriesData = await axios.get(GET_CATEGORIES_ENDPOINT)
    return fileNames.map(fileName => {
      return {
        params: {
          id: fileName.replace(/\.md$/, '')
        }
      }
    })
  }
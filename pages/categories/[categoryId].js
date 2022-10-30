import Layout from '../../src/components/layouts';
import { useRouter } from 'next/router';

import { HEADER_FOOTER_ENDPOINT} from '../../src/utils/constants/endpoints';
import {getAllCategories, GET_CATEGORIES_ENDPOINT} from '../../src/lib/categories'
import axios from 'axios'

export default function Category(props) {
  const router = useRouter()
  const {categoryId} = router.query
  return (
    <Layout headerFooter={props.headerFooter}>
        <div className='flex w-96 h-86 bg-red'>block {categoryId}</div>
    </Layout>
  )
}

/* export async function getStaticPaths() {
    const paths = await getAllCategories()
    console.log('paths', paths)
    return {
      paths,
      fallback: false,
    };
  } */
  

  export async function getStaticPaths() {
    return {
      paths: [{
        params: {
          categoryId: 'alright'
        }
      }],
      fallback: false
    }
  }


export async function getStaticProps() {
	
	const { data: headerFooterData} = await axios.get( HEADER_FOOTER_ENDPOINT );
    const { data: categoriesData } = await axios.get(GET_CATEGORIES_ENDPOINT);
    const categories = categoriesData?.categories?.params?.category ?? {}
    console.log('categories', categories)
	return {
		props: {
			headerFooter: headerFooterData?.data ?? {},
            categories: categories
		},
		revalidate: 1,
	};
} 


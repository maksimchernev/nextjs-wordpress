import axios from "axios";
import Image from "../src/components/image";
import Layout from "../src/components/layout";
import { HEADER_FOOTER_ENDPOINT } from "../src/utils/constants/endpoints";

export default function PageNotFound ({headerFooter}) {
    return (
        <Layout headerFooter={headerFooter || {}} initialHeader={'black'} isBagYellow={true} title={'Страница не найдена'}>
            <div className="mt-32 container mx-auto px-2">
                <p className="text-center w-full font-sf-pro-display-bold text-30px leading-10 sm:text-40px">Страница не найдена :(</p>
                <div className="w-full flex justify-center mb-20 mt-10 sm:mt-20 sm:mb-32">
                    <Image
                        sourceUrl='/404-picture.png'
                        altText='404-picture'
                        title='404-picture'
                        height="414"
                        width="402"
                    />
                </div>
            </div>
        </Layout>
        )
}

export async function getStaticProps() {
	
	const { data: headerFooterData } = await axios.get( HEADER_FOOTER_ENDPOINT );
	
	return {
		props: {
			headerFooter: headerFooterData?.data ?? {},
		},
		revalidate: 10,
	};
}

import { AppProvider } from '../context';
import Header from './header';
import Footer from './footer';

const Layout = ({children, headerFooter, initialHeader, isBagYellow, bgProduct, metaData, title, isMain}) => {
	console.log('isMain', isMain)
	const { header, footer } = headerFooter || {};
	return (
		<AppProvider>
			<div className={bgProduct ? 'product-bg-gray' : null}>
				<Header isMain={isMain} header={header} footer={footer} initialHeader={initialHeader} isBagYellow={isBagYellow} metaData={metaData} title={title}/>
				<main>
					{children}
				</main>
				<Footer footer={footer} header={header}/>
			</div>
		</AppProvider>
	)
}

export default Layout

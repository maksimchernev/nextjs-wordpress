import { AppProvider } from '../context';
import Header from './header';
import Footer from './footer';

const Layout = ({children, headerFooter, initialHeader, isBagYellow, bgProduct}) => {
	const { header, footer } = headerFooter || {};
	return (
		<AppProvider>
			<div className={bgProduct ? 'product-bg-gray' : null}>
				<Header header={header} footer={footer} initialHeader={initialHeader} isBagYellow={isBagYellow} bgProduct={bgProduct}/>
				<main className="min-h-50vh">
					{children}
				</main>
				<Footer footer={footer}/>
			</div>
		</AppProvider>
	)
}

export default Layout

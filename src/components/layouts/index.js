import { AppProvider } from '../context';
import Header from './header';
import Footer from './footer';

const Layout = ({children, headerFooter, initialHeader, isHeaderVisible}) => {
	const { header, footer } = headerFooter || {};
	return (
		<AppProvider>
			<div>
				<Header header={header} initialHeader={initialHeader} isHeaderVisible={isHeaderVisible}/>
				<main className="min-h-50vh">
					{children}
				</main>
				<Footer footer={footer}/>
			</div>
		</AppProvider>
	)
}

export default Layout

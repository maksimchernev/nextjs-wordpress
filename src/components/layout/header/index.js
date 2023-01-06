import Head from 'next/head'
import Link from 'next/link'
import Image from '../../image';
import { useContext, useEffect, useState } from "react";
import { sanitize } from "../../../utils/miscellaneous";
import {BurgerIcon, BurgetIconCross} from '../../icons' 
import {Bag} from '../../icons' 
import { AppContext } from '../../context';

const Header = ({header, footer, initialHeader, isBagYellow, metaData = [], title,isMain }) => {
	const {sidebarTwo} = footer || {}
	const [clientWindowHeight, setClientWindowHeight] = useState("");
	const [backgroundTransparacy, setBackgroundTransparacy] = useState(0);
	const [padding, setPadding] = useState(30);
	const [boxShadow, setBoxShadow] = useState(0);
	const [fontColor, setFontColor] = useState('text-white');
	const [bagColor, setBagColor] = useState('text-white');
	const [isMenuVisible, setIsMenuVisible] = useState(false);
	const [cart, setCart] = useContext(AppContext)
	const handleScroll = () => {
		setClientWindowHeight(window.scrollY);
	};
	useEffect(() => {
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	});

	useEffect(() => {
		let color
		initialHeader == 'black' ? color = '#333' : color = '#fff'
		let backgroundTransparacyVar = clientWindowHeight / 200;
		let paddingVar = 30 - backgroundTransparacyVar * 20;
		paddingVar < 10 ? paddingVar = 10 : paddingVar = paddingVar
		let boxShadowVar = backgroundTransparacyVar * 0.1;
		boxShadowVar > 0.4 ? boxShadowVar = 0.4 : boxShadowVar = boxShadowVar
		let fontColorVar = backgroundTransparacyVar > 0.2 ? '#333' : color
		let bagColorVar = isBagYellow ? bagColorVar = '#FFDF38' : bagColorVar = fontColorVar 
		setBackgroundTransparacy(backgroundTransparacyVar);
		setPadding(paddingVar);
		setBoxShadow(boxShadowVar);
		setFontColor(fontColorVar)
		setBagColor(bagColorVar)
	}, [clientWindowHeight, initialHeader, isBagYellow]);

	const {siteTitle, siteLogoUrl, favicon, siteDescription} = header || {}
	let navStyle
	if (!isMenuVisible) {
		navStyle = {
			background: `rgba(255, 255, 255, ${backgroundTransparacy})`,
			padding: `${padding}px 0px`,
			boxShadow: `rgb(0 0 0 / ${boxShadow}) 0px 0px 20px 6px`,
			color: `${fontColor}`
		}
	} else {
		navStyle = {
			background: `rgba(62, 61, 61, 1)`,
			padding: `${padding}px 0px`,
			boxShadow: `rgb(0 0 0 / 1) 0px 0px 20px 6px`,
			color: `#fff`
		}
	}
	let descriptionObj
	let keywordsObj
	if (metaData.length) {
		descriptionObj = metaData.find(obj => obj.key == '_aioseo_description')
		keywordsObj = metaData.find(obj => obj.key == '_aioseo_keywords')
	}
    return (
        <>
		   <Head>
		   		<meta charSet="UTF-8"></meta>
				<meta name="description" content={ descriptionObj ? descriptionObj.value : siteDescription || ''}></meta>
				<meta name="keywords" content={ keywordsObj ? keywordsObj.value : ''}></meta>
				<meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
				<title>{title ? title : siteTitle}</title>
				<link rel="icon" href={favicon || "/favicon.png"} />
				
			</Head>
			<div className="fixed w-full top-0" id='header'>
				<nav className={`p-4`} style={navStyle}>
					<div className='flex items-center justify-between flex-wrap container mx-auto px-2'>
						<div className={`items-center flex-shrink-0 lg:flex hidden`}>
							<Link href="/">
								<a>
									{
										siteLogoUrl ? (
											<Image 
												sourceUrl={siteLogoUrl || ''}
												altText={`${siteTitle} logo` || ''}
												title={`${siteTitle} logo` || ''}
												width={'328px'}
												height={'50px'}
											/>
										) : (
											<span className="font-medium tracking-tight ">
												<p className="logo-text text-3xl md:text-5xl text-brand-yellow">Magnetic Light</p>
											</span>
										)
									}
								</a>
							</Link>
						</div>
					
						{/* mobile */}
						<div className="flex lg:hidden flex-shrink-0">
							<button
								onClick={ () => setIsMenuVisible( ! isMenuVisible ) }
								className="flex items-center hover:text-brand-yellow hover:border-black">
								{!isMenuVisible ? <BurgerIcon className="fill-current h-10 w-10"/> : <BurgetIconCross className="fill-current flex justify-center items-center h-7 w-7 ml-1.5"/>}
							</button>
							<Link href="/" >
								<a className={`${isMain ? 'hidden' : 'flex items-center ml-2'}`}>
									{
										siteLogoUrl ? (
											<Image 
												sourceUrl={siteLogoUrl || ''}
												altText={`${siteTitle} logo` || ''}
												title={`${siteTitle} logo` || ''}
												width={'328px'}
												height={'50px'}
											/>
										) : (
											<span className="font-medium tracking-tight ">
												<p className={`logo-text text-24px sm:text-3xl md:text-4xl mb-0 ${isBagYellow ? 'text-brand-yellow' : "text-brand-gray3E"}` }>Magnetic Light</p>
											</span>
										)
									}
								</a>
							</Link>
						</div>
						<div className='lg:hidden flex'>
							
							<div className={`text-20px header-footer-link mr-1 duration-100  items-center ${isMain ? 'flex phone-container' : 'hidden'}`} dangerouslySetInnerHTML={{ __html: sanitize( sidebarTwo ) }}/>
							<div className="text-sm font-medium ">
								<Link href="/cart">
									<a className="flex">
										<span className={`px-2 py-2 flex flex-row items-center relative rounded-full`}>
											<Bag className={`fill-current h-7 w-7 ${!isMain ? (isMenuVisible ? 'text-white' : isBagYellow ? 'text-brand-yellow' : 'text-brand-gray3E') : (isBagYellow ? 'text-brand-yellow' : null)}`}/>
											{cart?.totalQty  
												? <span className='ml-1 cart-qty-span flex items-center justify-center text-10px font-sf-pro-display-bold absolute bottom-1 duration-100 right-1'>{cart?.totalQty}</span>
												: null
											}
										</span>
									</a>
								</Link>
							</div>
						</div>
						{/* /mobile */}

						<div className={`${isMenuVisible ? `max-h-full px-2` :  `h-0`} w-full overflow-hidden lg:h-full flex-grow lg:flex lg:items-center lg:w-auto`}>
							<div className={`${isMenuVisible ? 'flex flex-col items-center text-base my-5': 'block lg:flex'} text-14px font-medium uppercase lg:flex-grow  lg:justify-end duration-100`}>
								<Link href="/#about">
									<a className="block my-2 lg:my-auto lg:inline-block header-footer-link lg:mr-8 xl:mr-10 "
									>О нас
									</a>
								</Link>
								<Link href="/shop">
									<a className="block my-2 mt-5 lg:mt-0 lg:my-auto lg:inline-block header-footer-link lg:mr-8 xl:mr-10 " 
									>Каталог
									</a>
								</Link>
								<Link href="/#brands">
									<a className="block my-2 mt-5 lg:mt-0 lg:my-auto lg:inline-block header-footer-link lg:mr-8 xl:mr-10 "
									>Бренды
									</a>
								</Link>								
							</div>
							<div className='text-sm lg:text-2xl my-2 lg:mr-8 xl:mr-10 font-medium lg:my-auto header-footer-link duration-100 hidden lg:block' dangerouslySetInnerHTML={{ __html: sanitize( sidebarTwo ) }}/>
							<div className="text-sm font-medium hidden lg:block">
								<Link href="/cart">
									<a className="flex mt-4 lg:inline-block lg:mt-0">
										<span className={`px-2 py-2 flex flex-row items-center lg:flex-col relative rounded-full  duration-100 hover:bg-brand-gray99`}>
											<Bag className="mr-1 lg:mr-0 fill-current h-7 w-7" style={isMenuVisible ? {color: `#333`}:{color: `${bagColor}`}}/>
											{cart?.totalQty  
												? <span className='ml-1 cart-qty-span flex items-center justify-center text-11px font-sf-pro-display-bold absolute bottom-1 duration-100 right-1'>{cart?.totalQty}</span>
												: null
											}
										</span>
									</a>
								</Link>
							</div>
						</div>
					</div>
				</nav>
			</div>
        </>
    ) 
}

export default Header
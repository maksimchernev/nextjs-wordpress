import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from "react";

import {BurgerIcon} from '../../icons' 
import {Bag} from '../../icons' 


const Header = ({header}) => {
	const [clientWindowHeight, setClientWindowHeight] = useState("");

	const [backgroundTransparacy, setBackgroundTransparacy] = useState(0);
	const [padding, setPadding] = useState(30);
	const [boxShadow, setBoxShadow] = useState(0);
	const [fontColor, setFontColor] = useState('#fff');
	useEffect(() => {
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	  });
	
	  const handleScroll = () => {
		setClientWindowHeight(window.scrollY);
	  };
	
	  useEffect(() => {
		let backgroundTransparacyVar = clientWindowHeight / 600;
	
		if (backgroundTransparacyVar < 1) {
		  let paddingVar = 30 - backgroundTransparacyVar * 20;
		  let boxShadowVar = backgroundTransparacyVar * 0.1;
		  let fontColorVar = backgroundTransparacyVar > 0.2 ? '#333' : '#fff'
		  setBackgroundTransparacy(backgroundTransparacyVar);
		  setPadding(paddingVar);
		  setBoxShadow(boxShadowVar);
		  setFontColor(fontColorVar)
		}
	  }, [clientWindowHeight]);

	const {siteTitle, siteLogoUrl, favicon} = header || {}

	const [isMenuVisible, setIsMenuVisible] = useState(false);
    return (
        <>
		   <Head>
				<title>{siteTitle || 'Manually inserted title'}</title>
				<link rel="icon" href={favicon || "/favicon.png"} />
			</Head>
			<div className="fixed w-full" id='header'>
				<nav className="bg-white p-4 lg:bg-opacity-0" style={{
						background: `rgba(255, 255, 255, ${backgroundTransparacy})`,
						padding: `${padding}px 0px`,
						boxShadow: `rgb(0 0 0 / ${boxShadow}) 0px 0px 20px 6px`,
						color: `${fontColor}`
					}}
				>
					<div className="flex items-center justify-between flex-wrap container mx-auto ">
						<div className="flex items-center flex-shrink-0 mr-20">
							<Link href="/">
								<a>
									{
										siteLogoUrl ? (
											<img src={siteLogoUrl} alt={`${siteTitle} logo`} width='328'/>
										) : (
											<span className="font-semibold text-xl tracking-tight">
												<p className="logo-text">Magnetic Light</p>
											</span>
										)
									}
								</a>
							</Link>
						</div>
					
						{/* mobile */}
						<div className="block lg:hidden">
							<button
								onClick={ () => setIsMenuVisible( ! isMenuVisible ) }
								className="flex items-center text-red hover:text-black hover:border-black">
								<BurgerIcon className="fill-current h-10 w-10"/>
							</button>
						</div>

						<div className={`${isMenuVisible ? `max-h-full` :  `h-0`} w-full overflow-hidden lg:h-full flex-grow lg:flex lg:items-center lg:w-auto`}>
							<div className="text-base font-medium uppercase lg:flex-grow lg:flex lg:justify-end">
								<Link href="/#about/">
									<a className="block mt-4 lg:inline-block lg:mt-0 hover:text-black mr-10"
									>О нас
									</a>
								</Link>
								<Link href="/#brands/">
									<a className="block mt-4 lg:inline-block lg:mt-0 hover:text-black mr-10"
									>Бренды
									</a>
								</Link>
								<Link href="/#contacts/">
									<a className="block mt-4 lg:inline-block lg:mt-0 hover:text-black mr-10"
									>Контакты
									</a>
								</Link>
							</div>
							<div className="text-sm font-medium">
									<Link href="/cart">
									<a className="flex mt-4 lg:inline-block lg:mt-0 text-black hover:text-black mr-10">
									<span className="flex flex-row items-center lg:flex-col">
									<Bag className="mr-1 lg:mr-0 fill-current h-7 w-7 " style={{color: `${fontColor}`}}/>
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
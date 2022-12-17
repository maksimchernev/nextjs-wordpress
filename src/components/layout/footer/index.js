import Link from "next/link"
import {isEmpty, isArray} from 'lodash';
import { sanitize } from "../../../utils/miscellaneous";
import {getIconComponentByName} from '../../../utils/iconsMap'
import Image from '../../image';
import ContactForm from "../../contact-form";

const Footer = ({footer, header}) => {

	const {siteTitle, siteLogoUrl} = header || {}
	const {copyrightText, sidebarOne, socialLinks, sidebarTwo} = footer || {}
    return (
      <footer className="py-20 px-2">
			<div className="container mx-auto flex flex-wrap justify-center">
				<div className="lg:w-1/2 w-full">
					{/*Logo*/}
					<div className="flex items-center flex-shrink-0 mb-5">
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
									<span className="font-medium text-xl tracking-tight">
										<p className="logo-text text-4xl uppercase font-sf-pro-display-medium">Magnetic Light</p>
									</span>
								)
							}
					</div>
					<div className="flex flex-wrap overflow-hidden text-white text-base leading-8">
						{/*Menu*/}
						<div className="my-1 px-1  overflow-hidden w-1/2 ">
							<Link href="/#About/">
								<a className="header-footer-link block mr-10"
								>О нас
								</a>
							</Link>
							<Link href="/#Brands/">
								<a className="header-footer-link block mr-10"
								>Бренды
								</a>
							</Link>
							<Link href="/#About/">
								<a className="header-footer-link block  mr-10"
								>Контакты
								</a>
							</Link>
							{/*Social links*/}
							<div className="w-full flex mt-3">
							{ !isEmpty( socialLinks ) && isArray( socialLinks ) ? (
								<ul className="flex item-center">
									{ socialLinks.map( socialLink => (
										<li key={socialLink?.iconName} className="mr-2 text-white">
											<a href={ socialLink?.iconURL || '/'} target="_blank" rel="noreferrer" title={socialLink?.iconName}>
												{ getIconComponentByName( socialLink?.iconName ) }
												<span className="sr-only">{socialLink?.iconName}</span>
											</a>
										</li>
									) ) }
								</ul>
							) : null }
							</div>
						</div>
						{/*Widget One & Two*/}
						<div className="my-1 px-1 overflow-hidden w-1/2 leading-8">
							<div dangerouslySetInnerHTML={{ __html: sanitize( sidebarOne ) }}/>
							<div dangerouslySetInnerHTML={{ __html: sanitize( sidebarTwo ) }}/>
						</div>
					</div>
				</div>

				{/* form */}
				<ContactForm></ContactForm>


				<div className="mt-8 w-full flex flex-wrap">
					
					{/*Copyright Text*/}
					<div className="w-full text-white mt-10 text-xs">
						{ copyrightText ? copyrightText : '© Magnetic light 2022' }
					</div>
				</div>

			</div>
		</footer>
    )
}

export default Footer
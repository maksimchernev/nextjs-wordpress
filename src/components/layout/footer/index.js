import Link from "next/link"
import {isEmpty, isArray} from 'lodash';
import { sanitize } from "../../../utils/miscellaneous";
import {getIconComponentByName} from '../../../utils/iconsMap'
import Image from '../../image';




const Footer = ({footer, header}) => {

	const {siteTitle, siteLogoUrl} = header || {}
	const {copyrightText, sidebarOne, socialLinks, sidebarTwo} = footer || {}
    return (
      <footer className="py-20 px-2">
			<div className="container mx-auto flex flex-wrap justify-center">
				<div className="lg:w-1/2 w-full">
					<div className="flex items-center flex-shrink-0 mb-5">
							{
								siteLogoUrl ? (
									<Image 
										sourceUrl={siteLogoUrl ?? ''}
										altText={`${siteTitle} logo` ?? ''}
										title={`${siteTitle} logo` ?? ''}
										width={'328px'}
										height={'50px'}
									/>
								) : (
									<span className="font-semibold text-xl tracking-tight">
										<p className="logo-text text-4xl md:">Magnetic Light</p>
									</span>
								)
							}
					</div>

					{/*Logo*/}
			

					
					<div className="flex flex-wrap overflow-hidden text-white text-base widgets leading-8">
						{/*Menu*/}
						<div className="my-1 px-1  overflow-hidden w-1/2 ">
							<Link href="/#About/">
								<a className="block hover:text-gray-400 mr-10"
								>О нас
								</a>
							</Link>
							<Link href="/#Brands/">
								<a className="block hover:text-gray-400 mr-10"
								>Бренды
								</a>
							</Link>
							<Link href="/#About/">
								<a className="block hover:text-gray-400 mr-10"
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
				<div className="my-1 px-1 overflow-hidden w-1/2 hidden lg:block text-white lg:mt-0 mt-10" >
					<p className="text-xl xl:text-2xl uppercase mb-5 text-center md:text-left">Наш специалист поможет выбрать конфигурацию под Ваш проект!</p>
					<form action="/send-data-here" method="post" className="flex flex-col">
						<input type="text" id="name" name="name" className="text-white bg-transparent border-b border-white py-2 mb-7" required placeholder="Имя"/>
						<input type="phone" id="phone" name="phone" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" className="text-white bg-transparent border-b border-white py-2 mb-7" required placeholder="Телефон"/>

						<button type="submit" className="rounded-none border submit-btn">Отправить</button>
						<p className="text-xs text-gray-400 my-3 text-center md:text-left">Нажимая кнопку “Отправить” я принимаю условия Политики приватности</p>
					</form>
				</div>


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
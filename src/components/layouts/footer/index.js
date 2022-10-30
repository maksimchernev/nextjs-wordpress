import Link from "next/link"
import {isEmpty, isArray} from 'lodash';
import { sanitize } from "../../../utils/miscellaneous";
import {getIconComponentByName} from '../../../utils/iconsMap'
const Footer = ({footer, header}) => {

	const {siteLogoUrl} = header || {}
	const {copyrightText, sidebarOne, socialLinks} = footer || {}
    return (
      <footer className="py-20">
			<div className="container mx-auto flex flex-wrap">
				<div className="xl:w-1/2 w-full">
					{/*Logo*/}
					<div className="flex items-center flex-shrink-0 mb-5">
						{
							siteLogoUrl ? (
								<img src={siteLogoUrl} alt={`${siteTitle} logo`} width='328'/>
							) : (
								<span className="font-semibold text-xl tracking-tight">
									<p className="logo-text">Magnetic Light</p>
								</span>
							)
						}
					</div>

					
					<div className="flex flex-wrap overflow-hidden text-white text-base widgets">
						{/*Menu*/}
						<div className="my-1 px-1  overflow-hidden w-1/2 ">
							<Link href="/#About/">
								<a className="block hover:text-black mr-10"
								>О нас
								</a>
							</Link>
							<Link href="/#Brands/">
								<a className="block hover:text-black mr-10"
								>Бренды
								</a>
							</Link>
							<Link href="/#About/">
								<a className="block hover:text-black mr-10"
								>Контакты
								</a>
							</Link>
						</div>

						{/*Widget Two*/}
						<div className="my-1 px-1  overflow-hidden w-1/">
							<div dangerouslySetInnerHTML={{ __html: sanitize( sidebarOne ) }}/>
						</div>

						{/*Social links*/}
						<div className="w-full flex justify-center mt-10">
						{ !isEmpty( socialLinks ) && isArray( socialLinks ) ? (
							<ul className="flex item-center">
								{ socialLinks.map( socialLink => (
									<li key={socialLink?.iconName} className="mx-4 text-white">
										<a href={ socialLink?.iconURL || '/'} target="_blank" title={socialLink?.iconName}>
											{ getIconComponentByName( socialLink?.iconName ) }
											<span className="sr-only">{socialLink?.iconName}</span>
										</a>
									</li>
								) ) }
							</ul>
						) : null }
					</div>
					</div>
				</div>

				{/* form */}
				<div className="my-1 px-1  overflow-hidden xl:w-1/3 w-1/2 text-white xl:mt-0 mt-10 ml-12" >
					<p className="text-2xl uppercase mb-5">Наш специалист поможет выбрать конфигурацию под Ваш проект!</p>
					<form action="/send-data-here" method="post" className="flex flex-col">
						<input type="text" id="name" name="name" className="text-black bg-transparent border-b border-white py-2 mb-7" required placeholder="Имя"/>
						<input type="phone" id="phone" name="phone" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" className="text-black bg-transparent border-b border-white py-2 mb-7" required placeholder="Телефон"/>

						<button type="submit" className="rounded-none border submit-btn">Отправить</button>
						<p className="text-xs text-gray-400 my-3">Нажимая кнопку “Отправить” я принимаю условия Политики приватности</p>
					</form>
				</div>


				<div className="mb-8 mt-8 w-full flex flex-wrap">
					
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
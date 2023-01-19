import Link from "next/link"
import { ArrowDown, BigArrowDown, BigArrowDownMobile } from "../icons"

const Howto = () => {
    return (
        <div id="howto" className="mt-10 mb-5 sm:mt-20 sm:mb-10 lg:mt-40 lg:mb-20">
            <div className="flex justify-content flex-wrap py-3 container mx-auto px-2" >
                <div className="w-full pr-12">
                    <h2>
                        Как мы работаем?
                    </h2>
                </div>
                <div className="w-full my-3 sm:my-7 md:my-12 xl:my-24 text-brand-gray78 flex justify-center">
                    <ul className="base-timeline">
                        <li className="base-timeline__item base-timeline__item--data" num="1">
                            <div className="base-timeline__summary-text_container">
                                <span className="base-timeline__summary-text">Выбираете бренд</span>
                            </div>
                        </li>
                        <li className="base-timeline__item base-timeline__item--data" num="2">
                            <div className="base-timeline__summary-text_container">
                                <span className="base-timeline__summary-text">Выбираете конфигурацию</span>
                            </div>
                        </li>
                        <li className="base-timeline__item base-timeline__item--data" num="3">
                            <div className="base-timeline__summary-text_container">
                                <span className="base-timeline__summary-text">Специалист дополняет конфигурацию до полной комплектации</span>
                            </div>
                        </li>
                    </ul>
                </div>
                <Link href="/#contact-us">
                    <a className="flex text-center flex-col items-center w-full px-2 mb-5 sm:mb-10 text-brand-gray78 go-to-contacts-link down-btn-how-to"
                        >Либо присылайте техническое задание и наш специалист все сделает за Вас!
                        <BigArrowDown className="mr-1 hidden sm:block lg:mr-0 mt-5 stroke-current stroke-2 down-btn-how-to "/>
                        <BigArrowDownMobile className="mr-1 sm:hidden first-line:block lg:mr-0 mt-5 stroke-current stroke-2 down-btn-how-to "/>
                    </a>
                </Link>
            </div>
        </div>
    )
}

export default Howto
import { AboutDone } from "../icons"
import Image from "../image"
const About = () => {
    return (
        <div className="my-10 sm:my-20 lg:mt-40 container mx-auto px-2" id="about">
            <div className="flex w-full md:mb-5 lg:mb-12 md:gap-7 lg:gap-10 flex-wrap md:flex-nowrap">
                <div className="w-full md:w-1/2 flex flex-col">
                    <h2 className="w-full">
                        О нас
                    </h2>
                    <div className="w-full flex flex-wrap">
                        <p className="lg:mt-7 mb-3 text-base md:text-20px xl:text-24px leading-8 text-justify text-brand-gray78 w-full font-sf-pro-display-light">
                        Помогаем разобраться в многообразии современных трековых систем на основе магнитных светильников – крайне удобном способе организации освещения от кухни до огромного офисного кластера. 
                        <br /><br />В каталоге представлен широкий выбор качественных и функциональных систем, охватывающих все ценовые сегменты. Такое количество обусловлено намерением решить именно Вашу задачу.
                        </p>
                    </div>
                    <div className="hidden xl:flex items-center w-full mt-7">
                        <AboutDone className='min-w-50px'></AboutDone>
                        <p className="mb-0 ml-5 text-brand-gray78 font-sf-pro-display-light text-base md:text-20px xl:text-24px leading-8 text-justify">Проектируем управление освещением для систем на магнитных шинопроводах (DALI, KNX)</p>
                    </div>
                    <div className="hidden xl:flex items-center w-full mt-7">
                        <AboutDone className='min-w-50px'></AboutDone>
                        <p className="mb-0 ml-5 text-brand-gray78 font-sf-pro-display-light text-base md:text-20px xl:text-24px leading-8 text-justify">Осуществляем монтаж и шеф-монтаж проектируемого и поставляемого оборудования</p>
                    </div>
                </div>
                <div className="w-full md:w-1/2 px-2 sm:px-0 flex box-border justify-center md:justify-start 2xl:justify-center  md:items-center">
                    <Image 
                    sourceUrl="/about-picture.jpg"
                    altText={"Magnetic_light about"}
                    title={ "Magnetic_light about"}
                    className='object-center'
                    layout={'fill'}
                    containerClassNames='w-full 2xl:w-4/5 h-full max-w-400px min-h-333px md:max-w-full md:max-h-333px lg:max-h-566px xl:min-h-566px'
                    />
                </div>
            </div>
            <div className="flex mt-5 lg:mt-20 gap-7 lg:gap-10 flex-wrap md:flex-nowrap">
                <div className="flex xl:hidden items-center w-full md:w-1/2">
                    <AboutDone className='min-w-50px'></AboutDone>
                    <p className="mb-0 ml-5 text-brand-gray78 font-sf-pro-display-light text-base md:text-20px xl:text-24px leading-8">Проектируем управление освещением для систем на магнитных шинопроводах (DALI, KNX)</p>
                </div>
                <div className="flex xl:hidden items-center w-full md:w-1/2 ">
                    <AboutDone className='min-w-50px'></AboutDone>
                    <p className="mb-0 ml-5 text-brand-gray78 font-sf-pro-display-light text-base md:text-20px xl:text-24px leading-8">Осуществляем монтаж и шеф-монтаж проектируемого и поставляемого оборудования</p>
                </div>
            </div>
        </div>
    )
}

export default About
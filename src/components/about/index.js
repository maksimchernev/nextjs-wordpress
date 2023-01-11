import Image from "../image"
const About = () => {
    return (
        <div className="flex flex-wrap my-7 sm:my-14 lg:mt-28 container mx-auto px-2" id="about">
            <h2 className="w-full">
                О нас
            </h2>
            
            <div className="w-full flex flex-wrap">
                <p className="lg:mt-7 mb-3 text-20px md:text-24px xl:text-26px text-brand-gray78 w-full md:w-1/2 pr-2 md:pr-5 leading-8">
                    Повседневная практика показывает,  новая модель организационной деятельности играет важную роль в формировании существенных и административных.
                </p>
                <div className="w-full md:w-1/2 px-2 lg:mt-7 flex justify-center">
                    <Image 
                    sourceUrl="/about-picture.jpg"
                    altText={"Magnetic_light about"}
                    title={ "Magnetic_light about"}
                    className='object-bottom'
                    width='566'
                    height='500'
                    />
                </div>
            </div>
        </div>
    )
}

export default About
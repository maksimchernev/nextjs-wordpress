import Image from "../image"
const About = () => {
    return (
        <div className="flex justify-content flex-wrap my-28 container mx-auto px-2" id="about">
            <div className="md:w-1/2 w-full md:pr-12">
                <h2>
                    О нас
                </h2>
                <p className="mt-7 text-20px md:text-24px xl:text-26px text-brand-gray78">
                Повседневная практика показывает,  новая модель организационной деятельности играет важную роль в формировании существенных и административных.
                </p>
            </div>
            <div className="md:w-1/2 w-full">
                <Image 
                sourceUrl="/about-picture.jpg"
                altText={"Magnetic_light about"}
                title={ "Magnetic_light about"}
                width="566"
                height="500"
                />
            </div>
        </div>
    )
}

export default About
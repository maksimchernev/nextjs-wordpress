const Howto = () => {
    return (
        <div id="howto">
            <div className="flex justify-content flex-wrap py-14 container mx-auto px-2" >
                <div className="w-full pr-12">
                    <h2>
                        Как это работает?
                    </h2>
                </div>
                <div className="w-full my-7 md:my-12 xl:my-24">
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
                                <span className="base-timeline__summary-text">Наш специалист делает Вам рассчет под проект</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Howto
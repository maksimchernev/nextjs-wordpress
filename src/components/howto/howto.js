const Howto = () => {
    return (
        <div id="howto">
            <div className="flex justify-content flex-wrap py-14 container mx-auto" >
                <div className="w-full pr-12">
                    <h2>
                        Как это работает?
                    </h2>
                </div>
                <div className="w-full my-24">
                    <ul className="base-timeline">
                        <li className="base-timeline__item base-timeline__item--data" num="1">
                            <span className="base-timeline__summary-text">Выбираете бренд</span>
                        </li>
                        <li className="base-timeline__item base-timeline__item--data" num="2">
                            <span className="base-timeline__summary-text">Выбираете конфигурацию</span>
                        </li>
                        <li className="base-timeline__item base-timeline__item--data" num="3">
                            <span className="base-timeline__summary-text">Наш специалист делает Вам рассчет под проект</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Howto
import ContactForm from "."

const Popup = ({handleOnClick}) => {
    return (
        <div className="fixed z-20 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-start popup max-h-full overflow-auto bg-white mx-2 h-fit w-full sm:w-3/4 md:w-1/2">
            <ContactForm bgWhite={true} handleOnClick={handleOnClick}></ContactForm>
        </div>
    )
}

export default Popup
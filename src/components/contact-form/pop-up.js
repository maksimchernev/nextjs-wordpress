import ContactForm from "."
import { Cross } from "../icons"

const Popup = ({handleOnClick}) => {
    return (
        <div className="fixed z-20 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-start popup max-h-full overflow-auto bg-white mx-2 h-fit w-full sm:w-3/4 md:w-1/2">
            <button className="absolute top-5 right-5 w-8 hover:bg-brand-yellow mx-2 aspect-square flex items-center justify-center text-22px leading-22px bg-transparent"
                onClick={()=>handleOnClick()}
            ><Cross/></button>
            <ContactForm bgWhite={true}></ContactForm>
        </div>
    )
}

export default Popup
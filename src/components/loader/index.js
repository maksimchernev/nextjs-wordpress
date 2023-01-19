import Image from "next/image";

export default function Loader() {
    return (
        <div className="flex justify-center my-40">
            <Image width="100" height='100' src="/loader.gif"  alt="spinner"/> 
        </div>
    )    
}
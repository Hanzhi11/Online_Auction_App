
import { IoClose } from "react-icons/io5";
import ReactDOM from "react-dom";
import { useEffect } from "react";
import { ELEMENT_ID } from "./Constants";

interface Props {
    onClose: (event: React.MouseEvent<Element>) => void;
    children: JSX.Element;
}

function OverLay(props: Props) {
    const { onClose, children } = props

    useEffect(() => {
        document.body.classList.add('overflow-hidden')
        return () => document.body.classList.remove('overflow-hidden')
    }, [])

    return ReactDOM.createPortal(
        <div className="absolute inset-0 pt-6 bg-indigo-900 bg-opacity-90 flex flex-col overflow-scroll">
            <button id={ELEMENT_ID.CLOSE_OVERLAY_BUTTON} className="hover:cursor-pointer ml-auto mr-3.5 w-fit z-50" onClick={onClose}>
                <IoClose />
            </button>
            {children}
        </div>,
        document.querySelector('#overLay') as HTMLElement
    )
}

export default OverLay
import { IconContext } from "react-icons"
import { MdOutlinePictureAsPdf } from "react-icons/md";
import { TbExternalLink } from "react-icons/tb";
import { Link } from "react-router-dom";

interface Props {
    name: string;
}

function FileLink (props: Props) {
    const {name} = props
    return (
        <div className="flex bg-white mb-4 px-4 py-1 items-center rounded">
                        <IconContext.Provider
                            value={{
                                size: "1.2rem",
                                className: "fill-gray-500",
                            }}
                        >
                            <MdOutlinePictureAsPdf />
                        </IconContext.Provider>
                        <p className="mx-2  flex-1 leading-5">
                            {name}
                        </p>
                        <Link 
                        to='/pdf/REIQ_Auction_Conditions_no_signatures.pdf'
                        target='_blank'
                        className="flex items-center"
                        >
                            <IconContext.Provider
                                value={{
                                    size: "1.2rem",
                                }}
                            >
                                <TbExternalLink />
                            </IconContext.Provider>
                            <span className="text-green-500 border-b border-green-500 rounded-none ml-1">
                                View
                            </span>
                        </Link>
                    </div>
    )
}

export default FileLink
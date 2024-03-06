import { IconContext } from 'react-icons';
import { MdOutlinePictureAsPdf } from 'react-icons/md';
import { TbExternalLink } from 'react-icons/tb';
import { Link } from 'react-router-dom';

interface Props {
    name: string;
}

function FileLink(props: Props) {
    const { name } = props;
    return (
        <div className='mb-4 flex items-center rounded bg-white px-4 py-1'>
            <IconContext.Provider
                value={{
                    size: '1.2rem',
                    className: 'fill-gray-500',
                }}
            >
                <MdOutlinePictureAsPdf />
            </IconContext.Provider>
            <p className='mx-2  flex-1 leading-5'>{name}</p>
            <Link
                to='/pdf/REIQ_Auction_Conditions_no_signatures.pdf'
                target='_blank'
                className='flex items-center'
            >
                <IconContext.Provider
                    value={{
                        size: '1.2rem',
                    }}
                >
                    <TbExternalLink />
                </IconContext.Provider>
                <span className='ml-1 rounded-none border-b border-green-500 text-green-500'>
                    View
                </span>
            </Link>
        </div>
    );
}

export default FileLink;

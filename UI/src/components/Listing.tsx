import { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { IoCameraOutline } from 'react-icons/io5';
import { IconContext } from 'react-icons';
import Button from './Button';
import { GiHouse } from 'react-icons/gi';
import { FaBath, FaBed, FaCar } from 'react-icons/fa';
import { RxDimensions } from 'react-icons/rx';
import { FiCalendar } from 'react-icons/fi';
import { CiLocationOn } from 'react-icons/ci';
import { MdOutlinePictureAsPdf } from 'react-icons/md';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import classNames from 'classnames';
import Photos from './Photos';
import OverLay from './OverLay';
import { OverLayContentContext, WindowSizeContext } from '../App';
import { OVERLAY_CONTENTS } from '../shared/Constants';
import PersonList from './PersonList';
import SectionContainer from './SectionContainer';
import EnquiryForm from './EnquiryForm';

export interface Agent {
    fullName: string;
    email: string;
    mobile: string;
    portraitBytes: string;
}

export interface Auctioneer {
    fullName: string;
    licenceNumber: string;
    portraitBytes: string;
}

interface Details {
    address: string;
    agency: {
        name: string;
        address: string;
    };
    agents: Agent[];
    auctionDateTime: Date;
    auctioneer: Auctioneer;
    bedNumber: number;
    bathNumber: number;
    garageNumber: number;
    copyWriting: string;
    heading: string;
    photosBytes: string[];
    propertyType: string;
}

interface PropertyIcon {
    [key: string]: JSX.Element;
}

const PROPERTYICONS: PropertyIcon = {
    HOME: <GiHouse />,
    LAND: <RxDimensions />,
    BEDRROOM: <FaBed />,
    BATHROOM: <FaBath />,
    CAR: <FaCar />,
};

const ReadMore = (
    <>
        <span className='mr-2'>Read More</span>
        <IoIosArrowDown />
    </>
);
const ReadLess = (
    <>
        <span className='mr-2'>Read Less</span>
        <IoIosArrowUp />
    </>
);

const DefaultCopyWritingStyle = 'max-h-24 overflow-hidden';

function Listing() {
    const windowSize = useContext(WindowSizeContext);
    const { overLayContent, updateOverLayContent } = useContext(
        OverLayContentContext,
    );

    const [details, setDetails] = useState<Details>();
    const [readButtonContent, setReadButtonContent] =
        useState<JSX.Element>(ReadMore);
    const [showReadButton, setShowReadButton] = useState<boolean>(false);
    const [copyWritingStyle, setCopyWritingStyle] = useState<string>(
        DefaultCopyWritingStyle,
    );
    const { id } = useParams();
    const listingNumber = id?.split('-').at(-1);

    const updateShowReadButton = () => {
        const copyWriting = document.getElementById('copyWriting');
        if (!copyWriting) {
            return;
        }
        let newShowReadButton = false;
        if (copyWriting.scrollHeight > 96) {
            newShowReadButton = true;
        }
        setShowReadButton(newShowReadButton);
    };

    const handleReadButtonContent = (event: React.MouseEvent<Element>) => {
        const target = event.target as HTMLElement;
        if (!target) {
            return;
        }
        if (target.innerText == 'Read More') {
            setCopyWritingStyle('');
            setReadButtonContent(ReadLess);
        } else {
            setCopyWritingStyle(DefaultCopyWritingStyle);
            setReadButtonContent(ReadMore);
        }
    };

    useEffect(() => {
        fetch(
            `${import.meta.env.VITE_BASE_URL}/Listing/Details/${listingNumber}`,
        )
            .then((res) => res.json())
            .then((data) => setDetails(data));
    }, [listingNumber]);

    useEffect(() => {
        updateShowReadButton();
    }, [details, windowSize]);

    if (!details) {
        return;
    }

    let content;
    const isSmallScreen = windowSize.width < 768;
    const {
        photosBytes,
        agency,
        address,
        propertyType,
        bedNumber,
        bathNumber,
        garageNumber,
        auctionDateTime,
        agents,
        auctioneer,
        heading,
        copyWriting,
    } = details;

    const propertyFullAddress = address;
    const agencyFullAddress = agency.address;

    const mainPhotoUrl = `data:image/jpeg;base64,${photosBytes[0]}`;

    let propertyTypeIcon = PROPERTYICONS.HOME;
    if (propertyType === 'Land') {
        propertyTypeIcon = PROPERTYICONS.LAND;
    }
    const features = [
        {
            icon: propertyTypeIcon,
            content: propertyType,
        },
        {
            icon: PROPERTYICONS.BEDRROOM,
            content: bedNumber,
        },
        {
            icon: PROPERTYICONS.BATHROOM,
            content: bathNumber,
        },
        {
            icon: PROPERTYICONS.CAR,
            content: garageNumber,
        },
    ];

    const auctionDate = new Date(auctionDateTime);
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour12: true,
        hour: 'numeric',
        minute: 'numeric',
    };
    const dateTimeStrings = auctionDate
        .toLocaleDateString(undefined, options)
        .replace(',', '')
        .split(' at ');
    const time = dateTimeStrings[1].replace(' ', '');
    const date = dateTimeStrings[0];
    const formattedDate = date.concat(' - ', time.toUpperCase());

    const auctionInfo = [
        {
            icon: (
                <IconContext.Provider
                    value={{
                        size: '1.6rem',
                        className: 'stroke-gray-500',
                    }}
                >
                    <FiCalendar />
                </IconContext.Provider>
            ),
            content: formattedDate,
        },
        {
            icon: (
                <IconContext.Provider
                    value={{
                        size: '1.6rem',
                        className: 'stroke-1 stroke-gray-500',
                    }}
                >
                    <CiLocationOn />
                </IconContext.Provider>
            ),
            content: propertyFullAddress,
            note: 'ONSITE AND ONLINE',
        },
        {
            icon: (
                <IconContext.Provider
                    value={{
                        size: '1.6rem',
                        className: 'fill-gray-500',
                    }}
                >
                    <MdOutlinePictureAsPdf />
                </IconContext.Provider>
            ),
            content: ['REIQ Auction Conditions', 'Building Report'],
        },
    ];

    const auctionDetails = auctionInfo.map((info, index) => {
        let content = <p className='mb-0.5'>{info.content}</p>;
        if (typeof info.content === 'object') {
            const contents = info.content as string[];
            content = (
                <ul>
                    {contents.map((item) => {
                        return (
                            <li key={item} className='md:text-sm'>
                                -{' '}
                                <Link
                                    to=''
                                    className='hover:border-b border-green-500'
                                >
                                    {item}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            );
        }
        return (
            <div
                key={index}
                className='flex items-center py-4 bg-white px-3 border-b last-of-type:border-none'
            >
                <div>{info.icon}</div>
                <div className='ml-3'>
                    {content}
                    {info.note && (
                        <p className='text-gray-400 text-xxs'>{info.note}</p>
                    )}
                </div>
            </div>
        );
    });

    const propertyInfo = (
        <div className='px-3 md:px-0'>
            <p className='font-medium pt-5 md:text-lg'>{propertyFullAddress}</p>
            <IconContext.Provider
                value={{
                    size: '1rem',
                    className: 'stroke-black fill-gray-500',
                }}
            >
                <div className='flex text-sm text-gray-500 mt-1 mb-3 md:text-base'>
                    {features.map((feature, index) => {
                        const featureStyle = classNames('flex items-center', {
                            'mr-5': index !== 3,
                        });
                        return (
                            <div key={index} className={featureStyle}>
                                {feature.icon}
                                <p className='ml-2'>{feature.content}</p>
                            </div>
                        );
                    })}
                </div>
            </IconContext.Provider>
        </div>
    );

    const auctionBanner = (
        <div className='bg-neutral-900 text-white py-4 md:absolute md:w-1/3 md:right-0 md:bottom-0 px-3 md:rounded-t-md'>
            <h2 className='font-medium mb-2 md:text-[28px]'>Bid at auction</h2>
            <p className='text-xs leading-5 md:text-sm xl:text-md'>
                This is an auction. To bid on this property you must be
                registered. Have your drivers licence or photo ID ready.
            </p>
        </div>
    );

    const auctionInfoList = (
        <div className='shadow-md rounded-b-md overflow-hidden'>
            {auctionDetails}
        </div>
    );

    const propertyDescription = (
        <div
            className={classNames(
                'mt-5 pb-5 shadow-md rounded-b-md px-3 md:px-0 md:shadow-none',
                {
                    'border-b': !isSmallScreen,
                },
            )}
        >
            <h3 className='mb-5 font-medium md:text-2xl'>{heading}</h3>
            <p id='copyWriting' className={copyWritingStyle}>
                {copyWriting}
            </p>
            {showReadButton ? (
                <Button
                    onClick={handleReadButtonContent}
                    width='w-fit'
                    className='text-gray-500 mt-3'
                >
                    {readButtonContent}
                </Button>
            ) : (
                <></>
            )}
        </div>
    );

    const agentsAndAuctioneer = (
        <div className='md:bg-white rounded-md'>
            <div className='mt-5 pb-3 shadow-md rounded-b-md px-3 md:pt-5 md:shadow-none md:border-b md:rounded-none'>
                <h3 className='mb-5'>Listing Agent</h3>
                <PersonList person={agents} />
                <div>
                    <p className='my-1 font-medium xl:text-lg'>{agency.name}</p>
                    <div className='flex items-center'>
                        <div>
                            <IconContext.Provider
                                value={{
                                    size: '1.2rem',
                                    className: 'stroke-1 stroke-gray-500',
                                }}
                            >
                                <CiLocationOn />
                            </IconContext.Provider>
                        </div>
                        <p className='ml-3'>{agencyFullAddress}</p>
                    </div>
                </div>
            </div>
            <div className='mt-5 px-3 shadow-md rounded-b-md pb-3 md:pb-3'>
                <h3 className='mb-5'>Auctioneer</h3>
                <PersonList person={auctioneer} />
            </div>
        </div>
    );

    const enquiry = (
        <div
            className={classNames('px-3 py-5', {
                'bg-neutral-200 mt-5': !isSmallScreen,
            })}
        >
            <h3 className='mb-5'>Send an enquiry to the listing agent</h3>
            <EnquiryForm listingNumber={listingNumber as string} />
        </div>
    );

    if (isSmallScreen) {
        content = (
            <div className='flex flex-col'>
                {propertyInfo}
                {auctionBanner}
                {auctionInfoList}
                {propertyDescription}
                {agentsAndAuctioneer}
                {enquiry}
            </div>
        );
    } else {
        content = (
            <div className='mx-auto flex'>
                <div className='pr-3 w-2/3'>
                    {propertyInfo}
                    {propertyDescription}
                    {enquiry}
                </div>
                <div className='w-1/3'>
                    {auctionInfoList}
                    {agentsAndAuctioneer}
                </div>
            </div>
        );
    }

    return (
        <main className='bg-neutral-100 flex-1 pb-5'>
            <div
                className='bg-cover bg-center h-[45vh] max-h-80 relative'
                style={{ backgroundImage: `url('${mainPhotoUrl}')` }}
            >
                <SectionContainer className='px-0 mx-auto flex flex-col-reverse h-full relative'>
                    <Button
                        type='secondary'
                        height='h-8'
                        width='w-32'
                        onClick={() =>
                            updateOverLayContent(OVERLAY_CONTENTS.PHOTOS)
                        }
                        className='border-2 text-sm mb-4 mx-auto md:mx-0'
                    >
                        <IconContext.Provider
                            value={{
                                size: '1.2rem',
                                className: 'stroke-black',
                            }}
                        >
                            <IoCameraOutline />
                        </IconContext.Provider>
                        <p className='pl-3'>{photosBytes.length} Photos</p>
                    </Button>
                    {isSmallScreen ? <></> : auctionBanner}
                </SectionContainer>
            </div>
            <SectionContainer className='px-0 mx-auto'>{content}</SectionContainer>
            {overLayContent === OVERLAY_CONTENTS.PHOTOS && (
                <IconContext.Provider
                    value={{
                        color: 'white',
                        size: '1.8rem',
                        className: 'inline',
                    }}
                >
                    <OverLay className='text-white'>
                        <Photos photos={photosBytes} />
                    </OverLay>
                </IconContext.Provider>
            )}
        </main>
    );
}

export default Listing;

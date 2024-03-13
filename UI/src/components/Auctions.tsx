import { useEffect, useState } from 'react';
import SectionContainer from './SectionContainer';
import { IconContext } from 'react-icons';
import { FaPlus } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import Button from './Button';

interface ListingInfo {
    address: string;
    auctionDateTime: Date;
    agencyName: string;
    photoDataURL: string;
    listingNumber: number;
}

function Auctions() {
    const [listingsInfo, setListingsInfo] = useState<ListingInfo[]>([]);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BASE_URL}/Listing/Information`)
            .then((res) => res.json())
            .then((data) => setListingsInfo(data));
    }, []);

    const content = listingsInfo.map((listingInfo, index) => {
        const address = listingInfo.address;

        const routeFrag =
            address.split(', ').at(-1)?.replace(' ', '+') +
            '-' +
            listingInfo.listingNumber;

        const auctionDate = new Date(listingInfo.auctionDateTime);
        const options: Intl.DateTimeFormatOptions = {
            weekday: 'long',
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
        const formattedDate = time.concat(', ', date);

        const defaultOpacityTransition =
            'visible group-hover:invisible transition-opacity duration-500 opacity-100 group-hover:opacity-0';
        const overLayOpacityTransition =
            'invisible group-hover:visible transition-opacity duration-500 opacity-0 group-hover:opacity-100';
        const anchorStyle =
            'ml-auto cursor-pointer border-b border-transparent hover:border-green-500 self-center';

        return (
            <div
                className='group relative h-52 w-[315px] overflow-hidden rounded-md bg-cover text-white transition-width duration-0 ease-in-out md:w-[345px] lg:w-[294px] xl:w-[360px] xl:duration-500'
                style={{
                    backgroundImage: `url('${listingInfo.photoDataURL}')`,
                }}
                key={index}
            >
                <header
                    className={
                        'h-10 truncate bg-indigo-900 bg-opacity-70 px-5 py-2.5 text-sm ' +
                        defaultOpacityTransition
                    }
                >
                    {address}
                </header>
                <span
                    className={
                        'absolute bottom-2.5 right-2 bg-white px-2 py-1 font-medium text-black ' +
                        defaultOpacityTransition
                    }
                >
                    {listingInfo.agencyName}
                </span>
                <div
                    className={
                        'absolute inset-0 grid h-full grid-cols-2 grid-rows-6 bg-indigo-900 bg-opacity-70 p-5 pb-12 text-sm font-medium ' +
                        overLayOpacityTransition
                    }
                >
                    <p className='col-span-2 row-span-2 self-start text-green-500'>
                        {address}
                    </p>
                    <p className='col-span-2'>{formattedDate}</p>
                    <p className='col-span-2 text-green-500'>
                        {listingInfo.agencyName}
                    </p>
                    <p>Auction Listing</p>
                    <Link className={anchorStyle} to={`/listing/${routeFrag}`}>
                        VIEW
                    </Link>
                    <p>Register to BID</p>
                    <a className={'text-green-500'.concat(' ', anchorStyle)}>
                        OPEN
                    </a>
                </div>
            </div>
        );
    });

    return (
        <IconContext.Provider
            value={{ size: '1.2rem', className: 'stroke-[20]' }}
        >
            <SectionContainer header='Upcoming Auctions' className='px-7'>
                <div className='grid grid-cols-1 justify-items-center gap-y-4 md:grid-cols-2 md:gap-x-6 lg:grid-cols-3'>
                    {content}
                </div>
                <Button
                    height='h-10'
                    type='primary'
                    className='mx-auto my-5 md:w-10 md:rounded-full'
                    onClick={() => {}}
                >
                    <span className='md:hidden'>More</span>
                    <FaPlus className='hidden md:block' />
                </Button>
            </SectionContainer>
        </IconContext.Provider>
    );
}

export default Auctions;

import { IconContext } from 'react-icons';
import { FaPlus } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import Button from './Button';
import classNames from 'classnames';
import SectionContainer from './SectionContainer';
import { ListingInfo } from '../shared/Utils';
import { Dispatch, SetStateAction } from 'react';

interface Props {
    listingsInfo: ListingInfo[] | null;
    batchNumber: number;
    setBatchNumber: Dispatch<SetStateAction<number>>;
}

const recordsPerBatch = 6;

function Auctions(props: Props) {
    const { listingsInfo, batchNumber, setBatchNumber } = props;

    let content: JSX.Element[] | null = listingsInfo ? [] : null;
    if (listingsInfo && listingsInfo.length > 0) {
        content = listingsInfo
            .slice(0, batchNumber * recordsPerBatch)
            .map((listingInfo, index) => {
                const address = listingInfo.address;

                const routeFrag =
                    address.split(', ').at(-1)?.replaceAll(' ', '+') +
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
                    <figure
                        className='group relative h-52 w-[315px] overflow-hidden rounded-md bg-cover text-white transition-width duration-0 ease-in-out md:w-[345px] lg:w-[294px] xl:w-[360px] xl:duration-500'
                        style={{
                            backgroundImage: `url('${listingInfo.photoDataURL}')`,
                        }}
                        key={index}
                    >
                        <figcaption
                            className={classNames(
                                'h-10 truncate bg-indigo-900 bg-opacity-70 px-5 py-2.5 text-sm',
                                defaultOpacityTransition,
                            )}
                        >
                            {address}
                        </figcaption>
                        <span
                            className={classNames(
                                'absolute bottom-2.5 right-2 bg-white px-2 py-1 font-medium text-black',
                                defaultOpacityTransition,
                            )}
                        >
                            {listingInfo.agencyName}
                        </span>
                        <div
                            className={classNames(
                                'absolute inset-0 grid h-full grid-cols-2 grid-rows-6 bg-indigo-900 bg-opacity-70 p-5 pb-12 text-sm font-medium',
                                overLayOpacityTransition,
                            )}
                        >
                            <p className='col-span-2 row-span-2 self-start text-green-500'>
                                {address}
                            </p>
                            <time
                                className='col-span-2'
                                dateTime={auctionDate.toISOString()}
                            >
                                {formattedDate}
                            </time>
                            <p className='col-span-2 text-green-500'>
                                {listingInfo.agencyName}
                            </p>
                            <p>Auction Listing</p>
                            <Link
                                className={anchorStyle}
                                to={`/listing/${routeFrag}`}
                            >
                                VIEW
                            </Link>
                            <p>Register to BID</p>
                            <a
                                className={classNames(
                                    'text-green-500',
                                    anchorStyle,
                                )}
                            >
                                OPEN
                            </a>
                        </div>
                    </figure>
                );
            });
    }

    function loadMore() {
        const newBatchNumber = batchNumber + 1;
        setBatchNumber(newBatchNumber);
    }

    const isLastBatch = !(listingsInfo && 
        listingsInfo.length - batchNumber * recordsPerBatch >
        0
    );

    return (
        <SectionContainer
            header='Upcoming Auctions'
            className='px-3 md:px-0 md:mb-9 mb-3'
        >
            {content ? ( content.length > 0 ?
                <>
                    <div
                        className={classNames(
                            'grid grid-cols-1 justify-items-center gap-y-4 md:grid-cols-2 md:gap-x-6 lg:grid-cols-3 mb-4',
                        )}
                    >
                        {content}
                    </div>
                    {!isLastBatch && (
                        <Button
                            height='h-10'
                            primary
                            className='mx-auto my-5 md:w-10 md:rounded-full'
                            onClick={loadMore}
                        >
                            <span className='md:hidden'>More</span>
                            <IconContext.Provider
                                value={{
                                    size: '1.2rem',
                                    className: 'stroke-[20]',
                                }}
                            >
                                <FaPlus className='hidden md:block' />
                            </IconContext.Provider>
                        </Button>
                    )}
                </> : <h4 className='my-10 text-center'>
                    No auctions matching the search criteria were found.
                </h4>
            ) : (
                <></>
            )}
        </SectionContainer>
    );
}

export default Auctions;

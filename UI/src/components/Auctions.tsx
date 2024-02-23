import { useEffect, useState } from "react";
import SectionContainer from "./SectionContainer";
import { IconContext } from "react-icons";
import { FaPlus } from "react-icons/fa6";
import { STATE } from "./Constants";
import { Link } from 'react-router-dom'

export interface FullAddress {
    unitNumber: string;
    streetNumber: string;
    street: string;
    suburb: string;
    postCode: string;
    state: keyof typeof STATE;
}

interface ListingInfo {
    address: FullAddress;
    auctionDateTime: Date;
    agencyName: string;
    photoDataURL: string;
    listingNumber: number;
}

function Auctions() {
    const [listingsInfo, setListingsInfo] = useState<ListingInfo[]>([])

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BASE_URL}/Listing/Information`)
            .then(res => res.json())
            .then(data => setListingsInfo(data))
    }, [])
    // const cards = [{
    //     unitNumber: null,
    //     streetNumber: 28,
    //     street: 'Meihua Street',
    //     suburb: 'Huayuanli Meihuayuan District',
    //     auctionDate: '2024-02-24 11:00',
    //     agency: 'Bid Now Agency',
    //     agencyLogo: '',
    //     mainPhoto: 'h1.jpeg',
    //     agents: [{
    //         name: 'First Agent',
    //         email: 'firstagent@bidnow.com.au',
    //         mobile: '0412341234',
    //         portrait: 'portrait1.jpeg'
    //     }, {
    //         name: 'Second Agent',
    //         email: 'secondagent@bidnow.com.au',
    //         mobile: '0443214321',
    //         portrait: 'portrait2.jpeg'
    //     }]
    // }, {
    //     unitNumber: 1,
    //     streetNumber: 14,
    //     street: 'Meihua Street',
    //     suburb: 'Huayuan',
    //     auctionDate: '10:00 2024-02-17',
    //     agency: 'BN Agency',
    //     agencyLogo: '',
    //     mainPhoto: 'th1.jpeg',
    //     agents: [{
    //         name: 'Third Agent',
    //         email: 'thirdagent@bidnow.com.au',
    //         mobile: '0412121212',
    //         portrait: 'portrait3.jpeg'
    //     }]
    // }, {
    //     unitNumber: 1,
    //     streetNumber: 14,
    //     street: 'Meihua Street',
    //     suburb: 'Huayuan',
    //     auctionDate: '14:00 2024-02-17',
    //     agency: 'BN Agency',
    //     agencyLogo: '',
    //     mainPhoto: 'th1.jpeg',
    //     agents: [{
    //         name: 'Third Agent',
    //         email: 'thirdagent@bidnow.com.au',
    //         mobile: '0412121212',
    //         portrait: 'portrait3.jpeg'
    //     }]
    // }, {
    //     unitNumber: 1,
    //     streetNumber: 14,
    //     street: 'Meihua Street',
    //     suburb: 'Huayuan',
    //     auctionDate: '14:00 2024-02-17',
    //     agency: 'BN Agency',
    //     agencyLogo: '',
    //     mainPhoto: 'th1.jpeg',
    //     agents: [{
    //         name: 'Third Agent',
    //         email: 'thirdagent@bidnow.com.au',
    //         mobile: '0412121212',
    //         portrait: 'portrait3.jpeg'
    //     }]
    // }, {
    //     unitNumber: 1,
    //     streetNumber: 14,
    //     street: 'Meihua Street',
    //     suburb: 'Huayuan',
    //     auctionDate: '14:00 2024-02-17',
    //     agency: 'BN Agency',
    //     agencyLogo: '',
    //     mainPhoto: 'th1.jpeg',
    //     agents: [{
    //         name: 'Third Agent',
    //         email: 'thirdagent@bidnow.com.au',
    //         mobile: '0412121212',
    //         portrait: 'portrait3.jpeg'
    //     }]
    // }, {
    //     unitNumber: 1,
    //     streetNumber: 14,
    //     street: 'Meihua Street',
    //     suburb: 'Huayuan',
    //     auctionDate: '14:00 2024-02-17',
    //     agency: 'BN Agency',
    //     agencyLogo: '',
    //     mainPhoto: 'th1.jpeg',
    //     agents: [{
    //         name: 'Third Agent',
    //         email: 'thirdagent@bidnow.com.au',
    //         mobile: '0412121212',
    //         portrait: 'portrait3.jpeg'
    //     }]
    // }, {
    //     unitNumber: 1,
    //     streetNumber: 14,
    //     street: 'Meihua Street',
    //     suburb: 'Huayuan',
    //     auctionDate: '14:00 2024-02-17',
    //     agency: 'BN Agency',
    //     agencyLogo: '',
    //     mainPhoto: 'th1.jpeg',
    //     agents: [{
    //         name: 'Third Agent',
    //         email: 'thirdagent@bidnow.com.au',
    //         mobile: '0412121212',
    //         portrait: 'portrait3.jpeg'
    //     }]
    // }]

    const content = listingsInfo.map((listingInfo, index) => {
        const address = listingInfo.address
        let fullAddress = address.streetNumber + ' ' + address.street + ', ' + address.suburb
        const routeFrag = address.suburb.replace(' ', '+') + '-' + address.state + '-' + listingInfo.listingNumber
        if (address.unitNumber) {
            fullAddress = address.unitNumber + '/' + fullAddress
        }

        const auctionDate = new Date(listingInfo.auctionDateTime)
        const options: Intl.DateTimeFormatOptions = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour12: true,
            hour: "numeric",
            minute: "numeric",
        }
        const dateTimeStrings = auctionDate.toLocaleDateString(undefined, options).replace(',', '').split(' at ')
        const time = dateTimeStrings[1].replace(' ', '')
        const date = dateTimeStrings[0]
        const formattedDate = time + ', ' + date

        const defaultOpacityTransition = 'visible group-hover:invisible transition-opacity duration-500 opacity-100 group-hover:opacity-0'
        const overLayOpacityTransition = 'invisible group-hover:visible transition-opacity duration-500 opacity-0 group-hover:opacity-100'
        const anchorStyle = 'ml-auto hover:cursor-pointer border-b border-transparent hover:border-green-500 self-center'

        return (
            <div className="transition-width duration-0 xl:duration-500 ease-in-out w-[315px] h-52 relative md:w-[345px] lg:w-[294px] xl:w-[360px] overflow-hidden group rounded-md text-white bg-cover" style={{ backgroundImage: `url('${listingInfo.photoDataURL}')`}} key={index}>
                <header className={'bg-indigo-900 bg-opacity-70 h-10 px-5 py-2.5 text-sm truncate ' + defaultOpacityTransition}>{fullAddress}</header>
                <span className={"bg-white font-medium px-2 py-1 absolute bottom-2.5 right-2 text-black " + defaultOpacityTransition}>{listingInfo.agencyName}</span>
                <div className={"absolute inset-0 grid grid-rows-6 grid-cols-2 bg-indigo-900 bg-opacity-70 text-sm font-medium h-full p-5 pb-12 " + overLayOpacityTransition}>
                    <p className="text-green-500 col-span-2 row-span-2 self-start">{fullAddress}</p>
                    <p className="col-span-2">{formattedDate}</p>
                    <p className="text-green-500 col-span-2">{listingInfo.agencyName}</p>
                    <p>Auction Listing</p>
                    <Link className={anchorStyle} to={`/listing/${routeFrag}`}>VIEW</Link>
                    <p>Register to BID</p>
                    <a className={"text-green-500 " + anchorStyle}>OPEN</a>
                </div>
            </div>
        )
    })

    return (
        <IconContext.Provider value={{ color: 'white', size: '1.2rem', className: 'inline stroke-[20]' }}>
            <SectionContainer header='Upcoming Auctions'>
                <div className="grid grid-cols-1 justify-items-center gap-y-4 md:gap-x-6 md:grid-cols-2 lg:grid-cols-3">{content}</div>
                <button className="block mx-auto my-5 bg-green-500 rounded-full w-10 h-10" onClick={() => { }}><FaPlus /></button>
            </SectionContainer>
        </IconContext.Provider >
    )
}

export default Auctions
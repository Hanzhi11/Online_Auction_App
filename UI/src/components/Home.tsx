import Search from './Search';
import Auctions from './Auctions';
import { useEffect, useState } from 'react';
import { ListingInfo } from '../shared/Utils';

function Home() {
    const [listingsInfo, setListingsInfo] = useState<ListingInfo[]>([]);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BASE_URL}/Listing/Information`)
            .then((res) => res.json())
            .then((data) => setListingsInfo(data));
    }, []);

    return (
        <>
            <Search setListingsInfo={setListingsInfo}/>
            <Auctions listingsInfo={listingsInfo}/>
        </>
    );
}

export default Home;

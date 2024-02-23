import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FullAddress } from "./Auctions";
import { IoCameraOutline } from "react-icons/io5";
import { IconContext } from "react-icons";
import Button from "./Button";
import { GiHouse } from "react-icons/gi";
import { FaBath, FaBed, FaCar } from "react-icons/fa";
import { RxDimensions } from "react-icons/rx";
import { FiCalendar } from "react-icons/fi";
import { CiLocationOn } from "react-icons/ci";
import className from "classnames";

interface Agent {
    fullName: string;
    email: string;
    mobile: string;
    portraitBytes: ArrayBuffer;
}

interface Details {
    address: FullAddress;
    agency: {
        name: string;
        address: FullAddress;
    };
    agents: Agent[];
    auctionDateTime: Date;
    auctioneer: {
        fullName: string;
        licenceNumber: string;
    };
    bedNumber: number;
    bathNumber: number;
    garageNumber: number;
    copyWritting: string;
    heading: string;
    photosBytes: ArrayBuffer[];
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

function Listing() {
    const [details, setDetails] = useState<Details>();
    const { id } = useParams();
    const listingNumber = id?.split("-").at(-1);

    useEffect(() => {
        fetch(
            `${import.meta.env.VITE_BASE_URL}/Listing/Details/${listingNumber}`
        )
            .then((res) => res.json())
            .then((data) => setDetails(data));
    }, [listingNumber]);

    if (!details) {
        return;
    }

    const {
        photosBytes,
        agency,
        address,
        propertyType,
        bedNumber,
        bathNumber,
        garageNumber,
        auctionDateTime,
    } = details;
    console.log(details);

    let fullAddress =
        address.streetNumber +
        " " +
        address.street +
        ", " +
        address.suburb +
        ", " +
        address.state +
        " " +
        address.postCode;
    if (address.unitNumber) {
        fullAddress = address.unitNumber + "/" + fullAddress;
    }

    const mainPhotoUrl = `data:image/jpeg;base64,${photosBytes[0]}`;

    let propertyTypeIcon = PROPERTYICONS.HOME;
    if (propertyType === "Land") {
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
        year: "numeric",
        month: "long",
        day: "numeric",
        hour12: true,
        hour: "numeric",
        minute: "numeric",
    };
    const dateTimeStrings = auctionDate
        .toLocaleDateString(undefined, options)
        .replace(",", "")
        .split(" at ");
    const time = dateTimeStrings[1].replace(" ", "");
    const date = dateTimeStrings[0];
    const formattedDate = date + " - " + time.toUpperCase();

    const auctionInfo = [
        {
            icon: (
                <IconContext.Provider
                    value={{
                        size: "1.6rem",
                        className: "stroke-gray-500",
                    }}
                >
                    <FiCalendar className="inline mr-3" />
                </IconContext.Provider>
            ),
            content: formattedDate,
        },
        {
            icon: (
                <IconContext.Provider
                    value={{
                        size: "1.6rem",
                        className: "stroke-1 stroke-gray-500",
                    }}
                >
                    <CiLocationOn className="inline mr-3" />
                </IconContext.Provider>
            ),
            content: fullAddress,
            note: "ONSITE AND ONLINE",
        },
    ];

    return (
        <main className="bg-neutral-100">
            <div
                className="bg-cover bg-center h-[45vh] max-h-80 relative"
                style={{ backgroundImage: `url('${mainPhotoUrl}')` }}
            >
                <p className="p-1 bg-white w-fit">{agency.name}</p>
                <Button
                    type="secondary"
                    height="h-8"
                    width="w-32"
                    onClick={() => {}}
                    classNames="border-2 text-sm absolute bottom-4 left-1/2 -translate-x-2/4"
                >
                    <IconContext.Provider
                        value={{ size: "1.2rem", className: "stroke-black" }}
                    >
                        <IoCameraOutline />
                    </IconContext.Provider>
                    <p className="pl-3">{photosBytes.length} Photos</p>
                </Button>
            </div>
            <p className="font-medium mb-1 mt-5 pl-3">{fullAddress}</p>
            <IconContext.Provider
                value={{
                    size: "1rem",
                    className: "stroke-black fill-gray-500",
                }}
            >
                <div className="flex text-sm text-gray-500 pl-3">
                    {features.map((feature, index) => {
                        const featureStyle = className("flex items-center", {
                            "mr-5": index !== 3,
                        });
                        return (
                            <div key={index} className={featureStyle}>
                                {feature.icon}
                                <span className="pl-2">{feature.content}</span>
                            </div>
                        );
                    })}
                </div>
            </IconContext.Provider>
            <section className="mt-5 border shadow-sm">
                <div className="bg-neutral-900 text-white py-4 px-3">
                    <h1 className="text-2xl font-medium mb-2">
                        Bid at auction
                    </h1>
                    <p className="text-xs leading-5">
                        This is an auction. To bid on this property you must be
                        registered. Have your drivers licence or photo ID ready.
                    </p>
                </div>
                <div>
                    {auctionInfo.map((info, index) => {
                        return (
                            <div
                                key={index}
                                className="flex mx-2 items-center py-4 first-of-type:border-b"
                            >
                                {info.icon}
                                <div>
                                    <p className="mb-0.5">{info.content}</p>
                                    {info.note && (
                                        <p className="text-gray-400 text-xs">
                                            {info.note}
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
        
        </main>
    );
}

export default Listing;

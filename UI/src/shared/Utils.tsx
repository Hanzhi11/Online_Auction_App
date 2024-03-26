import { CountryCode } from "libphonenumber-js";
import { ELEMENT_ID } from "./Constants";

export function scrollCountryDropdown(
    country: CountryCode,
    countryDropdown: HTMLUListElement,
) {
    const countryLi = document.querySelector(
        `#${ELEMENT_ID.COUNTRY_DROP_DOWN} > #${country}`,
    ) as HTMLLIElement;

    if (
        countryLi.offsetTop - countryDropdown.scrollTop < 0 ||
        countryLi.offsetTop +
            countryLi.offsetHeight -
            countryDropdown.scrollTop >
            countryDropdown.clientHeight
    ) {
        countryLi.scrollIntoView({
            behavior: 'instant',
            block: 'nearest',
        });
    }
}

export interface ListingInfo {
    address: string;
    auctionDateTime: Date;
    agencyName: string;
    photoDataURL: string;
    listingNumber: number;
}
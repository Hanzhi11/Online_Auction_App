import en from 'react-phone-number-input/locale/en';
import {
    Ref,
    forwardRef,
    useEffect,
    MouseEvent,
    useState,
    RefObject,
    useMemo,
} from 'react';
import {
    getCountries,
    getCountryCallingCode,
    CountryCode,
} from 'libphonenumber-js';
import { ELEMENT_ID } from './Constants';
import classNames from 'classnames';

interface Props {
    onChange: (value: CountryCode) => void;
    openDropDown: (value: boolean) => void;
    height: number;
    top: number;
    country: CountryCode;
}

function sortFunction(a: [CountryCode, string], b: [CountryCode, string]) {
    if (a[1] > b[1]) return 1;
    if (a[1] < b[1]) return -1;
    return 0;
}

type Country = [CountryCode, string];

const backgroundColor = 'bg-green-500';

export default forwardRef<HTMLUListElement, Props>(function CountryDropdown(
    props: Props,
    ref: Ref<HTMLUListElement>,
) {
    const { onChange, openDropDown, height, top } = props;
    const [searchTerm, setSearchTerm] = useState('');
    const [focusedCountry, setFocusedCountry] = useState<CountryCode | null>(
        props.country,
    );

    const countries: Country[] = useMemo(() => {
        const countries: Country[] = [];
        const countriesRetrived = getCountries();
        Object.entries(en).forEach((item) => {
            const code = item[0] as CountryCode;
            const name = item[1];

            if (name !== 'Åland Islands' && countriesRetrived.includes(code)) {
                countries.push([code, name]);
            }
        });
        countries.sort(sortFunction);
        return countries;
    }, []);

    function handleCountrySelection(event: MouseEvent<HTMLElement>) {
        onChange(event.currentTarget.id as CountryCode);
        openDropDown(false);
    }

    function handleMouseOver(event: MouseEvent<HTMLElement>) {
        setFocusedCountry(event.currentTarget.id as CountryCode);
    }

    function handleMouseOut () {
        setFocusedCountry(null);
    }

    useEffect(() => {
        function handleKeyUp(e: KeyboardEvent) {
            const countryDropdown = (ref as RefObject<HTMLUListElement>)
                .current;
            if (!countryDropdown) return;

            const key = e.key.toUpperCase();
            if (key.match(/[A-Z]/g)) {
                setSearchTerm((searchTerm) => {
                    return searchTerm.concat(key);
                });
            }

            if (key === 'ENTER') {
                if (focusedCountry) {
                    onChange(focusedCountry);
                }
                openDropDown(false);
            }
        }
        window.addEventListener('keyup', handleKeyUp);

        return () => window.removeEventListener('keyup', handleKeyUp);
    }, [ref, onChange, openDropDown, focusedCountry]);

    useEffect(() => {
        const greenCountry = document.querySelector(
            `#${ELEMENT_ID.COUNTRY_DROP_DOWN} > .${backgroundColor}`,
        );
        if (greenCountry) {
            greenCountry.scrollIntoView(true);
        }
    }, []);

    useEffect(() => {
        if (searchTerm.length === 0) return;
        const timeout = setTimeout(() => {
            const regex = new RegExp(`^${searchTerm}`);
            const targetCountry = countries.find((item) =>
                regex.test(item[1].toUpperCase()),
            );

            if (targetCountry) {
                setFocusedCountry(targetCountry[0]);
            } else {
                setFocusedCountry(null);
            }

            setSearchTerm('');
        }, 300);

        return () => {
            clearTimeout(timeout);
        };
    }, [searchTerm, ref, countries]);

    useEffect(() => {
        const countryDropdown = (ref as RefObject<HTMLUListElement>).current;
        if (!countryDropdown || !focusedCountry) return;

        const countryLi = document.querySelector(
            `#${ELEMENT_ID.COUNTRY_DROP_DOWN} > #${focusedCountry}`,
        ) as HTMLLIElement;
        if (countryLi.offsetTop - countryDropdown.scrollTop < 0) {
            countryLi.scrollIntoView(true);
        }

        if (
            countryLi.offsetTop + countryLi.offsetHeight - countryLi.scrollTop >
            countryDropdown.clientHeight
        ) {
            countryLi.scrollIntoView({ block: 'nearest', inline: 'nearest' });
        }
    }, [ref, focusedCountry]);

    return (
        <ul
            className='absolute bg-white overflow-y-scroll border'
            id={ELEMENT_ID.COUNTRY_DROP_DOWN}
            ref={ref}
            style={{ height: height, top: top }}
        >
            {countries.map((country) => {
                const liStyle = classNames(
                    'flex gap-x-3 mb-1 px-3 items-center rounded-md last-of-type:mb-0',
                    {
                        [backgroundColor]: country[0] === focusedCountry,
                    },
                );
                return (
                    <li
                        className={liStyle}
                        key={country[0]}
                        onClick={handleCountrySelection}
                        id={country[0]}
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                    >
                        <img
                            src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${country[0]}.svg`}
                            className='h-4'
                        />
                        <span>{country[1]}</span>
                        <span>+{getCountryCallingCode(country[0])}</span>
                    </li>
                );
            })}
        </ul>
    );
});

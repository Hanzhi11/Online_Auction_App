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
import { ELEMENT_ID } from '../shared/Constants';
import classNames from 'classnames';
import { scrollCountryDropdown } from '../shared/Utils';

interface Props {
    onChange: (value: CountryCode) => void;
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
    const { onChange } = props;
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
        const countryDropdown = (ref as RefObject<HTMLUListElement>)
            .current as HTMLUListElement;
        countryDropdown.classList.add('hidden');
    }

    function handleMouseOver(event: MouseEvent<HTMLElement>) {
        const countryDropdown = (ref as RefObject<HTMLUListElement>)
            .current as HTMLUListElement;
        const isHidden = countryDropdown.classList.contains('hidden');
        if (!isHidden) setFocusedCountry(event.currentTarget.id as CountryCode);
    }

    function handleMouseOut() {
        const countryDropdown = (ref as RefObject<HTMLUListElement>)
            .current as HTMLUListElement;
        const isHidden = countryDropdown.classList.contains('hidden');
        if (!isHidden) setFocusedCountry(null);
    }

    useEffect(() => {
        function handleKeyUp(e: KeyboardEvent) {
            const countryDropdown = (ref as RefObject<HTMLUListElement>)
                .current as HTMLUListElement;
            if (countryDropdown.classList.contains('hidden')) return;

            const key = e.key.toUpperCase();
            console.log('key', key);

            if (key === 'ENTER') {
                if (focusedCountry) {
                    onChange(focusedCountry);
                } else {
                    setFocusedCountry(props.country);
                }

                countryDropdown.classList.add('hidden');
            } else if (key.match(/[A-Z]/) && key.length === 1) {
                setSearchTerm((searchTerm) => {
                    return searchTerm.concat(key);
                });
            }
        }
        window.addEventListener('keyup', handleKeyUp);

        return () => window.removeEventListener('keyup', handleKeyUp);
    }, [ref, onChange, focusedCountry, props.country]);

    useEffect(() => {
        if (searchTerm.length === 0) return;
        const timeout = setTimeout(() => {
            const regex = new RegExp(`^${searchTerm}`);
            const targetCountry = countries.find((item) =>
                regex.test(item[1].toUpperCase()),
            );

            console.log(searchTerm, targetCountry);

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
        const countryDropdown = (ref as RefObject<HTMLUListElement>)
            .current as HTMLUListElement;
        if (!focusedCountry) return;
        scrollCountryDropdown(focusedCountry, countryDropdown);
    }, [focusedCountry, ref]);

    const height = 284;
    const top = -height;

    // using 'hidden' to hide the dropdown rather then using state
    // because the wrapped country name will result in a wrong offsetTop to the li elements afterwards
    // after the initial render
    return (
        <ul
            className='absolute bg-white overflow-y-scroll border w-full hidden'
            id={ELEMENT_ID.COUNTRY_DROP_DOWN}
            ref={ref}
            style={{ height: height, top: top }}
        >
            {countries.map((country) => {
                const liStyle = classNames(
                    'flex items-center gap-x-3 mb-1 px-3 rounded-md last-of-type:mb-0',
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
                            className='h-4 lg:h-3'
                        />
                        <p className='lg:text-sm'>{country[1]}</p>
                        <p className='lg:text-sm'>
                            +{getCountryCallingCode(country[0])}
                        </p>
                    </li>
                );
            })}
        </ul>
    );
});

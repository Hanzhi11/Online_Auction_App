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
import classNames from 'classnames';
import { ELEMENT_ID } from './Constants';

interface Props {
    onChange: (value: CountryCode) => void;
}

function sortFunction(a: [CountryCode, string], b: [CountryCode, string]) {
    if (a[1] > b[1]) return 1
    if (a[1] < b[1]) return -1
    return 0
}

type Country = [CountryCode, string];

const backgroundColor = 'bg-green-500';

export default forwardRef<HTMLUListElement, Props>(function CountryDropdown(
    props: Props,
    ref: Ref<HTMLUListElement>,
) {
    const { onChange } = props;
    const [searchTerm, setSearchTerm] = useState('');

    const countries: Country[] = useMemo(() => {
        const countries: Country[] = []
        const countriesRetrived = getCountries()
        Object.entries(en).forEach(item => {
            const code = item[0] as CountryCode
            const name = item[1]
            
            if (name!== 'Åland Islands' && countriesRetrived.includes(code)){
                countries.push([code, name])
            }
        })
        countries.sort(sortFunction)
        return countries
    }, [])

    useEffect(() => {
        const countryDropdown = (ref as RefObject<HTMLUListElement>).current;
        if (!countryDropdown) return;
        if (countryDropdown) {
            const rect = countryDropdown.getBoundingClientRect();
            const viewportHeight = document.documentElement.clientHeight;
            const distance = viewportHeight - rect.top;
            console.log(distance);
        }
    }, [ref]);

    const style = classNames(
        'absolute bg-white overflow-y-scroll h-[284px] hidden border',
        {
            'top-[41px]': true,
        },
    );

    function handleCountrySelection(event: MouseEvent<HTMLElement>) {
        const target = event.target as HTMLElement;

        let liElement = target;

        if (target.tagName !== 'LI') {
            liElement = target.closest('li') as HTMLElement;
        }

        onChange(liElement.id as CountryCode);
    }

    useEffect(() => {
        function handleKeyUp(e: KeyboardEvent) {
            const countryDropdown = (ref as RefObject<HTMLUListElement>)
                .current;
            if (!countryDropdown) return;
            const isHidden = countryDropdown.classList.contains('hidden');
            if (isHidden) return;

            const key = e.key.toUpperCase();
            if (key.match(/[A-Z]/g)) {
                setSearchTerm((searchTerm) => {
                    return searchTerm.concat(key);
                });
            }

            if(key === 'ENTER'){
                const greenCountry = document.querySelector(
                    `#${ELEMENT_ID.COUNTRY_DROP_DOWN} > .${backgroundColor}`,
                );
                if (greenCountry) {
                    onChange(greenCountry.id as CountryCode)
                    countryDropdown.scrollTop = 0;
                    countryDropdown.classList.add('hidden')
                }

            }
        }
        window.addEventListener('keyup', handleKeyUp);

        return () => window.removeEventListener('keyup', handleKeyUp);
    }, [ref, onChange]);

    useEffect(() => {
        const countryDropdown = (ref as RefObject<HTMLUListElement>).current;
        if (!countryDropdown) return;

        const handleMouseOver = (event: Event) => {
            let target = event.target as HTMLElement;
            if (target === countryDropdown) return;
            if (target.tagName !== 'LI') {
                target = target.closest('li') as HTMLElement;
            }
            const greenCountry = document.querySelector(
                `#${ELEMENT_ID.COUNTRY_DROP_DOWN} > .${backgroundColor}`,
            );
            if (greenCountry) {
                greenCountry.classList.remove(backgroundColor);
            }
            target.classList.add(backgroundColor);
        };

        const handleMouseOut = (e: Event) => {
            let target = e.target as HTMLElement;
            if (target === countryDropdown) return;
            if (target.tagName !== 'LI') {
                target = target.closest('li') as HTMLElement;
            }

            target.classList.remove(backgroundColor);
        };

        const handleClick = () => {
            countryDropdown.scrollTop = 0
            countryDropdown.classList.add('hidden')
        }

        countryDropdown.addEventListener('mouseover', handleMouseOver);
        countryDropdown.addEventListener('mouseout', handleMouseOut);
        countryDropdown.addEventListener('click', handleClick);

        return () => {
            countryDropdown.removeEventListener('mouseover', handleMouseOver);
            countryDropdown.addEventListener('mouseout', handleMouseOut);
            countryDropdown.addEventListener('click', handleClick);

        };
    }, [ref]);

    useEffect(() => {
        if (searchTerm.length === 0) return;
        const timeout = setTimeout(() => {
            const regex = new RegExp(`^${searchTerm}`);
            console.log(searchTerm)
            const targetCountry = countries.find((item) =>
                regex.test(item[1].toUpperCase()),
            );
            
            const greenCountry = document.querySelector(
                `#${ELEMENT_ID.COUNTRY_DROP_DOWN} > .${backgroundColor}`,
            );
            if (greenCountry) {
                greenCountry.classList.remove(backgroundColor);
            }

            if (targetCountry) {
                const countryLi = document.querySelector(
                    `#${targetCountry[0]}`,
                ) as HTMLLIElement;

                countryLi.classList.add(backgroundColor);

                const countryDropdown = (ref as RefObject<HTMLUListElement>)
                    .current;
                if (!countryDropdown) return;
                if (countryLi.offsetTop + countryLi.offsetHeight > 281) {
                    countryDropdown.scrollTop =
                        countryLi.offsetTop + countryLi.offsetHeight - 281;
                }
            }

            setSearchTerm('');
        }, 500);

        return () => {
            clearTimeout(timeout);
        };
    }, [searchTerm, ref, countries]);

    return (
        <ul className={style} id={ELEMENT_ID.COUNTRY_DROP_DOWN} ref={ref}>
            {countries.map((country) => {
                return (
                    <li
                        className='flex gap-x-3 mb-1 px-3 items-center rounded-md last-of-type:mb-0'
                        key={country[0]}
                        onClick={handleCountrySelection}
                        id={country[0]}
                    >
                        <img
                            alt='United States'
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

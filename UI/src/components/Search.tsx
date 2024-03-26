import { IconContext } from 'react-icons';
import { IoIosArrowForward } from 'react-icons/io';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Dispatch, useState, SetStateAction } from 'react';
import classNames from 'classnames';
import Button from './Button';
import SectionContainer from './SectionContainer';
import { ListingInfo } from '../shared/Utils';

type StartDate = Date | null;

const MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

const STATE_OPTIONS = [
    'All State',
    'Australian Capital Territory',
    'New South Wales',
    'Northern Territory',
    'Queensland',
    'South Australia',
    'Tasmania',
    'Victoria',
    'Western Australia',
];

interface Props {
    setListingsInfo: Dispatch<SetStateAction<ListingInfo[]>>;
    setBatchNumber: Dispatch<SetStateAction<number>>;
}

function Search(props: Props) {
    const { setListingsInfo, setBatchNumber } = props;

    const [address, setAddress] = useState<string>('');
    const [selectedState, setSelectedState] = useState<string>(
        STATE_OPTIONS[0],
    );
    const [startDate, setStartDate] = useState<StartDate>(null);

    const sharedInputStyle = classNames(
        'bg-stone-200 border-0 rounded-md bg-focus:ring-2 focus:ring-inset focus:ring-green-500',
    );

    const handleOnChange = (event: React.ChangeEvent<HTMLElement>) => {
        const tagName = event.target.tagName;
        const target = event.target as HTMLInputElement | HTMLSelectElement;
        const value = target.value;

        switch (tagName) {
            case 'INPUT':
                setAddress(value);
                break;
            case 'SELECT':
                setSelectedState(value);
                break;
        }
    };

    const handleSubmit = () => {
        let url = `${import.meta.env.VITE_BASE_URL}/Listing/Information`;
        const params = [];
        if (address) {
            params.push(`Address=${address.replaceAll(' ', '_')}`);
        }
        if (startDate) {
            console.log(startDate.toISOString())
            params.push(`Date=${startDate.toISOString()}`);
        }
        if (selectedState !== STATE_OPTIONS[0]) {
            let state = '';
            switch (selectedState) {
                case STATE_OPTIONS[1]:
                    state = 'ACT';
                    break;
                case STATE_OPTIONS[2]:
                    state = 'NSW';
                    break;
                case STATE_OPTIONS[3]:
                    state = 'NT';
                    break;
                case STATE_OPTIONS[4]:
                    state = 'QLD';
                    break;
                case STATE_OPTIONS[5]:
                    state = 'SA';
                    break;
                case STATE_OPTIONS[6]:
                    state = 'TAS';
                    break;
                case STATE_OPTIONS[7]:
                    state = 'VIC';
                    break;
                case STATE_OPTIONS[8]:
                    state = 'WA';
                    break;
            }
            params.push(`State=${state}`);
        }
        if (params.length !== 0) {
            url = url + '?' + params.join('&');
        }

        console.log(url)
        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                setListingsInfo(data);
                setAddress('')
                setSelectedState(STATE_OPTIONS[0])
                setStartDate(null)
                setBatchNumber(1)
            });
    };

    return (
        <IconContext.Provider
            value={{
                color: 'white',
                size: '1.2rem',
                className: 'inline stroke-[20]',
            }}
        >
            <SectionContainer header='Property Search' className='px-3 md:px-0'>
                <search className='flex flex-col md:h-10 md:flex-row'>
                    <input
                        type='text'
                        placeholder='Address'
                        autoComplete='address-input'
                        value={address}
                        onChange={handleOnChange}
                        className={
                            'flex-1 mb-4 pl-2 md:w-4/12 md:mr-6 md:mb-0 ' +
                            sharedInputStyle
                        }
                    />
                    <select
                        id='state'
                        name='state'
                        autoComplete='state-name'
                        value={selectedState}
                        onChange={handleOnChange}
                        className={
                            'mb-4 h-10 pl-1 md:w-3/12 md:mr-6 md:mb-0 ' +
                            sharedInputStyle
                        }
                    >
                        {STATE_OPTIONS.map((state, index) => {
                            return <option key={index}>{state}</option>;
                        })}
                    </select>
                    <DatePicker
                        placeholderText='Date'
                        dateFormat='dd/MM/yyyy'
                        minDate={new Date()}
                        selected={startDate}
                        onChange={(date: StartDate) => setStartDate(date)}
                        wrapperClassName='mb-4 md:w-3/12 md:mb-0'
                        className={'w-full h-10 pl-2'.concat(
                            ' ',
                            sharedInputStyle,
                        )}
                        calendarClassName='font-light font-sans'
                        dayClassName={(date) => {
                            if (
                                !startDate &&
                                date.getTime() ===
                                    new Date().setHours(0, 0, 0, 0)
                            ) {
                                return 'bg-white';
                            }
                            if (date.getTime() == startDate?.getTime()) {
                                return 'bg-green-500';
                            }
                            return 'bg-white hover:bg-slate-200';
                        }}
                        weekDayClassName={() => {
                            return 'font-normal';
                        }}
                        renderCustomHeader={({
                            date,
                            decreaseMonth,
                            increaseMonth,
                            prevMonthButtonDisabled,
                            nextMonthButtonDisabled,
                        }) => (
                            <div className='grid grid-cols-4 grid-rows-1'>
                                {prevMonthButtonDisabled ? (
                                    <div></div>
                                ) : (
                                    <button
                                        className='text-xl text-left px-4'
                                        onClick={(event) => {
                                            event.preventDefault();
                                            decreaseMonth();
                                        }}
                                        disabled={prevMonthButtonDisabled}
                                    >
                                        {'<'}
                                    </button>
                                )}
                                <header className='text-base font-normal leading-7 col-span-2'>
                                    {MONTHS[date.getMonth()] +
                                        ' ' +
                                        date.getFullYear().toString()}
                                </header>
                                <button
                                    className='text-xl text-right px-4'
                                    onClick={(event) => {
                                        event.preventDefault();
                                        increaseMonth();
                                    }}
                                    disabled={nextMonthButtonDisabled}
                                >
                                    {'>'}
                                </button>
                            </div>
                        )}
                        popperModifiers={[
                            {
                                name: 'arrow',
                                options: {
                                    padding: ({ popper }) => ({
                                        right: popper.width - 24,
                                    }),
                                },
                            },
                        ]}
                    />
                    <Button
                        height='h-10'
                        primary
                        className='self-end md:ml-6 md:w-10 md:rounded-full'
                        onClick={handleSubmit}
                    >
                        <span className='md:hidden'>Search</span>
                        <IoIosArrowForward className='hidden md:block' />
                    </Button>
                </search>
            </SectionContainer>
        </IconContext.Provider>
    );
}

export default Search;

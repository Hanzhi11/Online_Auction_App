import { IconContext } from "react-icons";
import { IoIosArrowForward } from "react-icons/io";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";
import className from "classnames";

type StartDate = Date | null

const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
]

const STATE_OPTIONS = [
    'All State',
    'Australian Capital Territory',
    'New South Wales',
    'Northern Territory',
    'Queensland',
    'South Australia',
    'Tasmania',
    'Victoria',
    'Western Australia'
]

function Search() {
    const [address, setAddress] = useState<string>('');
    const [selectedState, setSelectedState] = useState<string>(STATE_OPTIONS[1]);
    const [startDate, setStartDate] = useState<StartDate>(null);

    const sharedInputStyle = className('bg-stone-200 border-0 rounded-md bg-focus:ring-2 focus:ring-inset focus:ring-green-500')

    const handleOnChange=(event: React.ChangeEvent<HTMLElement>) => {
        const tagName = event.target.tagName
        const target = event.target as HTMLInputElement | HTMLSelectElement
        const value = target.value

        switch (tagName) {
            case 'INPUT':
                setAddress(value)
                break
            case 'SELECT':
                setSelectedState(value)
                break
        }
    }

    const handleSubmit= (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        const formData={
            address: address,
            state: selectedState,
            date: startDate
        }
        console.log(formData)

    }
    return (
        <IconContext.Provider value={{ color: 'white', size: '1.2rem', className: 'inline stroke-[20]' }}>
            <div className="w-full max-w-[1140px] mx-auto mt-3 md:mt-9 px-[4%] text-stone-800">
                <h1 className="border-b border-stone-400 font-light pb-4 md:pb-6 text-lg md:text-3xl">Property Search</h1>
                <form className="flex flex-col md:h-10 mt-5 md:flex-row">
                    <input type="text" placeholder="Suburb or Postcode" autoComplete="address-input" value={address} onChange={handleOnChange} className={"flex-1 mb-4 pl-2 leading-10 md:w-4/12 md:mr-6 md:mb-0 " + sharedInputStyle} />
                    <select id="state" name="state" autoComplete="state-name" value={selectedState} onChange={handleOnChange} className={"mb-4 h-10 pl-1 md:w-3/12 md:mr-6 md:mb-0 " + sharedInputStyle}>
                        {STATE_OPTIONS.map(state => {
                            return <option>{state}</option>
                        })}
                    </select>
                    <DatePicker
                        placeholderText='Date'
                        dateFormat='dd/MM/yyyy'
                        minDate={new Date()}
                        selected={startDate}
                        onChange={(date: StartDate) => setStartDate(date)}
                        wrapperClassName='mb-4 md:w-3/12 md:mb-0'
                        className={'w-full h-10 pl-2 ' + sharedInputStyle}
                        calendarClassName="font-light font-sans"
                        dayClassName={(date) => {
                            if (!startDate && date.getTime() === new Date().setHours(0, 0, 0, 0)) {
                                return 'bg-white'
                            }
                            if (date.getTime() == startDate?.getTime()) {
                                return 'bg-green-500'
                            }
                            return 'bg-white hover:bg-slate-200'
                        }}
                        weekDayClassName={(_date: Date) => {
                            return 'font-normal'
                        }}
                        renderCustomHeader={({
                            date,
                            decreaseMonth,
                            increaseMonth,
                            prevMonthButtonDisabled,
                            nextMonthButtonDisabled,
                        }) => (
                            <div className="grid grid-cols-4 grid-rows-1">
                                {prevMonthButtonDisabled ? <div></div> : <button className='text-xl text-left px-4'
                                    onClick={(event) => {
                                        event.preventDefault()
                                        decreaseMonth()
                                    }}
                                    disabled={prevMonthButtonDisabled}>
                                    {"<"}
                                </button>}
                                <header className="text-base font-normal leading-7 col-span-2">{MONTHS[date.getMonth()] + ' ' + date.getFullYear().toString()}</header>
                                <button className='text-xl text-right px-4'
                                    onClick={(event) => {
                                        event.preventDefault()
                                        increaseMonth()
                                    }}
                                    disabled={nextMonthButtonDisabled}>
                                    {">"}
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
                    <button className="bg-green-500 rounded-full w-10 h-10 self-end md:ml-6" onClick={handleSubmit}><IoIosArrowForward /></button>
                </form>
            </div>
        </IconContext.Provider >
    )
}

export default Search
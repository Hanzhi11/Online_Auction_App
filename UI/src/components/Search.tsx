import { IconContext } from "react-icons";
import { IoIosArrowForward } from "react-icons/io";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";

type startDate = Date | null

function Search() {
    const [startDate, setStartDate] = useState<startDate>(null);

    const months = [
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

    return (
        <IconContext.Provider value={{ color: 'white', size: '1.2rem', className: 'inline stroke-[20]' }}>
            <div className="w-full max-w-[1140px] mx-auto mt-3 md:mt-9 px-[4%]">
                <h1 className="border-b border-stone-400 text-stone-800 font-light pb-4 md:pb-6 text-lg md:text-3xl">Property Search</h1>
                <form action="" className="flex flex-col md:h-10 mt-5 md:flex-row">
                    <input type="text" placeholder="Suburb or Postcode" className="flex-1 mb-4 md:w-4/12 md:mr-6 md:mb-0 bg-stone-200 border-0 rounded-md bg-focus:ring-2 focus:ring-inset focus:ring-green-500" />
                    <select id="state" name="state" autoComplete="state-name" className="mb-4 md:w-3/12 md:mr-6 md:mb-0 rounded-md border-0 text-stone-800 bg-stone-200 bg-focus:ring-2 focus:ring-inset focus:ring-green-500">
                        <option>All State</option>
                        <option>Australian Capital Territory</option>
                        <option>New South Wales</option>
                        <option>Northern Territory</option>
                        <option>Queensland</option>
                        <option>South Australia</option>
                        <option>Tasmania</option>
                        <option>Victoria</option>
                        <option>Western Australia</option>
                    </select>
                    <DatePicker
                        placeholderText='Date'
                        dateFormat='dd/MM/yyyy'
                        minDate={new Date()}
                        selected={startDate}
                        onChange={(date: startDate) => setStartDate(date)}
                        wrapperClassName='mb-4 md:w-3/12 md:mb-0'
                        className='w-full bg-stone-200 border-0 rounded-md bg-focus:ring-2 focus:ring-inset focus:ring-green-500'
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
                                <header className="text-base font-normal leading-7 col-span-2">{months[date.getMonth()] + ' ' + date.getFullYear().toString()}</header>
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
                    <button type="submit" className="bg-green-500 rounded-full w-10 h-10 self-end md:ml-6"><IoIosArrowForward /></button>
                </form>
            </div>
        </IconContext.Provider >
    )
}

export default Search
import {
    useEffect,
    useRef,
    MouseEvent,
    useReducer,
    useState,
    Dispatch,
} from 'react';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import SubjectDropdown from './SubjectDropdown';
import { ELEMENT_ID, Option } from './Constants';
import Button from './Button';
import en from 'react-phone-number-input/locale/en';
import CountryDropdown from './CountryDropdown';
import examples from 'libphonenumber-js/mobile/examples';
import { getExampleNumber, CountryCode, E164Number } from 'libphonenumber-js';

interface FormData {
    subject: Option[];
    message: string;
    name: string;
    email: string;
    country: CountryCode;
    contactNumber: E164Number | undefined;
}

interface DispatchAction {
    type: string;
    payload?: Partial<FormData>;
}

enum ACTION_TYPE {
    CHANGED_SUBJECT = 'changed_subject',
    CHANGED_MESSAGE = 'changed_message',
    CHANGED_NAME = 'changed_name',
    CHANGED_EMAIL = 'changed_email',
    CHANGED_CONTACT_NUMBER = 'changed_contact_number',
    RESET_FORM = 'reset_form',
    CHANGED_COUNTRY = 'changed_country',
}

const initialFormData: FormData = {
    subject: [],
    message: '',
    name: '',
    email: '',
    country: 'US',
    contactNumber: '',
};

const subjectOptions = [
    { id: '1', content: 'Book Inspection' },
    { id: '2', content: 'Contract of Sale' },
    { id: '3', content: 'Rates and Fees' },
    { id: '4', content: 'Further Information' },
];

function formDataReducer(formData: FormData, action: DispatchAction) {
    const actionData = action.payload;
    if (actionData) {
        switch (action.type) {
            case ACTION_TYPE.CHANGED_SUBJECT: {
                return {
                    ...formData,
                    subject: actionData.subject as Option[],
                };
            }
            case ACTION_TYPE.CHANGED_MESSAGE: {
                return {
                    ...formData,
                    message: actionData.message as string,
                };
            }
            case ACTION_TYPE.CHANGED_NAME: {
                return {
                    ...formData,
                    name: actionData.name as string,
                };
            }
            case ACTION_TYPE.CHANGED_EMAIL: {
                return {
                    ...formData,
                    email: actionData.email as string,
                };
            }
            case ACTION_TYPE.CHANGED_CONTACT_NUMBER: {
                return {
                    ...formData,
                    contactNumber: actionData.contactNumber as string,
                };
            }
            case ACTION_TYPE.CHANGED_COUNTRY: {
                return {
                    ...formData,
                    country: actionData.country as CountryCode,
                };
            }
            case ACTION_TYPE.RESET_FORM: {
                return {
                    ...initialFormData,
                    country: actionData.country as CountryCode,
                };
            }
        }
    }
    return formData;
}

const handleSubjectDropdown = (
    target: HTMLElement,
    subjectDropdown: HTMLDivElement | null,
    subjectField: HTMLElement | null,
) => {
    if (!subjectDropdown) return;
    if (!subjectField) return;

    const isInsideSubjectField = subjectField.contains(target);
    const isInsideSubjectDropdown = subjectDropdown.contains(target);
    const ArrowUp = document.getElementById(
        ELEMENT_ID.SUBJECT_ARROW_UP,
    ) as HTMLElement;
    const ArrowDown = document.getElementById(
        ELEMENT_ID.SUBJECT_ARROW_DOWN,
    ) as HTMLElement;

    // open subject dropdown
    if (isInsideSubjectField && subjectDropdown.classList.contains('hidden')) {
        subjectDropdown.classList.remove('hidden');
        ArrowUp.classList.remove('hidden');
        ArrowDown.classList.add('hidden');
        return;
    }

    // hide subject dropdown
    if (!isInsideSubjectDropdown) {
        subjectDropdown.classList.add('hidden');
        ArrowUp.classList.add('hidden');
        ArrowDown.classList.remove('hidden');
        return;
    }
};
const handleCountryDropdown = (
    target: HTMLElement,
    countryDropdown: HTMLUListElement | null,
    countryField: HTMLDivElement | null,
    setOpenCountryDropdown: Dispatch<boolean>,
) => {
    if (!countryField) return;
    const isInsideCountryField = countryField.contains(target);
    
    // open country dropdown
    if (isInsideCountryField) {
        const hasCountryDropdown = countryDropdown ? true : false
        setOpenCountryDropdown(!hasCountryDropdown);
        return;
    }

    // hide country dropdown
    if (countryDropdown && !countryDropdown.contains(target)) {
        setOpenCountryDropdown(false);
        return;
    }
};

export default function EnquiryForm() {
    const subjectDropdownRef = useRef<HTMLDivElement | null>(null);
    const countryDropdownRef = useRef<HTMLUListElement | null>(null);
    const subjectFieldRef = useRef<HTMLDivElement | null>(null);
    const countryFieldRef = useRef<HTMLDivElement | null>(null);

    const [formData, dispatch] = useReducer(formDataReducer, initialFormData);
    const [geoCountry, setGeoCountry] = useState<CountryCode>('US');
    const [openCountryDropdown, setOpenCountryDropdown] =
        useState<boolean>(false);

    function handleSubmit(event: MouseEvent) {
        event.preventDefault();
        console.log('submit', formData)
        dispatch({
            type: ACTION_TYPE.RESET_FORM,
            payload: { country: geoCountry },
        });
    }

    useEffect(() => {
        fetch('https://ipapi.co/json')
            .then(function (res) {
                return res.json();
            })
            .then(function (data) {
                setGeoCountry(data.country_code);
                dispatch({
                    type: ACTION_TYPE.CHANGED_COUNTRY,
                    payload: { country: data.country_code },
                });
            });

        const handleDropdown = (event: Event) => {
            const target = event.target as HTMLElement;
            const subjectDropdown = subjectDropdownRef.current;
            const subjectField = subjectFieldRef.current;
            const countryDropdown = countryDropdownRef.current;
            const countryField = countryFieldRef.current;

            handleSubjectDropdown(target, subjectDropdown, subjectField);
            handleCountryDropdown(
                target,
                countryDropdown,
                countryField,
                setOpenCountryDropdown,
            );
        };
        document.addEventListener('click', handleDropdown);

        return () => {
            document.removeEventListener('click', handleDropdown);
        };
    }, []);

    const handleUpdateSelection = (data: Option[]) => {
        dispatch({
            type: ACTION_TYPE.CHANGED_SUBJECT,
            payload: { subject: data },
        });
    };

    const labelStyle = 'block leading-6 text-gray-900 mb-2';
    const baseStyle =
        'w-full border-0 bg-white ring-1 ring-gray-300 rounded-md focus:ring-green-500';
    const inputStyle = baseStyle.concat(' ', 'h-10');
    const textAreaStyle = baseStyle.concat(' ', 'h-36');

    const phoneNumber = getExampleNumber(formData.country, examples);
    const placeHolder = phoneNumber?.formatNational();

    let height = 284
    let top = 41
    if (countryFieldRef.current) {
        const rect = countryFieldRef.current.getBoundingClientRect();
        const viewportHeight = document.documentElement.clientHeight;
        const distanceToBottom = Math.floor(viewportHeight - rect.bottom - 1);
        const distanceToTop = Math.floor(rect.top - 1);
        if (distanceToBottom > 25 && distanceToBottom < 284) {
            height = distanceToBottom
        } else if (distanceToBottom < 26) {
            if (distanceToTop > 25 && distanceToTop < 284) {
                height = distanceToTop
                top = -height
            } else if (distanceToTop > 283) {
                top = -height
            }
        }
    }

    return (
        <form className='flex flex-col gap-y-5'>
            <div>
                <label className={labelStyle}>
                    Enquire about (please tick all that apply)
                </label>
                <div className='relative' ref={subjectFieldRef}>
                    <input
                        readOnly
                        name='subject'
                        className={inputStyle.concat(' ', 'pr-11')}
                        value={
                            formData.subject.length > 0
                                ? formData.subject
                                      .map((item: Option) => item.content)
                                      .join(', ')
                                : ''
                        }
                    />
                    <div className='absolute right-0 top-1/2 -translate-y-1/2 px-3'>
                        <IoIosArrowUp
                            id={ELEMENT_ID.SUBJECT_ARROW_UP}
                            className='hidden'
                        />
                        <IoIosArrowDown id={ELEMENT_ID.SUBJECT_ARROW_DOWN} />
                    </div>
                    <SubjectDropdown
                        options={subjectOptions}
                        selectedOptions={formData.subject}
                        updateSelection={handleUpdateSelection}
                        ref={subjectDropdownRef}
                    />
                </div>
            </div>
            <div>
                <label className={labelStyle}>Message</label>
                <textarea
                    name='message'
                    className={textAreaStyle}
                    value={formData.message}
                    onChange={(e) =>
                        dispatch({
                            type: ACTION_TYPE.CHANGED_MESSAGE,
                            payload: { message: e.target.value },
                        })
                    }
                ></textarea>
            </div>
            <div>
                <label className={labelStyle}>Name</label>
                <input
                    name='name'
                    className={inputStyle}
                    value={formData.name}
                    onChange={(e) =>
                        dispatch({
                            type: ACTION_TYPE.CHANGED_NAME,
                            payload: { name: e.target.value },
                        })
                    }
                />
            </div>
            <div>
                <label className={labelStyle}>Email</label>
                <input
                    name='email'
                    className={inputStyle}
                    value={formData.email}
                    onChange={(e) =>
                        dispatch({
                            type: ACTION_TYPE.CHANGED_EMAIL,
                            payload: { email: e.target.value },
                        })
                    }
                />
            </div>
            <div>
                <label className={labelStyle}>Contact Number</label>
                <div className={'relative flex bg-white rounded-md'}>
                    <div
                        className='flex items-center px-2 border-0 ring-1 rounded-l-md ring-r-0 ring-gray-300 peer'
                        ref={countryFieldRef}
                    >
                        <img
                            alt={en[formData.country]}
                            src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${formData.country}.svg`}
                            className='h-5 mr-1'
                        />
                        <IoIosArrowDown />
                    </div>
                    <input
                        type='tel'
                        value={formData.contactNumber}
                        placeholder={placeHolder}
                        onChange={(e) =>
                            dispatch({
                                type: ACTION_TYPE.CHANGED_CONTACT_NUMBER,
                                payload: { contactNumber: e.target.value },
                            })
                        }
                        className='w-full border-0 ring-1 rounded-r-md ring-gray-300 focus:ring-green-500 peer-focus:ring-l-0'
                    />
                    {openCountryDropdown && (
                        <CountryDropdown
                            ref={countryDropdownRef}
                            onChange={(data: CountryCode) =>
                                dispatch({
                                    type: ACTION_TYPE.CHANGED_COUNTRY,
                                    payload: { country: data },
                                })
                            }
                            country={formData.country}
                            openDropDown = {setOpenCountryDropdown}
                            height={height}
                            top={top}
                        />
                    )}
                </div>
            </div>
            <Button height='h-10' type='primary' onClick={handleSubmit}>
                Send
            </Button>
        </form>
    );
}

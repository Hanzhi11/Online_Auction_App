import {
    useEffect,
    useRef,
    MouseEvent,
    useReducer,
    useState,
    ChangeEvent,
    useCallback,
} from 'react';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import SubjectDropdown from './SubjectDropdown';
import { ELEMENT_ID, Option } from './Constants';
import Button from './Button';
import en from 'react-phone-number-input/locale/en';
import CountryDropdown from './CountryDropdown';
import examples from 'libphonenumber-js/mobile/examples';
import {
    getExampleNumber,
    CountryCode,
    E164Number,
    AsYouType,
    isPossiblePhoneNumber,
    parsePhoneNumber,
} from 'libphonenumber-js';
import classNames from 'classnames';

interface Props {
    listingNumber: string
}

interface FormData {
    subject: Option[];
    message: string;
    name: string;
    email: string;
    country: CountryCode;
    contactNumber: string | E164Number;
}

interface DispatchAction {
    type: string;
    payload?: Partial<FormData>;
}

enum REQUIRED_FORM_FIELD {
    SUBJECT = 'subject',
    NAME = 'name',
    EMAIL = 'email',
    CONTACT_NUMBER = 'contactNumber',
}

type FieldError = {
    [key in REQUIRED_FORM_FIELD]?: string;
};

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

export default function EnquiryForm(props: Props) {
    const {listingNumber} = props
    const subjectDropdownRef = useRef<HTMLDivElement | null>(null);
    const countryDropdownRef = useRef<HTMLUListElement | null>(null);
    const subjectFieldRef = useRef<HTMLDivElement | null>(null);
    const countryFieldRef = useRef<HTMLDivElement | null>(null);

    const [formData, dispatch] = useReducer(formDataReducer, initialFormData);
    const [geoCountry, setGeoCountry] = useState<CountryCode>('US');
    const [openCountryDropdown, setOpenCountryDropdown] =
        useState<boolean>(false);
    const [openSubjectDropdown, setOpenSubjectDropdown] =
        useState<boolean>(false);
    const [fieldError, setFieldError] = useState<FieldError>({});

    function handleSubmit(event: MouseEvent) {
        event.preventDefault();

        const error: FieldError = {...fieldError}
        Object.values(REQUIRED_FORM_FIELD).forEach(field => {
            if (error[field]) return
            const newFieldError = validateRequiredField(field, false)
            if (newFieldError && newFieldError[field]) {
                error[field] = newFieldError[field]
            }
        })

        if (Object.entries(error).length === 0) {
            const phoneNumber: E164Number = parsePhoneNumber(formData.contactNumber, formData.country).number
            console.log(listingNumber, phoneNumber)
            dispatch({
                type: ACTION_TYPE.RESET_FORM,
                payload: { country: geoCountry },
            });
        } else {
            setFieldError(error)
        }
    }

    const validateRequiredField = useCallback(
        (fieldName: REQUIRED_FORM_FIELD, updateState: boolean = true) => {
            const isEmpty = formData[fieldName].length === 0 ? true: false;
            const newError: FieldError = fieldError ? {
                ...fieldError,
            }: {};
            if (!isEmpty) {
                let regex: RegExp;
                let isPossibleNumber: boolean;
                switch (fieldName) {
                    case REQUIRED_FORM_FIELD.SUBJECT:
                        delete newError[REQUIRED_FORM_FIELD.SUBJECT];
                        break;
                    case REQUIRED_FORM_FIELD.NAME:
                        delete newError[REQUIRED_FORM_FIELD.NAME];
                        break;
                    case REQUIRED_FORM_FIELD.EMAIL:
                        regex =
                            /^([A-Za-z0-9]+[.-_])*[A-Za-z0-9]+@[A-Za-z0-9-]+(\.[A-Z|a-z]{2,})+$/g;
                        if (!formData.email.match(regex)) {
                            newError[REQUIRED_FORM_FIELD.EMAIL] = 'Invalid Email.';
                        } else {
                            delete newError[REQUIRED_FORM_FIELD.EMAIL];
                        }
                        break;
                    case REQUIRED_FORM_FIELD.CONTACT_NUMBER:
                        isPossibleNumber = isPossiblePhoneNumber(
                            formData.contactNumber,
                            formData.country,
                        );
                        if (!isPossibleNumber) {
                            newError[REQUIRED_FORM_FIELD.CONTACT_NUMBER] =
                                'Invalid contact number.';
                        } else {
                            delete newError[REQUIRED_FORM_FIELD.CONTACT_NUMBER];
                        }
                }
            } else {
                newError[fieldName] = 'The field is required.';
            }
            if (updateState) {
                setFieldError(newError);
            } else {
                return newError
            }
        },
        [fieldError, formData],
    );

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
    }, []);

    useEffect(() => {
        const handleDropdown = (event: Event) => {
            const target = event.target as HTMLElement;
            const subjectField = subjectFieldRef.current;

            if (subjectField) {
                let open = false;
                const isInsideSubjectField = subjectField.contains(target);
                const subjectDropdown = subjectDropdownRef.current;

                if (subjectDropdown) {
                    const isInsideSubjectDropdown =
                        subjectDropdown.contains(target);
                    if (isInsideSubjectDropdown) {
                        open = true;
                    } else {
                        open = false;
                        validateRequiredField(REQUIRED_FORM_FIELD.SUBJECT);
                    }
                } else {
                    open = isInsideSubjectField;
                }

                setOpenSubjectDropdown(open);
            }

            const countryField = countryFieldRef.current;
            if (countryField) {
                let open = false;
                const isInsideCountryField = countryField.contains(target);

                if (isInsideCountryField) {
                    const countryDropdown = countryDropdownRef.current;
                    const hasCountryDropdown = countryDropdown ? true : false;
                    open = !hasCountryDropdown;
                }
                setOpenCountryDropdown(open);
            }
        };
        document.addEventListener('click', handleDropdown);

        return () => {
            document.removeEventListener('click', handleDropdown);
        };
    }, [validateRequiredField]);

    const handleSubjectChange = (data: Option[]) => {
        dispatch({
            type: ACTION_TYPE.CHANGED_SUBJECT,
            payload: { subject: data },
        });
    };

    const handleRequiredTextInputChange = (
        e: ChangeEvent<HTMLInputElement>,
        fieldName: REQUIRED_FORM_FIELD,
    ) => {
        const value = e.target.value;
        if (value.length > 0 && fieldError[fieldName]) {
            delete fieldError[fieldName];
        }
        switch (fieldName) {
            case REQUIRED_FORM_FIELD.NAME:
                dispatch({
                    type: ACTION_TYPE.CHANGED_NAME,
                    payload: { name: value },
                });
                break;
            case REQUIRED_FORM_FIELD.EMAIL:
                dispatch({
                    type: ACTION_TYPE.CHANGED_EMAIL,
                    payload: { email: value },
                });
                break;
            case REQUIRED_FORM_FIELD.CONTACT_NUMBER:
                dispatch({
                    type: ACTION_TYPE.CHANGED_CONTACT_NUMBER,
                    payload: { contactNumber: value },
                });
                break;
        }
    };

    const handleContactNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        const regex = /^\(\d+$/;
        const found = value.match(regex);
        if (found) {
            value = value.slice(1, -1);
        }
        dispatch({
            type: ACTION_TYPE.CHANGED_CONTACT_NUMBER,
            payload: {
                contactNumber: new AsYouType(formData.country).input(value),
            },
        });
    };

    const labelStyle = 'block leading-6 text-gray-900 mb-2 md:text-sm';
    const labelStyleRequired = labelStyle.concat(
        ' ',
        'after:content-["*"] after:ml-0.5',
    );
    const baseStyle =
        'w-full border-0 bg-white ring-1 ring-gray-300 rounded-md focus:ring-green-500';
    const inputStyle = baseStyle.concat(' ', 'h-10');
    const textAreaStyle = baseStyle.concat(' ', 'h-36');
    const errorStyle = 'text-xs text-red-600 mt-2 md:text-sm'

    const phoneNumber = getExampleNumber(formData.country, examples);
    const placeHolder = phoneNumber?.formatNational();

    let height = 284;
    let top = 0;
    if (countryFieldRef.current) {
        top = countryFieldRef.current.offsetHeight + 1; // 1px is the width of box shadow of countryField
        const rect = countryFieldRef.current.getBoundingClientRect();
        const viewportHeight = document.documentElement.clientHeight;
        const distanceToBottom = Math.floor(viewportHeight - rect.bottom - 1);
        const distanceToTop = Math.floor(rect.top - 1);
        if (distanceToBottom > 25 && distanceToBottom < 284) {
            height = distanceToBottom;
        } else if (distanceToBottom < 26) {
            if (distanceToTop > 25 && distanceToTop < 284) {
                height = distanceToTop;
                top = -height;
            } else if (distanceToTop > 283) {
                top = -height;
            }
        }
    }

    return (
        <form className='flex flex-col gap-y-5'>
            <div>
                <label
                    className={classNames(labelStyleRequired, {
                        'after:text-red-600': Object.keys(
                            fieldError,
                        ).includes(REQUIRED_FORM_FIELD.SUBJECT),
                    })}
                >
                    Enquire about (please tick all that apply)
                </label>
                <div className='relative'>
                    <div ref={subjectFieldRef}>
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
                            {openSubjectDropdown ? (
                                <IoIosArrowUp
                                    id={ELEMENT_ID.SUBJECT_ARROW_UP}
                                />
                            ) : (
                                <IoIosArrowDown
                                    id={ELEMENT_ID.SUBJECT_ARROW_DOWN}
                                />
                            )}
                        </div>
                    </div>
                    {openSubjectDropdown && (
                        <SubjectDropdown
                            options={subjectOptions}
                            selectedOptions={formData.subject}
                            updateSelection={handleSubjectChange}
                            ref={subjectDropdownRef}
                        />
                    )}
                </div>
                {Object.keys(fieldError).includes(REQUIRED_FORM_FIELD.SUBJECT) && (
                    <p className={errorStyle}>
                        {fieldError.subject}
                    </p>
                )}
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
                <label
                    className={classNames(labelStyleRequired, {
                        'after:text-red-600': Object.keys(
                            fieldError,
                        ).includes(REQUIRED_FORM_FIELD.NAME),
                    })}
                >
                    Name
                </label>
                <input
                    name='name'
                    className={inputStyle}
                    value={formData.name}
                    onChange={(e) =>
                        handleRequiredTextInputChange(e, REQUIRED_FORM_FIELD.NAME)
                    }
                    onBlur={() => validateRequiredField(REQUIRED_FORM_FIELD.NAME)}
                />
                {Object.keys(fieldError).includes(REQUIRED_FORM_FIELD.NAME) && (
                    <p className={errorStyle}>
                        {fieldError.name}
                    </p>
                )}
            </div>
            <div>
                <label
                    className={classNames(labelStyleRequired, {
                        'after:text-red-600': Object.keys(
                            fieldError,
                        ).includes(REQUIRED_FORM_FIELD.EMAIL),
                    })}
                >
                    Email
                </label>
                <input
                    name='email'
                    className={inputStyle}
                    value={formData.email}
                    onChange={(e) =>
                        handleRequiredTextInputChange(e, REQUIRED_FORM_FIELD.EMAIL)
                    }
                    onBlur={() => validateRequiredField(REQUIRED_FORM_FIELD.EMAIL)}
                />
                {Object.keys(fieldError).includes(REQUIRED_FORM_FIELD.EMAIL) && (
                    <p className={errorStyle}>
                        {fieldError.email}
                    </p>
                )}
            </div>
            <div>
                <label
                    className={classNames(labelStyleRequired, {
                        'after:text-red-600': Object.keys(
                            fieldError,
                        ).includes(REQUIRED_FORM_FIELD.CONTACT_NUMBER),
                    })}
                >
                    Contact Number
                </label>
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
                        onChange={handleContactNumberChange}
                        onBlur={() =>
                            validateRequiredField(REQUIRED_FORM_FIELD.CONTACT_NUMBER)
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
                            openDropDown={setOpenCountryDropdown}
                            height={height}
                            top={top}
                        />
                    )}
                </div>
                {Object.keys(fieldError).includes(
                    REQUIRED_FORM_FIELD.CONTACT_NUMBER,
                ) && (
                    <p className={errorStyle}>
                        {fieldError.contactNumber}
                    </p>
                )}
            </div>
            <Button height='h-10' type='primary' onClick={handleSubmit}>
                Send
            </Button>
        </form>
    );
}

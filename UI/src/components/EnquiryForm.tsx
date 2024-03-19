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
import { ELEMENT_ID, Option } from '../shared/Constants';
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
import { scrollCountryDropdown } from '../shared/Utils';
import FormField from './FormField';
import classNames from 'classnames';

interface Props {
    listingNumber: string;
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

export const initialCountry = 'AU';
const subjectOptions = [
    { id: 1, content: 'Book Inspection' },
    { id: 2, content: 'Contract of Sale' },
    { id: 3, content: 'Rates and Fees' },
    { id: 4, content: 'Further Information' },
];

const initialFormData: FormData = {
    subject: [
        subjectOptions[0],
        subjectOptions[1],
        subjectOptions[2],
        subjectOptions[3],
    ],
    message: 'Lorem',
    name: 'Test',
    email: 'test@test.com',
    country: initialCountry,
    contactNumber: '+61412341234',
};
// const initialFormData: FormData = {
//     subject: [],
//     message: '',
//     name: '',
//     email: '',
//     country: initialCountry,
//     contactNumber: '',
// };

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
        }
    } else if (action.type === ACTION_TYPE.RESET_FORM) {
        return {
            ...initialFormData,
        };
    }
    return formData;
}

export default function EnquiryForm(props: Props) {
    const { listingNumber } = props;
    const subjectDropdownRef = useRef<HTMLDivElement | null>(null);
    const countryDropdownRef = useRef<HTMLUListElement | null>(null);
    const subjectFieldRef = useRef<HTMLDivElement | null>(null);
    const countryButtonRef = useRef<HTMLButtonElement | null>(null);

    const [formData, dispatch] = useReducer(formDataReducer, initialFormData);
    const [openSubjectDropdown, setOpenSubjectDropdown] =
        useState<boolean>(false);
    const [fieldError, setFieldError] = useState<FieldError>({});
    const [waitForResponse, setWaitForResponse] = useState<boolean>(false);

    function handleSubmit(event: MouseEvent) {
        event.preventDefault();
        setWaitForResponse(true);

        const error: FieldError = { ...fieldError };
        Object.values(REQUIRED_FORM_FIELD).forEach((field) => {
            if (error[field]) return;
            const newFieldError = validateRequiredField(field, false);
            if (newFieldError && newFieldError[field]) {
                error[field] = newFieldError[field];
            }
        });

        if (Object.entries(error).length === 0) {
            const phoneNumber: E164Number = parsePhoneNumber(
                formData.contactNumber,
                formData.country,
            ).number;
            const subject = formData.subject.map((item) => item.id);
            const dataSubmited = {
                subjects: subject,
                message: formData.message,
                name: formData.name,
                email: formData.email,
                contactNumber: phoneNumber,
            };

            const body = JSON.stringify(dataSubmited);

            fetch(
                `${import.meta.env.VITE_BASE_URL}/Enquiry/Send/${listingNumber}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: body,
                    mode: 'cors',
                },
            )
                .then((res) => {
                    if (res.ok) {
                        dispatch({
                            type: ACTION_TYPE.RESET_FORM,
                        });
                        setWaitForResponse(false);
                    } else {
                        throw new Error('Failed to send the enquiry.');
                    }
                })
                .catch((err) => console.log(err));
        } else {
            setFieldError(error);
        }
    }

    const validateRequiredField = useCallback(
        (
            fieldName: REQUIRED_FORM_FIELD,
            updateState: boolean = true,
            data?: string | Option[],
            checkEmptyOnly: boolean = false,
        ) => {
            const testData = data === undefined ? formData[fieldName] : data;
            const isEmpty = testData.length === 0 ? true : false;

            const newError: FieldError = fieldError
                ? {
                      ...fieldError,
                  }
                : {};

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
                        if (!formData.email.match(regex) && !checkEmptyOnly) {
                            newError[REQUIRED_FORM_FIELD.EMAIL] =
                                'Invalid Email.';
                        } else {
                            delete newError[REQUIRED_FORM_FIELD.EMAIL];
                        }
                        break;
                    case REQUIRED_FORM_FIELD.CONTACT_NUMBER:
                        isPossibleNumber = isPossiblePhoneNumber(
                            formData.contactNumber,
                            formData.country,
                        );
                        if (!isPossibleNumber && !checkEmptyOnly) {
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
                return newError;
            }
        },
        [fieldError, formData],
    );

    useEffect(() => {
        const handleSubjectDropdown = (target: HTMLElement) => {
            const subjectField = subjectFieldRef.current as HTMLDivElement;
            let isInsideSubjectField = subjectField.contains(target);
            if (
                target.tagName === 'svg' &&
                [
                    ELEMENT_ID.SUBJECT_ARROW_DOWN as string,
                    ELEMENT_ID.SUBJECT_ARROW_UP as string,
                ].includes(target.id)
            ) {
                isInsideSubjectField = true;
            }

            if (isInsideSubjectField) return;

            const subjectDropdown = subjectDropdownRef.current;

            if (!subjectDropdown) return;
            const isInsideSubjectDropdown = subjectDropdown.contains(target);

            if (isInsideSubjectDropdown) return;

            setOpenSubjectDropdown(false);
            validateRequiredField(REQUIRED_FORM_FIELD.SUBJECT);
        };

        const handleCountryDropdown = (target: HTMLElement) => {
            const countryField = countryButtonRef.current as HTMLButtonElement;
            let isInsideCountryField = countryField.contains(target);
            if (
                target.tagName === 'svg' &&
                target.id === ELEMENT_ID.COUNTRY_ARROW_DOWN
            ) {
                isInsideCountryField = true;
            }

            if (isInsideCountryField) return;

            countryDropdownRef.current?.classList.add('hidden');
        };

        const handleDropdown = (event: Event) => {
            let target = event.target as HTMLElement;
            if (target.tagName === 'path') {
                target = target.parentElement as HTMLElement;
            }
            handleSubjectDropdown(target);
            handleCountryDropdown(target);
        };
        document.addEventListener('click', handleDropdown);

        return () => {
            document.removeEventListener('click', handleDropdown);
        };
    }, [formData.country, validateRequiredField]);

    useEffect(() => {
        const countryButton = countryButtonRef.current as HTMLButtonElement;
        const preventDefault = function (event: KeyboardEvent) {
            const key = event.key.toUpperCase();
            console.log(1, key)
            if (key === 'ENTER') event.preventDefault();
        };
        countryButton.addEventListener('keydown', preventDefault);
        countryButton.addEventListener('keyup', preventDefault);

        return () => {
            countryButton.removeEventListener('keydown', preventDefault);
            countryButton.removeEventListener('keyup', preventDefault);
        };
    }, []);

    const handleSubjectChange = (data: Option[]) => {
        dispatch({
            type: ACTION_TYPE.CHANGED_SUBJECT,
            payload: { subject: data },
        });
        validateRequiredField(REQUIRED_FORM_FIELD.SUBJECT, true, data);
    };

    const handleRequiredTextInputChange = (
        e: ChangeEvent<HTMLInputElement>,
        fieldName: REQUIRED_FORM_FIELD,
    ) => {
        const value = e.target.value;
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
        validateRequiredField(fieldName, true, value, true);
    };

    const handleContactNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        const regex = /^\(\d+$/;
        const found = value.match(regex);
        if (found) {
            value = value.slice(1, -1);
        }
        const number = new AsYouType(formData.country).input(value);
        dispatch({
            type: ACTION_TYPE.CHANGED_CONTACT_NUMBER,
            payload: {
                contactNumber: number,
            },
        });
        validateRequiredField(
            REQUIRED_FORM_FIELD.CONTACT_NUMBER,
            true,
            number,
            true,
        );
    };

    const baseStyle =
        'w-full border-0 bg-white ring-1 ring-gray-300 rounded-md focus:ring-green-500';
    const inputStyle = baseStyle.concat(' ', 'h-10');
    const textAreaStyle = baseStyle.concat(' ', 'h-36');

    const phoneNumber = getExampleNumber(formData.country, examples);
    const placeHolder = phoneNumber?.formatNational();

    return (
        <form className='flex flex-col gap-y-5'>
            <FormField
                labelContent='Enquire about (please tick all that apply)'
                errorMessage={fieldError.subject}
            >
                <div className='relative bg-white rounded-md'>
                    <div
                        ref={subjectFieldRef}
                        className={classNames(baseStyle, 'flex', {
                            'ring-green-500': openSubjectDropdown,
                        })}
                    >
                        <input
                            readOnly
                            name='subject'
                            className='flex-1 border-0 rounded-md focus:ring-0'
                            value={
                                formData.subject.length > 0
                                    ? formData.subject
                                          .map((item: Option) => item.content)
                                          .join(', ')
                                    : ''
                            }
                            disabled={waitForResponse}
                            onClick={() => {
                                setOpenSubjectDropdown(!openSubjectDropdown);
                            }}
                        />
                        <Button
                            width='w-10'
                            disabled={waitForResponse}
                            onClick={(e) => {
                                e.preventDefault();
                                setOpenSubjectDropdown(!openSubjectDropdown);
                            }}
                        >
                            {openSubjectDropdown ? (
                                <IoIosArrowUp
                                    id={ELEMENT_ID.SUBJECT_ARROW_UP}
                                />
                            ) : (
                                <IoIosArrowDown
                                    id={ELEMENT_ID.SUBJECT_ARROW_DOWN}
                                />
                            )}
                        </Button>
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
            </FormField>
            <FormField labelContent='Message' isRequired={false}>
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
                    disabled={waitForResponse}
                ></textarea>
            </FormField>
            <FormField labelContent='Name' errorMessage={fieldError.name}>
                <input
                    name='name'
                    className={inputStyle}
                    value={formData.name}
                    onChange={(e) =>
                        handleRequiredTextInputChange(
                            e,
                            REQUIRED_FORM_FIELD.NAME,
                        )
                    }
                    onBlur={() =>
                        validateRequiredField(REQUIRED_FORM_FIELD.NAME)
                    }
                    disabled={waitForResponse}
                />
            </FormField>
            <div className='grid grid-flow-row gap-5 lg:grid-cols-5'>
                <FormField
                    className='lg:col-span-3'
                    labelContent='Email'
                    errorMessage={fieldError.email}
                >
                    <input
                        name='email'
                        className={inputStyle}
                        value={formData.email}
                        onChange={(e) =>
                            handleRequiredTextInputChange(
                                e,
                                REQUIRED_FORM_FIELD.EMAIL,
                            )
                        }
                        onBlur={() =>
                            validateRequiredField(REQUIRED_FORM_FIELD.EMAIL)
                        }
                        disabled={waitForResponse}
                    />
                </FormField>
                <FormField
                    className='lg:col-span-2'
                    labelContent='Contact Number'
                    errorMessage={fieldError.contactNumber}
                >
                    <div className={'relative flex bg-white rounded-md'}>
                        <Button
                            id={ELEMENT_ID.COUNTRY_BUTTON}
                            ref={countryButtonRef}
                            width='min-w-fit'
                            className='flex items-center px-2 border-[1px] rounded-l-md rounded-r-none border-r-0 border-gray-300 peer focus-visible:outline-0 focus:border-green-500 focus:border-r-[1px]'
                            onClick={(e) => {
                                e.preventDefault();
                                const countryDropdown =
                                    countryDropdownRef.current as HTMLUListElement;
                                countryDropdown.classList.toggle('hidden');
                                scrollCountryDropdown(
                                    formData.country,
                                    countryDropdown,
                                );
                            }}
                            disabled={waitForResponse}
                        >
                            <img
                                alt={en[formData.country]}
                                src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${formData.country}.svg`}
                                className='h-5 mr-1'
                            />
                            <IoIosArrowDown
                                id={ELEMENT_ID.COUNTRY_ARROW_DOWN}
                            />
                        </Button>
                        <input
                            type='tel'
                            value={formData.contactNumber}
                            placeholder={placeHolder}
                            onChange={handleContactNumberChange}
                            onBlur={() =>
                                validateRequiredField(
                                    REQUIRED_FORM_FIELD.CONTACT_NUMBER,
                                )
                            }
                            disabled={waitForResponse}
                            className='w-full border-[1px] ring-0 rounded-r-md border-gray-300 focus:border-green-500 peer-focus:border-l-0'
                        />
                        <CountryDropdown
                            ref={countryDropdownRef}
                            onChange={(data: CountryCode) =>
                                dispatch({
                                    type: ACTION_TYPE.CHANGED_COUNTRY,
                                    payload: { country: data },
                                })
                            }
                            country={formData.country}
                        />
                    </div>
                </FormField>
            </div>
            <Button
                height='h-10'
                type='primary'
                onClick={handleSubmit}
                disabled={waitForResponse}
            >
                {waitForResponse ? (
                    <svg
                        aria-hidden='true'
                        className='w-4 h-4 mr-1 text-gray-500 animate-spin fill-white'
                        viewBox='0 0 100 101'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                    >
                        <path
                            d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                            fill='currentColor'
                        />
                        <path
                            d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                            fill='currentFill'
                        />
                    </svg>
                ) : (
                    <></>
                )}
                <span>Send</span>
            </Button>
        </form>
    );
}

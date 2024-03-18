import { MdEmail } from 'react-icons/md';
import { Agent, Auctioneer } from './Listing';
import { FaPhone } from 'react-icons/fa6';
import { AiFillSafetyCertificate } from 'react-icons/ai';

interface Props {
    person: Agent[] | Auctioneer;
}

function isAgent(person: Agent | Auctioneer): person is Agent {
    return (person as Agent).mobile !== undefined;
}

function PersonList(props: Props) {
    const { person } = props;

    let personList = [];
    if (Array.isArray(person)) {
        personList = person;
    } else {
        personList.push(person);
    }

    const content = personList.map((person, index) => {
        let portrait = (
            <img
                src={`data:image/jpeg;base64,${person.portraitBytes}`}
                alt='portrait'
            />
        );
        if (!person.portraitBytes || person.portraitBytes.length === 0) {
            portrait = (
                <div className='flex h-full border border-green-500 rounded-full'>
                    <span className='m-auto text-lg'>
                        {person.fullName
                            .split(' ')
                            .map((name) => name[0])
                            .join('')}
                    </span>
                </div>
            );
        }

        let mobile;
        let email;
        let licenceNumber;
        if (isAgent(person)) {
            mobile =
                person.mobile.slice(0, 4) +
                ' ' +
                person.mobile.slice(4, 7) +
                ' ' +
                person.mobile.slice(7);
            email = person.email;
        } else {
            licenceNumber = person.licenceNumber;
        }

        return (
            <div
                key={index}
                className='flex items-center bg-white rounded-r-md rounded-l-[48px] mb-3 overflow-hidden'
            >
                <div className='w-24 h-24 min-w-24 rounded-full overflow-hidden mr-5 md:w-14 md:h-14 md:min-w-14 lg:w-16 lg:h-16 lg:min-w-16 xl:w-24 xl:h-24 xl:min-w-24'>
                    {portrait}
                </div>
                <div className='overflow-hidden'>
                    <p className='md:text-sm xl:text-lg'>{person.fullName}</p>
                    {email && (
                        <div className='flex items-center'>
                            <div>
                                <MdEmail />
                            </div>
                            <p className='ml-2 break-all md:text-sm xl:text-base'>
                                {email}
                            </p>
                        </div>
                    )}
                    {mobile && (
                        <div className='flex items-center'>
                            <div>
                                <FaPhone />
                            </div>
                            <p className='ml-2 md:text-sm xl:text-base'>
                                {mobile}
                            </p>
                        </div>
                    )}
                    {licenceNumber && (
                        <div className='flex items-center'>
                            <div>
                                <AiFillSafetyCertificate />
                            </div>
                            <p className='ml-2 md:text-sm xl:text-base'>
                                {licenceNumber}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        );
    });
    return <div>{content}</div>;
}

export default PersonList;

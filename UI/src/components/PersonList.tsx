import { MdEmail } from "react-icons/md";
import { Agent, Auctioneer } from "./Listing";
import { FaPhone } from "react-icons/fa6";
import { AiFillSafetyCertificate } from "react-icons/ai";

interface Props {
    person: Agent[] | Auctioneer;
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
                alt="portrait"
            />
        );
        if (person.portraitBytes.length === 0) {
            portrait = (
                <div className="flex h-full border border-green-500 rounded-full">
                    <span className="m-auto text-lg">
                        {person.fullName.split(" ").map((name) => name[0]).join('')}
                    </span>
                </div>
            );
        }
        return (
            <div
                key={index}
                className="flex items-center bg-white rounded-r-md rounded-l-[48px] mb-3 overflow-hidden"
            >
                <div className="w-24 h-24 min-w-24 rounded-full overflow-hidden mr-5">
                    {portrait}
                </div>
                <div className="overflow-hidden">
                    <p>{person.fullName}</p>
                    {(person as Agent).email && (
                        <div className="flex items-center">
                            <MdEmail />
                            <p className="ml-2 truncate">
                                {(person as Agent).email}
                            </p>
                        </div>
                    )}
                    {(person as Agent).mobile && (
                        <div className="flex items-center">
                            <FaPhone />
                            <p className="ml-2">{(person as Agent).mobile}</p>
                        </div>
                    )}
                    {(person as Auctioneer).licenceNumber && (
                        <div className="flex items-center">
                            <AiFillSafetyCertificate />
                            <p className="ml-2">
                                {(person as Auctioneer).licenceNumber}
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

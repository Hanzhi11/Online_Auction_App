import { GiHouse } from "react-icons/gi";
import { MdHelp } from "react-icons/md";
import className from 'classnames';
import Button from "./Button";
import { ELEMENT_ID } from "./Constants";

interface Props {
    isSmallScreen: boolean;
    onSignIn: (event: React.MouseEvent<HTMLElement>) => void;
}

function NavBar(props: Props) {
    const { isSmallScreen, onSignIn } = props

    const navStyle = className('font-light text-white items-center flex', {
        'flex-col space-y-8 text-3xl pt-5 m-auto': isSmallScreen,
        'space-x-4 text-sm': !isSmallScreen
    })
    
    const linkStyle = className('leading-9 hover:cursor-pointer', {
        'hover:border-b border-green-500': !isSmallScreen
    })

    const links = [{
        icon: <GiHouse />,
        text: 'Buy a property'
    }, {
        icon: <MdHelp />,
        text: 'Help'
    }]

    const buttons = [{
        text: 'Join',
        type: 'secondary',
        onClick: () => { },
        id: ELEMENT_ID.JOIN_BUTTON
    }, {
        text: 'Sign In',
        type: 'primary',
        onClick: onSignIn,
        id: ELEMENT_ID.SIGN_IN_BUTTON
    }]

    const buttonHeight = isSmallScreen ? 'h-16' : 'h-9'
    const buttonWidth = isSmallScreen ? 'w-64' : 'w-28'

    return (
        <nav className={navStyle}>
            {links.map(({icon, text}, index) => {
                return (<a className={linkStyle} key={index}>
                    {icon}
                    <span className="ml-2 align-middle">{text}</span>
                </a>)
            })}
            {buttons.map(({text, type, onClick, id}) => {
                return <Button id={id} key={text} type={type} height={buttonHeight} width={buttonWidth} onClick={onClick}>{text}</Button>
            })}
        </nav>
    )
}

export default NavBar
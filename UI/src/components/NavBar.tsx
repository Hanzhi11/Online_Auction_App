import { GiHouse } from 'react-icons/gi';
import { MdHelp } from 'react-icons/md';
import className from 'classnames';
import Button from './Button';
import { ELEMENT_ID } from './Constants';
import { Link } from 'react-router-dom';
import { OverLayContentContext, WindowSizeContext } from '../App';
import { useContext } from 'react';

function NavBar() {
    const windowSize = useContext(WindowSizeContext);
    const { overLayContent, updateOverLayContent } = useContext(
        OverLayContentContext,
    );

    const isSmallScreen = windowSize.width < 768;

    const isColumnDisplay = overLayContent !== '' || isSmallScreen;

    const navStyle = className('font-light text-white items-center flex', {
        'flex-col space-y-8 text-3xl pt-5 m-auto': isColumnDisplay,
        'space-x-4 text-sm': !isColumnDisplay,
    });

    const linkStyle = className('leading-9 cursor-pointer flex items-center', {
        'hover:border-b border-green-500': !isColumnDisplay,
    });

    const links = [
        {
            icon: <GiHouse />,
            text: 'Buy a property',
            to: '/',
            onClick: () => updateOverLayContent(''),
        },
        {
            icon: <MdHelp />,
            text: 'Help',
            to: '/',
            onClick: () => updateOverLayContent(''),
        },
    ];

    const buttons = [
        {
            text: 'Join',
            type: 'secondary',
            onClick: () => updateOverLayContent(''),
            id: ELEMENT_ID.JOIN_BUTTON,
        },
        {
            text: 'Sign In',
            type: 'primary',
            onClick: () => {},
            id: ELEMENT_ID.SIGN_IN_BUTTON,
        },
    ];

    const buttonHeight = isColumnDisplay ? 'h-16' : 'h-9';
    const buttonWidth = isColumnDisplay ? 'w-64' : 'w-28';

    return (
        <nav className={navStyle}>
            {links.map(({ icon, text, to, onClick }, index) => {
                return (
                    <Link
                        className={linkStyle}
                        key={index}
                        to={to}
                        onClick={onClick}
                    >
                        {icon}
                        <span className='ml-2 align-middle'>{text}</span>
                    </Link>
                );
            })}
            {buttons.map(({ text, type, onClick, id }) => {
                return (
                    <Button
                        id={id}
                        key={text}
                        type={type}
                        height={buttonHeight}
                        width={buttonWidth}
                        onClick={onClick}
                    >
                        {text}
                    </Button>
                );
            })}
        </nav>
    );
}

export default NavBar;

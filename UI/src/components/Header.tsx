import { IconContext } from 'react-icons';
import { GiHamburgerMenu } from 'react-icons/gi';
import { useContext, useEffect, useState } from 'react';
import OverLay from './OverLay';
import className from 'classnames';
import NavBar from './NavBar';
import { ELEMENT_ID, OVERLAY_CONTENTS } from './Constants';
import Logo from './Logo';
import SectionContainer from './SectionContainer';
import { useLocation } from 'react-router-dom';
import Button from './Button';
import { OverLayContentContext, WindowSizeContext } from '../App';

function Header() {
    const location = useLocation();
    const isHomePage = location.pathname === '/';

    const windowSize = useContext(WindowSizeContext);
    const { overLayContent, updateOverLayContent } = useContext(
        OverLayContentContext,
    );

    const [offset, setOffset] = useState(0);
    const [isTransparent, setIsTransparent] = useState(false);
    const [runnerHeight, setRunnerHeight] = useState(0);

    useEffect(() => {
        const homeRunner = document.getElementById(
            ELEMENT_ID.HOME_RUNNER,
        ) as HTMLElement;

        if (!homeRunner) {
            setIsTransparent(false);
            window.onscroll = null;
            return;
        }

        if (!homeRunner.onload) {
            homeRunner.onload = () => {
                const height = homeRunner.getBoundingClientRect().height;
                setRunnerHeight(height);
            };
        }

        if (!window.onscroll) {
            window.onscroll = () => {
                setOffset(window.scrollY);
            };
        }

        let newIsTransparent = false;
        const homeRunnerHeight = homeRunner.offsetHeight;
        if (homeRunnerHeight - offset > 112) {
            newIsTransparent = true;
        }
        setIsTransparent(newIsTransparent);
    }, [offset, windowSize, location.pathname, runnerHeight]);

    const isSmallScreen = windowSize.width < 768;

    const topStyle = className('bg-indigo-900 h-20 flex justify-center', {
        'bg-opacity-70': isTransparent,
    });

    const bottomStyle = className('bg-green-500 h-8', {
        'bg-opacity-90 saturate-75': isTransparent,
    });

    let content: JSX.Element = <NavBar />;
    if (isSmallScreen && overLayContent === '') {
        content = (
            <IconContext.Provider
                value={{ color: 'white', size: '1.8rem', className: 'inline' }}
            >
                <Button
                    id={ELEMENT_ID.NAV_OPEN_BUTTON}
                    onClick={() => updateOverLayContent(OVERLAY_CONTENTS.NAV)}
                    classNames='md:hidden'
                    width='w-fit'
                >
                    <GiHamburgerMenu />
                </Button>
            </IconContext.Provider>
        );
    } else if (overLayContent === OVERLAY_CONTENTS.NAV) {
        content = <OverLay>{content}</OverLay>;
    } else if (overLayContent !== '') {
        content = <></>;
    }

    const headerStyle = className('w-full top-0 z-9999', {
        fixed: isHomePage,
        sticky: !isHomePage,
    });

    return (
        <div>
            <header className={headerStyle} id={ELEMENT_ID.HEADER}>
                <div className={topStyle}>
                    <SectionContainer style='flex justify-between px-7'>
                        <Logo />
                        {content}
                    </SectionContainer>
                </div>
                <div className={bottomStyle}></div>
            </header>
            {isHomePage && (
                <img
                    src='/runner.jpeg'
                    className='max-h-[25vh] min-h-[7rem] w-full object-cover'
                    id={ELEMENT_ID.HOME_RUNNER}
                />
            )}
        </div>
    );
}

export default Header;

import { IconContext } from "react-icons";
import { GiHamburgerMenu } from "react-icons/gi";
import { useState } from "react";
import OverLay from "./OverLay";
import className from 'classnames';
import NavBar from "./NavBar";
import { ELEMENT_ID } from './Constants'

function Header() {
    const [overLayStatus, setOverLayStatus] = useState({
        isOpen: false,
        isForNav: true
    })
    const [offset, setOffset] = useState(0)
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    })

    window.onscroll = () => {
        setOffset(window.scrollY)
    }

    window.onresize = () => {
        setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight
        })
    }

    const handleOnClick = (event: React.MouseEvent<Element>) => {
        let button = event.target as HTMLElement
        if (button?.tagName !== 'BUTTON') {
            button = button?.closest('button') as HTMLElement
        }
        if (button) {
            const id = button.id
            switch (id) {
                case ELEMENT_ID.SIGN_IN_BUTTON:
                    setOverLayStatus({
                        isOpen: true,
                        isForNav: false
                    })
                    break
                case ELEMENT_ID.NAV_OPEN_BUTTON:
                    setOverLayStatus({
                        isOpen: true,
                        isForNav: true
                    })
                    break
                case ELEMENT_ID.CLOSE_OVERLAY_BUTTON:
                    setOverLayStatus({
                        isOpen: false,
                        isForNav: true
                    })
                    break
            }
        }
    }

    const homeRunner = document.getElementById(ELEMENT_ID.HOME_RUNNER) as HTMLElement
    const isTransparent = homeRunner?.offsetHeight !== 112 && offset <= homeRunner?.offsetHeight - 112
    const isSmallScreen = windowSize.width < 768

    const topStyle = className('bg-indigo-900 h-20 flex justify-center', {
        'bg-opacity-70': isTransparent
    })

    const bottomStyle = className('bg-green-500 h-8', {
        'bg-opacity-90 saturate-75': isTransparent
    })


    let iconSize = '1rem'
    if (overLayStatus.isOpen || isSmallScreen) {
        iconSize = '1.8rem'
    }

    const navContent = <NavBar isSmallScreen={overLayStatus.isOpen || isSmallScreen} onSignIn={handleOnClick} />

    let content
    if (isSmallScreen) {
        content = (
            <button id={ELEMENT_ID.NAV_OPEN_BUTTON} className="md:hidden hover:cursor-pointer my-auto" onClick={handleOnClick}>
                < GiHamburgerMenu />
            </button>
        )
    } else {
        content = navContent
    }

    if (overLayStatus.isOpen) {
        const overLayContent = overLayStatus.isForNav ? navContent : <div>sign in</div>
        content = (
            <OverLay onClose={handleOnClick}>
                {overLayContent}
            </OverLay>
        )
    }

    return (
        <IconContext.Provider value={{ color: 'white', size: iconSize, className: 'inline' }}>
            <header className="fixed top-0 w-full z-50" id={ELEMENT_ID.HEADER}>
                <div className={topStyle}>
                    <div className="w-full flex px-[4%] md:w-[720px] md:px-0 lg:w-[940px] xl:w-[1140px]">
                        <a className="w-fit flex items-center hover:cursor-pointer mr-auto">
                            <img src="/logo.svg" className="h-8 mr-3 scale-90" />
                            <span className="text-white tracking-[0.3em] text-2xl">BIDNOW</span>
                        </a>
                        {content}
                    </div>
                </div>
                <div className={bottomStyle}></div>
            </header>
        </IconContext.Provider >
    )
}

export default Header

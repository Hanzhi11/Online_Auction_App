import { IconContext } from "react-icons";
import { GiHamburgerMenu } from "react-icons/gi";
import { useEffect, useState } from "react";
import OverLay from "./OverLay";
import className from "classnames";
import NavBar from "./NavBar";
import { ELEMENT_ID } from "./Constants";
import Logo from "./Logo";
import SectionContainer from "./SectionContainer";
import { useLocation } from "react-router-dom";

function Header() {
    const location = useLocation();
    const isHomePage = location.pathname === "/";

    const [overLayStatus, setOverLayStatus] = useState({
        isOpen: false,
        isForNav: true,
    });
    const [offset, setOffset] = useState(0);
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });
    const [isTransparent, setIsTransparent] = useState(false);

    useEffect(() => {
        const homeRunner = document.getElementById(
            ELEMENT_ID.HOME_RUNNER
        ) as HTMLElement;
        if (!window.onresize) {
            window.onresize = () => {
                setWindowSize({
                    width: window.innerWidth,
                    height: window.innerHeight,
                });
            };
        }

        if (!homeRunner) {
            setIsTransparent(false);
            window.onscroll = null;
            return;
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
    }, [offset, windowSize, location.pathname]);

    const handleOnClick = (event: React.MouseEvent<Element>) => {
        let button = event.target as HTMLElement;
        if (button?.tagName !== "BUTTON") {
            button = button?.closest("button") as HTMLElement;
        }
        if (button) {
            const id = button.id;
            switch (id) {
                case ELEMENT_ID.SIGN_IN_BUTTON:
                    setOverLayStatus({
                        isOpen: true,
                        isForNav: false,
                    });
                    break;
                case ELEMENT_ID.NAV_OPEN_BUTTON:
                    setOverLayStatus({
                        isOpen: true,
                        isForNav: true,
                    });
                    break;
                case ELEMENT_ID.CLOSE_OVERLAY_BUTTON:
                    setOverLayStatus({
                        isOpen: false,
                        isForNav: true,
                    });
                    break;
            }
        }
    };

    const isSmallScreen = windowSize.width < 768;

    const topStyle = className("bg-indigo-900 h-20 flex justify-center", {
        "bg-opacity-70": isTransparent,
    });

    const bottomStyle = className("bg-green-500 h-8", {
        "bg-opacity-90 saturate-75": isTransparent,
    });

    let iconSize = "1rem";
    if (overLayStatus.isOpen || isSmallScreen) {
        iconSize = "1.8rem";
    }

    const navContent = (
        <NavBar
            isSmallScreen={overLayStatus.isOpen || isSmallScreen}
            onSignIn={handleOnClick}
        />
    );

    let content;
    if (isSmallScreen) {
        content = (
            <button
                id={ELEMENT_ID.NAV_OPEN_BUTTON}
                className="md:hidden hover:cursor-pointer my-auto"
                onClick={handleOnClick}
            >
                <GiHamburgerMenu />
            </button>
        );
    } else {
        content = navContent;
    }

    if (overLayStatus.isOpen) {
        const overLayContent = overLayStatus.isForNav ? (
            navContent
        ) : (
            <div>sign in</div>
        );
        content = <OverLay onClose={handleOnClick}>{overLayContent}</OverLay>;
    }

    const headerStyle = className("w-full top-0 z-9999", {
        fixed: isHomePage,
        sticky: !isHomePage,
    });

    return (
        <IconContext.Provider
            value={{ color: "white", size: iconSize, className: "inline" }}
        >
            <header className={headerStyle} id={ELEMENT_ID.HEADER}>
                <div className={topStyle}>
                    <SectionContainer style="flex">
                        <Logo />
                        {content}
                    </SectionContainer>
                </div>
                <div className={bottomStyle}></div>
            </header>
            {isHomePage && (
                <div
                    className="h-52 max-h-[25vh] min-h-[7rem] overflow-hidden"
                    id={ELEMENT_ID.HOME_RUNNER}
                >
                    <img src="/runner.jpeg" />
                </div>
            )}
        </IconContext.Provider>
    );
}

export default Header;

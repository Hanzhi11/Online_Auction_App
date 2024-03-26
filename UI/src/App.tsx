import { createContext, useEffect, useState } from 'react';
import Footer from './components/Footer.tsx';
import Header from './components/Header.tsx';
import Home from './components/Home.tsx';
import Listing from './components/Listing.tsx';
import Pdf from './components/Pdf.tsx';
import { Route, Routes, useLocation } from 'react-router-dom';
import { ELEMENT_ID } from './shared/Constants.tsx';
import NotificationBanner from './components/NotificationBanner.tsx';

interface NotificationContext {
    notificationContent: string | null;
    setNotificationContent: (content: string | null) => void
}

export const WindowSizeContext = createContext({ width: 0, height: 0 });
export const OverLayContentContext = createContext({
    overLayContent: '',
    updateOverLayContent: (value: string) => {
        value;
    },
});
export const NotificationContext = createContext<NotificationContext>({
    notificationContent: null,
    setNotificationContent: () => {},
});

function App() {
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    const [overLayContent, setOverLayContent] = useState('');
    const updateOverLayContent = (content: string) => {
        setOverLayContent(content);
    };

    const [notificationContent, setNotificationContent] = useState<string | null>(null);

    const location = useLocation();
    let isPdfPage = false;

    // eslint-disable-next-line no-useless-escape
    const regex = /^\/document\/[^\/]+\/[^\/]+\/*?$/
    if(location.pathname.match(regex)) {
        isPdfPage = true
    }

    useEffect(() => {
        window.onresize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };
        return () => {
            window.onresize = null;
        };
    }, []);
    return (
        <WindowSizeContext.Provider value={windowSize}>
            <OverLayContentContext.Provider
                value={{ overLayContent, updateOverLayContent }}
            >
                <NotificationContext.Provider
                    value={{ notificationContent, setNotificationContent }}
                >
                    <div className='min-h-screen min-w-[280px] flex flex-col overflow-hidden'>
                        {!isPdfPage && <Header />}
                        <Routes>
                            <Route path='/' element={<Home />} />
                            <Route path='/listing/:id' element={<Listing />} />
                            <Route path='/document/:about/:id' element={<Pdf />} />
                            <Route path='/*' element={<Home />} />
                        </Routes>
                        {!isPdfPage && <Footer />}
                    </div>
                    <div id={ELEMENT_ID.OVERLAY}></div>
                    <NotificationBanner />
                </NotificationContext.Provider>
            </OverLayContentContext.Provider>
        </WindowSizeContext.Provider>
    );
}

export default App;

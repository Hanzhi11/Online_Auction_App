import { createContext, useEffect, useState } from 'react';
import Footer from './components/Footer.tsx';
import Header from './components/Header.tsx';
import Home from './components/Home.tsx';
import Listing from './components/Listing.tsx';
import Pdf from './components/Pdf.tsx';
import { Route, Routes, useLocation } from 'react-router-dom';

export const WindowSizeContext = createContext({ width: 0, height: 0 });
export const OverLayContentContext = createContext({
    overLayContent: '',
    updateOverLayContent: (value: string) => {
        value;
    },
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

    const location = useLocation();
    let isPdfPage = false;
    const locationPathFrags = location.pathname.split('/');
    if (locationPathFrags.length > 0 && locationPathFrags[1] === 'pdf') {
        isPdfPage = true;
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
                <div className='min-h-screen min-w-[280px] flex flex-col'>
                    {!isPdfPage && <Header />}
                    <Routes>
                        <Route path='/' element={<Home />} />
                        <Route path='/listing/:id' element={<Listing />} />
                        <Route path='/pdf/:id' element={<Pdf />} />
                    </Routes>
                    {!isPdfPage && <Footer />}
                </div>
                <div id='overLay'></div>
            </OverLayContentContext.Provider>
        </WindowSizeContext.Provider>
    );
}

export default App;

import Footer from './components/Footer.tsx';
import Header from './components/Header.tsx';
import Home from './components/Home.tsx'
import Listing from './components/Listing.tsx'
import {
    BrowserRouter,
    Route,
    Routes,
} from "react-router-dom";

function App() {
    return (
        <div className='flex flex-col min-h-screen'>
            <BrowserRouter>
            <Header />
            <Routes>
                <Route path= "/" element={<Home/>}/>
                <Route path= "/listing/:id" element={<Listing/>}/>
            </Routes>
            <Footer />
            </BrowserRouter>
        </div>
    )
}

export default App
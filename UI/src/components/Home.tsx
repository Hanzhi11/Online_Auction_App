import { ELEMENT_ID } from './Constants'
import Header from './Header'
import Search from './Search'
import Auctions from './Auctions'
import Footer from './Footer'

function Home() {
  return (
    <>
      <main>
        <div className='h-52 max-h-[25vh] min-h-[7rem] overflow-hidden' id={ELEMENT_ID.HOME_RUNNER}>
          <img src='/runner.jpeg' />
        </div>
        <Search />
        <Auctions />
        <Footer />
      </main>
      <Header />
    </>
  )
}

export default Home

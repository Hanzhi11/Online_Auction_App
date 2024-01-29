import { ELEMENT_ID } from './components/Constants'
import Header from './components/Header'
import Search from './components/Search'

function App() {

  return (
    <>
      <Header />
      <main>
        <div className='h-52 max-h-[25vh] min-h-[7rem] overflow-hidden' id={ELEMENT_ID.HOME_RUNNER}>
          <img src='/runner.jpeg' />
        </div>
        <Search />
        <div className='h-96'>hi</div>
      </main>
    </>
  )
}

export default App

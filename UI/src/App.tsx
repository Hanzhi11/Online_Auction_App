import { useEffect, useState } from 'react'
import { ELEMENT_ID } from './components/Constants'
import Header from './components/Header'
import Search from './components/Search'
import Auctions from './components/Auctions'

interface State {
  postCode: string,
  name: string
}

function App() {
  const [data, setData] = useState<string[]>([])
  useEffect(() => {
    fetch('https://localhost:7184/State')
    .then(res => res.json())
    .then(data => setData(data.map((s: State) => <p>{s.postCode}</p>)))
  })
  return (
    <>
      <Header />
      <main>
        <div className='h-52 max-h-[25vh] min-h-[7rem] overflow-hidden' id={ELEMENT_ID.HOME_RUNNER}>
          <img src='/runner.jpeg' />
        </div>
        <Search />
        <Auctions />
        <p>{data}</p>
      </main>
    </>
  )
}

export default App

import { Decoder } from './Components/Decoder/Decoder'
import { Footer } from './Components/Footer/Footer'

import './App.css'

const text: string = 'Moises Santana Velasco'

function App() {


  return (
    <>
      <h1>Decoder</h1>
      <Decoder />
      <Footer text={text}/>
    </>
  )
}

export default App

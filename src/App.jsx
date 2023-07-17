import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import PageLogin from './pages/PageLogin'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <PageLogin />
    </>
  )
}

export default App

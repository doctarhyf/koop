import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import PageLogin from './pages/PageLogin'
import PageHome from './pages/PageHome'

function App() {
  const [selectedPage, setSelectedPage] = useState('login')
  return (
    <>
      { 'login' === selectedPage && <PageLogin setSelectedPage={setSelectedPage} /> }
      { 'home' === selectedPage && <PageHome setSelectedPage={setSelectedPage} /> }
    </>
  )
}

export default App

import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import PageLogin from './pages/PageLogin'
import PageHome from './pages/PageHome'
import PageLookingForServ from './pages/PageLookingForServ'
import PageReqNewServ from './pages/PageReqNewServ'
import PageProvServ from './pages/PageProvServ'
import PageMyAccount from './pages/PageMyAccount'

function App() {
  
  const [selectedPage, setSelectedPage] = useState('login')

  return (
    <>
      { 'login' === selectedPage && <PageLogin setSelectedPage={setSelectedPage} /> }
      { 'home' === selectedPage && <PageHome setSelectedPage={setSelectedPage} /> }
      { 'lookingforserv' === selectedPage && <PageLookingForServ setSelectedPage={setSelectedPage} /> } 
      { 'reqserv' === selectedPage && <PageReqNewServ setSelectedPage={setSelectedPage} /> }
      { 'provserv' === selectedPage && <PageProvServ setSelectedPage={setSelectedPage} /> } 
      { 'myacc' === selectedPage && <PageMyAccount setSelectedPage={setSelectedPage} /> }
    </>
  )
}

export default App

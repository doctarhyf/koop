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
import PageMyPostedServ from './pages/PageMyPostedServ'
import PageShopDetails from './pages/PageShopDetails'
import { ROUTES } from './helpers/flow'
import PageOtherServices from './pages/PageOtherServices'
import PageServiceDetails from './pages/PageServiceDetails'

function App() {
  
  const [selectedPage, setSelectedPage] = useState(ROUTES.LOGIN.name)

  return (
    <>

    <PageLogin setSelectedPage={setSelectedPage} />
      {/* { ROUTES.LOGIN.name === selectedPage && <PageLogin setSelectedPage={setSelectedPage} /> }
      { ROUTES.HOME.name === selectedPage && <PageHome setSelectedPage={setSelectedPage} /> }
      { ROUTES.LOOKING_FOR_SERVICE.name === selectedPage && <PageLookingForServ setSelectedPage={setSelectedPage} /> } 
      { ROUTES.REQUEST_SERVICE.name === selectedPage && <PageReqNewServ setSelectedPage={setSelectedPage} /> }
      { ROUTES.PROVIDE_SERVICE.name === selectedPage && <PageProvServ setSelectedPage={setSelectedPage} /> } 
      { ROUTES.MY_ACOUNT.name === selectedPage && <PageMyAccount setSelectedPage={setSelectedPage} /> }
      { ROUTES.MY_POSTED_SERVICES.name === selectedPage && <PageMyPostedServ setSelectedPage={setSelectedPage} /> }
      { ROUTES.SHOW_SHOP.name === selectedPage && <PageShopDetails setSelectedPage={setSelectedPage} /> }
      { ROUTES.SHOW_SERVICE_DETAILS.name === selectedPage && <PageServiceDetails setSelectedPage={setSelectedPage} /> }
      { ROUTES.OTHER_SERVICES.name === selectedPage && <PageOtherServices setSelectedPage={setSelectedPage} /> }
     */}
    </>
  )
}

export default App

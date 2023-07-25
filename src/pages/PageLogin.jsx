import React, { useEffect, useState } from "react";
import koop from '/koop.png'
import { mainDiapo } from "../helpers/fakeData";
import { clFormButton, clInputText, sizeFormBtnIcon, clPage } from "../helpers/class";
import { FORMS, ROUTES } from "../helpers/flow";
import styles from '../styles/main.module.css'
import icoUser from '../assets/icons/user.png'
import DiapoItem from "../comps/DiapoItem";


function FormTabTitle(props){
    const { data, onFormTabClicked, selectedTab } = props;
    const isSelected = selectedTab === data.tabname

    function onClick(e){
        onFormTabClicked(data)
    }

    return(
        <button onClick={onClick} className={`p-2 border border-white ${ isSelected ? 'border border-white border-b-koop-def text-koop-def' : '' }`} >{ data.title }</button> 
    )
}

function FormTabTitlesCont(props){

    const { onFormTabClicked, selectedTab } = props;

    return(
        <div className="text-black flex justify-around mb-2">
           { Object.values(FORMS).map((it, i) => <FormTabTitle onFormTabClicked={onFormTabClicked} key={i} data={it} selectedTab={selectedTab} /> ) }
        </div>
    )
}

export default function PageLogin(props){

    const [selectedTab, setSelectedTab] = useState(FORMS.LOGIN.tabname)
    const [agree, setAgree] = useState(false);
    const { setSelectedPage } = props;

    function onFormTabClicked(data){
        console.warn(data)
        const { title,  tabname } = data;
    
        setSelectedTab(tabname);

        console.log(tabname)
    }

    function onDiapoItemClicked(d){
        setSelectedPage(ROUTES.SHOW_SHOP.name)
    }

    return(
        <section className={clPage}>
           
            <article className="pg-login" page='login'>

                <div className="top p-4 flex-col flex justify-center items-center ">
                    <img className="w-[200px]" src={koop} />

                    <p className="text-slate-900 text-center mb-2">+ 1 millions de services et des professionels au bout de vos doigts</p>

                    <div className={`diapo-cont rounded-[14pt] overflow-x-auto w-full pb-4 `}>
                        <div className="flex flex-row">

                        {
                            mainDiapo.map((it, i) => <DiapoItem onDiapoItemClicked={onDiapoItemClicked} key={i}  data={it}   /> )
                        } 
                        
                        </div>
                    </div>


                </div>

                <div className="shadow-lg shadow-slate-500 m-8 form-cont bg-white rounded-t-[40px] p-8">
                    
                    <FormTabTitlesCont data={null} onFormTabClicked={onFormTabClicked} selectedTab={selectedTab }  />

                    <div className="text-black " tabcont='loginSignup'>
                        { FORMS.SIGNUP.tabname === selectedTab && 
                        <form  tabName='signup'>
                            <input className={clInputText}  type="text" placeholder="Nom" />
                            <input className={clInputText}  type="text" placeholder="Phone" />
                            <input className={clInputText}  type="text" placeholder="OTP" />
                            <input className={clInputText}  type="password" placeholder="Password" />
                            <input className={clInputText}  type="password" placeholder="Re-Password" />
                            <div className="my-2 py-2" >
                                <input className="mr-2" type="checkbox" value={agree} onChange={e => setAgree(!agree)}/>
                                Agree to <a href="http://www.google.com">terms and conditions</a>
                            </div>
                            <button onClick={e => setSelectedPage('home')} disabled={!agree} className={` flex justify-center items-center ${clFormButton}`}>
                                <span><img width={sizeFormBtnIcon}  src={icoUser}/></span><span className="w-[10pt]"></span>Sign up
                            </button>
                        </form> }

                        {
                            FORMS.LOGIN.tabname === selectedTab &&
                            
                            <form tabName='login'>
                            <input className={clInputText}  type="text" placeholder="Phone" />
                            <input className={clInputText}  type="text" placeholder="Password" />
                            <button  onClick={e => setSelectedPage('home')}  className={clFormButton}>Login</button>
                            <button className="text-red-600 hover:text-red-500 w-full text-center">Mot de passe oublie?</button>
                        </form>}
                    </div>
                </div>

            </article>
            
           

        </section>
    )
}
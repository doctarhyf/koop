import React, { useState } from "react";
import koop from '/koop.png'
import { mainDiapo } from "../helpers/fakeData";
import { clFormButton, clInputText } from "../helpers/class";
import img from '../assets/diapo/p1.jpg'
import { FORMS } from "../helpers/flow";
import styles from '../styles/main.module.css'

function DiapoItem(props){
    const { data } = props;
    
    function onClick(e){
        console.log(e)
    }

    return (
        <button onClick={onClick}  className="flex-shrink-0 cursor-pointer  overflow-hidden w-[240pt] rounded-[14pt] h-[140pt] bg-slate-500 mx-2"  >
            <img src={img} className="object-cover w-full " />
        </button>
    )
}

function FormTabTitle(props){
    const [active, setActive] = useState(true);
    const { data, onFormTabClicked } = props;

    function onClick(e){
        const newState = !active;
        setActive(newState);
        data.active  = newState;
        onFormTabClicked(data);
    }

    return(
        <button onClick={onClick} className={`p-2 border border-white ${ active ? 'border border-white border-b-koop-def text-koop-def' : '' }`} >{ data.title }</button> 
    )
}

function FormTabTitlesCont(props){

    const { onFormTabClicked } = props;

    return(
        <div className="text-black flex justify-around mb-2">
           { Object.values(FORMS).map((it, i) => <FormTabTitle onFormTabClicked={onFormTabClicked} key={i} data={it} /> ) }
        </div>
    )
}

export default function PageLogin(props){

    const [selectedForm, setSelectedForm] = useState(FORMS.LOGIN.tabName)
    const [agree, setAgree] = useState(false)

    function onFormTabClicked(data){
        console.warn(data)
        const { title, tabName, tabContName, active } = data;
    
        setSelectedForm(tabName);
    }

    return(
        <section className="bg-koop-def text-white h-screen w-full">
            
            <div className="top p-4 flex-col flex justify-center items-center ">
                <img className="w-[200px]" src={koop} />

                <p className="text-slate-900 text-center mb-2">+ 1 millions de services et des professionels au bout de vos doigts</p>

                <div className={`diapo-cont rounded-[14pt] overflow-x-auto w-full `}>
                    <div className="flex flex-row">
                       {
                         mainDiapo.map((it, i) => <DiapoItem key={i} data={i}  /> )
                       } 
                     
                    </div>
                </div>


            </div>

            <div className="shadow-lg shadow-slate-500 m-8 form-cont bg-white rounded-t-[40px] p-8">
                
                <FormTabTitlesCont data={null} onFormTabClicked={onFormTabClicked}  />

                <div className="text-black " tabCont='loginSignup'>
                    { FORMS.SIGNUP.tabName === selectedForm && 
                    <form className="p-2" tabName='signup'>
                        <input className={clInputText} type="text" placeholder="Nom" />
                        <input className={clInputText}  type="text" placeholder="Phone" />
                        <input className={clInputText}  type="text" placeholder="OTP" />
                        <input className={clInputText}  type="text" placeholder="Password" />
                        <div className="my-2 py-2" >
                            <input type="checkbox" value={agree} onChange={e => setAgree(!agree)}/>
                            Agree to <a href="http://www.google.com">terms and conditions</a>
                        </div>
                        <button disabled={!agree} className={clFormButton}>Sign up</button>
                    </form> }

                    {
                        FORMS.LOGIN.tabName === selectedForm &&
                        
                        <form tabName='login'>
                        <input className={clInputText}  type="text" placeholder="Phone" />
                        <input className={clInputText}  type="text" placeholder="Password" />
                        <button className={clFormButton}>Login</button>
                    </form>}
                </div>
            </div>

        </section>
    )
}
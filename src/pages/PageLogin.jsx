import React, { useState } from "react";
import koop from '/koop.png'
import { mainDiapo } from "../helpers/fakeData";
import { clFormButton, clInputText } from "../helpers/class";
import img from '../assets/diapo/p1.jpg'
import { FORMS } from "../helpers/flow";

function DiapoItem(props){
    const { data } = props;
    //const img = require( `../assets/diapo/p1.jpg` )

    return (
        <div className="flex-shrink-0 overflow-hidden w-[240pt] rounded-[14pt] h-[140pt] bg-slate-500 m-2"  >
            <img src={img} className="object-cover w-full " />
        </div>
    )
}

function FormTabTitle(props){
    const [active, setActive] = useState(true);
    const { data } = props;

    return(
        <button onClick={e => setActive(!active)} className={`p-2 border border-white ${ active ? 'border border-white border-b-koop-def text-koop-def' : '' }`} >{ data.title }</button> 
    )
}

function FormTabTitlesCont(props){

    

    return(
        <div className="text-black flex justify-around">
            { Object.values(FORMS).map((it, i) => <FormTabTitle key={i} data={it} /> ) }
        </div>
    )
}

export default function PageLogin(props){

    const [selectedForm, setSelectedForm] = useState(FORMS.LOGIN.tabName)

    return(
        <section className="bg-koop-def text-white h-screen w-full">
            
            <div className="top p-4 flex-col flex justify-center items-center ">
                <img className="w-[200px]" src={koop} />

                <p className="text-slate-900 text-center">+ 1 millions de services et des professionels au bout de vos doigts</p>

                <div className="overflow-x-auto w-full">
                    <div className="flex flex-row">
                       {
                         mainDiapo.map((it, i) => <DiapoItem key={i} data={i}  /> )
                       } 
                       
                    </div>
                    </div>

                {/* <div className="main-diapo flex p-4 overflow-scroll  ">
                    {
                       <DiapoItem key={i} data={it} />)
                    }
                </div> */}

            </div>

            <div className=" form-cont bg-white rounded-t-[40px] p-8">
                
                <FormTabTitlesCont data={null}  />

                <div className="text-black" tabCont='loginSignup'>
                    { FORMS.LOGIN.tabName === selectedForm && 
                    <form className="p-2" tabName='signup'>
                        <input className={clInputText} type="text" placeholder="Nom" />
                        <input className={clInputText}  type="text" placeholder="Nom" />
                        <input className={clInputText}  type="text" placeholder="Nom" />
                        <input className={clInputText}  type="text" placeholder="Nom" />
                        <button className={clFormButton}>Sign up</button>
                    </form> }

                    {
                        FORMS.SIGNUP.tabName === selectedForm &&
                        
                        <form tabName='login'>
                        <input className={clInputText}  type="text" placeholder="Nom" />
                        <input className={clInputText}  type="text" placeholder="Nom" />
                        <button className={clFormButton}>Login</button>
                    </form>}
                </div>
            </div>

        </section>
    )
}
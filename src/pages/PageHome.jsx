import React, { useEffect, useState } from "react";
import * as classes from "../helpers/class";
import provserv from '../assets/icons/provserv.png'
import lookserv from '../assets/icons/lookserv.png'
import otherserv from '../assets/icons/otherserv.png'
import '../App.css'
import MenuTopBar from "../comps/MenuTopBar";

function ButtonHomeMenu(props){
    
    const {label, icon, setSelectedPage, route} = props;
   
    
    return (
        <button onClick={ e => setSelectedPage(route)} className="border w-max min-w-[50%] hover:bg-koop-d hover:text-white hover:shadow-md shadow-koop-d flex items-center space-x-2 border-koop-def px-4 py-2 bg-white rounded-xl text-black" >
            <span><img className="  object-cover " width={40} height={40} src={icon} /></span>
            <span>{label}</span>
        </button>
    )
}

export default function PageHome(props){

    
    const { setSelectedPage } = props;


    return(
        <section className={` p-2 ${classes.clPage}`}>
           
            <MenuTopBar setSelectedPage={setSelectedPage} />

            <div className="billbord flex flex-col items-center">

                <img className="w-[50%]" src={'/koop.png'} />

                <p className="text-center text-[24pt]">What would you like to do?</p>

            </div>

            <div className="flex flex-col gap-4 items-center  menu-cont bg-white rounded-[30pt] p-8 mt-8 mx-8">
                <ButtonHomeMenu setSelectedPage={setSelectedPage} route='login' label='Provide a Service' icon={provserv} />
                <ButtonHomeMenu setSelectedPage={setSelectedPage} route='lookingforserv' label='Look for a Service' icon={lookserv}  />
                <ButtonHomeMenu setSelectedPage={setSelectedPage} route='otherserv' label='Other Services' icon={otherserv} />
                <p className="text-black text-center flex ">
                You can pick weather you are lookig for a service or you wanna provide a service
                </p>
            </div>
            
        </section>
    )
}
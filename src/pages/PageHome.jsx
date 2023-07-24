import React, { useEffect, useState } from "react";
import * as classes from "../helpers/class";
import provserv from '../assets/icons/provserv.png'
import lookserv from '../assets/icons/lookserv.png'
import otherserv from '../assets/icons/otherserv.png'
import '../App.css'
import MenuTopBar from "../comps/MenuTopBar";
import ButtonHomeMenu from "../comps/ButtonHomeMenu";


export default function PageHome(props){

    
    const { setSelectedPage } = props;


    return(
        <section className={` p-2 ${classes.clPage}`}>
           
            <MenuTopBar setSelectedPage={setSelectedPage} title='HOME'/>

            <div className="billbord flex flex-col items-center">

                <img className="w-[50%]" src={'/koop.png'} />

                <p className="text-center text-[24pt]">What would you like to do?</p>

            </div>

            <div className="flex flex-col gap-4 items-center  menu-cont bg-white rounded-[30pt] p-8 mt-8 mx-8">
                <ButtonHomeMenu setSelectedPage={setSelectedPage} route='provserv' label='Provide a Service' icon={provserv} />
                <ButtonHomeMenu setSelectedPage={setSelectedPage} route='lookingforserv' label='Look for a Service' icon={lookserv}  />
                <ButtonHomeMenu setSelectedPage={setSelectedPage} route='otherserv' label='Other Services' icon={otherserv} />
                <p className="text-black text-center flex ">
                You can pick weather you are lookig for a service or you wanna provide a service
                </p>
            </div>
            
        </section>
    )
}
import React, { useEffect, useState } from "react";
import * as classes from "../helpers/class";
import provserv from '../assets/icons/provserv.png'
import lookserv from '../assets/icons/lookserv.png'
import otherserv from '../assets/icons/otherserv.png'
import '../App.css'
import MenuTopBar from "../comps/MenuTopBar";
import ButtonHomeMenu from "../comps/ButtonHomeMenu";
import call from '../assets/icons/call.png'
import map from '../assets/icons/map.png'
import mobilemoney from '../assets/icons/mobilemoney.png'

export default function PageOtherServices(props){

    
    const { setSelectedPage } = props;


    return(
        <section className={` p-2 ${classes.clPage}`}>
           
            <MenuTopBar setSelectedPage={setSelectedPage} title='OTHER SERVICES'/>

           

            <div className="flex flex-col gap-4 items-center  menu-cont text-black bg-white rounded-[30pt] p-8 mt-8 mx-8">
                <ButtonHomeMenu setSelectedPage={setSelectedPage} route='' label='ACHAT CREDIT' icon={call} />
                <ButtonHomeMenu setSelectedPage={setSelectedPage} route='' label='ENVOIR ARGENT TOUS RESEAUX' icon={mobilemoney}  />
                <p>Vous pouvez envoyer de l’argent a n’importe quel reseau mobile</p>
                <ButtonHomeMenu setSelectedPage={setSelectedPage} route='' label='SERVICES DANS LES PARAGES' icon={map} />
                <p className="text-black text-center flex ">
                Localiser tous les services dans les parages
                </p>
            </div>
            
        </section>
    )
}
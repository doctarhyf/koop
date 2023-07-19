import React, { useEffect, useState } from "react";
import * as classes from "../helpers/class";
import provserv from '../assets/icons/provserv.png'
import lookserv from '../assets/icons/lookserv.png'
import otherserv from '../assets/icons/otherserv.png'
import search from '../assets/icons/search.png'
import reqserv from '../assets/icons/reqserv.png'
import '../App.css'
import MenuTopBar from "../comps/MenuTopBar";
import SectionTitle from '../comps/SectionTitle'
import ButtonHomeMenu from "../comps/ButtonHomeMenu";


export default function PageReqNewServ(props){

    
    const { setSelectedPage } = props;

    const ar = new Array(8).fill(0);

    function onShowServiceDetails(d){
        console.log('onShowServiceDetails', d)
    }

    return(
        <section className={` p-2 ${classes.clPage}`}>
           
            <MenuTopBar setSelectedPage={setSelectedPage} />

            <div className="shadow-xl text-black flex flex-col gap-4 items-center  menu-cont bg-white rounded-[30pt] p-8 mt-8 mx-2">
                <ButtonHomeMenu label='Request New Service' icon={reqserv} />
                <p>To request a new which is not listed below</p>

                <section className="text-left w-full" >
                    
                    <SectionTitle label={'POPULAR SERVICES'} />

                   

                    <div className=" flex overflow-x-scroll gap-4 pb-4 rounded-lg ">
                        {
                            ar.map((it, i) => 
                            <button key={i} onClick={e => onShowServiceDetails(it)} >
                                <div className="bg-red-500 w-[150pt] h-[120pt] flex-shrink-0 rounded-lg" >Cool</div>
                            </button>
                                )
                        }


                    </div>


                </section>

                <section className="text-left w-full" >
                    
                    <SectionTitle label={'POPULAR SHOPS'} />

                   

                    <div className=" flex overflow-x-scroll gap-4 pb-4 rounded-lg ">
                        {
                            ar.map((it, i) => 
                            <button key={i} onClick={e => onShowShopDetails(it)} >
                                <div className="bg-red-500 w-[150pt] h-[120pt] flex-shrink-0 rounded-lg" >Cool</div>
                            </button>)
                        }


                    </div>

                    
                </section>

            </div>
            
        </section>
    )
}
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
import { SERVICES_TYPE } from '../helpers/fakeData'
import AudioPlayer from "../comps/AudioPlayer";


export default function PageServiceDetails(props){
    
    const { setSelectedPage } = props;

    const ar = new Array(8).fill(0);

    return(
        <section className={` p-2 ${classes.clPage}`}>
           
            <MenuTopBar setSelectedPage={setSelectedPage}  title='SERVICE DETAILS' />

            <div className="shadow-xl text-black flex flex-col gap-4 items-start  menu-cont bg-white rounded-[30pt] p-8 mt-8 mx-2">
                
                <div className="box-service-type w-full">
                    <SectionTitle label='SERVICE NAME' />
                    <p>Reparations des frigos</p>
                </div>

                <div className="box-service-type w-full">
                    <SectionTitle label='DATE' />
                    <p>{ new Date().toLocaleDateString() }</p>
                </div>

                <div className="box-service-type w-full flex flex-col">
                    <SectionTitle label='SERVICE DESCRIPTION' />
                    <textarea placeholder="Brief description about what you want ..."></textarea>
                </div>

                <div className="box-service-type w-full flex flex-col">
                    <SectionTitle label='BUDGET PROPOSED' />
                    <p>120 $</p>
                </div>

                <AudioPlayer />

                <div className="box-service-type w-full flex flex-col">
                    <SectionTitle label='PICTURES' />
                    
                    <div className=" flex overflow-x-scroll gap-4 pb-4 rounded-lg ">
                        {
                            ar.map((it, i) => 
                            <button key={i} onClick={e => console.log(it)} >
                                <div className="bg-red-500 w-[150pt] h-[120pt] flex-shrink-0 rounded-lg" >Cool</div>
                            </button>
                                )
                        }


                    </div>

                    
                </div>

                <ButtonHomeMenu setSelectedPage={setSelectedPage} label='Confirm' icon={reqserv} route={'home'} />

                

            </div>
            
        </section>
    )
}
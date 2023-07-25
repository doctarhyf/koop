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
import { SERVICES_TYPE } from '../helpers/fakeData';
import bin from '../assets/icons/bin.png';

function ListItem({ setSelectedPage, data }){

    function onClick(e){
        console.log(e.target.getAttribute('servid')  )
        
    }
    
    return(
        <div servid={'randid'} onClick={onClick} className="flex hover:bg-slate-200 p-4 gap-8 flex-row items-center text-black rounded-lg mb-8 overflow-hidden object-fit  h-[6 0pt]">
            <img src={'/diapo/p1.jpg'} width={120} className="rounded-lg flex flex-shrink" />
            
            <div className="flex flex-col gap-2">
                <h5>Title</h5>
                <div className="text-gray-400">{ new Date().toLocaleDateString() }</div>
                <div className="bg-green-500 text-sm text-white rounded-full px-2">+ 23 Personnes interested</div>

            </div>
            <div className="flex-grow" ></div>
            <button onClick={onClick}>
                <img src={bin} width={30} height={30} />
            </button>

        </div>
    )
}

export default function PageMyPostedServ(props){

    const { setSelectedPage } = props;

    const ar = new Array(8).fill(0);

    return (

        <section className={` p-2 ${classes.clPage}`}>
           
            <MenuTopBar setSelectedPage={setSelectedPage}  title='My Posted Services' />

            <input placeholder="Search services ..." type="search" className={`  ${ classes.clInputText } w-full `} />

            <div className="m-8 bg-white shadow-lg text-black p-8  rounded-t-[32pt]">
                {
                    ar.map((it, i) => <ListItem key={i} data={it} />)
                }
            </div>

        </section>
        
    )
}
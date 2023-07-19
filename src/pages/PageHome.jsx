import React, { useEffect, useState } from "react";
import * as classes from "../helpers/class";
import menu from '../assets/icons/menu.png'
import provserv from '../assets/icons/provserv.png'
import lookserv from '../assets/icons/lookserv.png'
import otherserv from '../assets/icons/otherserv.png'
import rhyf from '../assets/icons/rhyf.png'
import reqserv from '../assets/icons/reqserv.png'
import postedserv from '../assets/icons/postedserv.png'
import inbox from '../assets/icons/inbox.png'
import '../App.css'

function ButtonHomeMenu(props){
    
    const {label, icon} = props;
    
    
    return (
        <button className="border w-max min-w-[50%] hover:bg-koop-d hover:text-white hover:shadow-md shadow-koop-d flex items-center space-x-2 border-koop-def px-4 py-2 bg-white rounded-xl text-black" >
            <span><img className="  object-cover " width={40} height={40} src={icon} /></span>
            <span>{label}</span>
        </button>
    )
}

function ItemTopMenu(props){

    let { icon, title, badge, divide } = props;


    return(
        <button className={` hover:bg-sky-100/30  w-full ${ divide ? ' border-b border-b-slate-200  ' : '' }  text-black flex items-center gap-2 p-2`} >
            <img src={icon} width={32} height={32} />
            <span>{ title }</span>
            <span className="flex-grow" ></span>
            <span className={`${ badge ? '' : 'hidden' } leading-[18pt] text-[10pt] bg-koop-green text-white w-[18pt] h-[18pt] rounded-full text-center font-bold`} >{ badge  }</span>
            
        </button>
    )
}

export default function PageHome(props){

    const [showMenu, setShowMenu] = useState(false);
    const { setSelectedPage } = props;

    
    
    return(
        <section className={` p-2 ${classes.clPage}`}>
           
            <div className="menu-bar flex justify-between p-2">
                <button><img src={menu} /></button>
                <button><img onClick={e => setShowMenu(!showMenu)} className="rounded-full" width={32} height={32} src={'https://pbs.twimg.com/profile_images/664701790537973760/PF7GvcBA_400x400.jpg'} /></button>
                <div className={`top-menu overflow-hidden ${ showMenu ? 'hidden' : '' } transition-2  absolute right-4 min-h-[120pt] bg-white min-w-[200pt] top-[46pt] shadow-xl rounded-[18pt]`}>
                    <ItemTopMenu icon={rhyf} title='My Account'  divide />
                    <ItemTopMenu icon={inbox} title='Inbox' badge={2}   />
                    <ItemTopMenu icon={reqserv} title='Requested Services' badge={7}   />
                    <ItemTopMenu icon={postedserv} title='Posted Services' badge={23}   />
                </div>
            </div>

            <div className="billbord flex flex-col items-center">

                <img className="w-[50%]" src={'/koop.png'} />

                <p className="text-center text-[24pt]">What would you like to do?</p>

            </div>

            <div className="flex flex-col gap-4 items-center  menu-cont bg-white rounded-[30pt] p-8 mt-8 mx-8">
                <ButtonHomeMenu label='Provide a Service' icon={provserv} />
                <ButtonHomeMenu label='Look for a Service' icon={lookserv} />
                <ButtonHomeMenu label='Other Services' icon={otherserv} />
                <p className="text-black text-center flex ">
                You can pick weather you are lookig for a service or you wanna provide a service
                </p>
            </div>
            
        </section>
    )
}
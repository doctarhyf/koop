import React from "react"
import { useState } from "react"
import menu from '../assets/icons/menu.png'
import rhyf from '../assets/icons/rhyf.png'
import reqserv from '../assets/icons/reqserv.png'
import postedserv from '../assets/icons/postedserv.png'
import inbox from '../assets/icons/inbox.png'
import shutdown from '../assets/icons/shutdown.png'


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

export default function MenuTopBar(props){

    const [showMenu, setShowMenu] = useState(false);
    const {  setSelectedPage } = props;

    return (
        <div className="menu-top-bar flex justify-between p-2">
                <button onClick={e => setSelectedPage('login')} ><img src={menu} /></button>
                <button><img onClick={e => setShowMenu(!showMenu)} className="rounded-full" width={32} height={32} src={'https://pbs.twimg.com/profile_images/664701790537973760/PF7GvcBA_400x400.jpg'} /></button>
                <div className={`top-menu  overflow-hidden ${ !showMenu ? 'hidden' : '' } transition-2  absolute right-4 min-h-[120pt] bg-white min-w-[200pt] top-[46pt] shadow-xl rounded-[18pt]`}>
                    <ItemTopMenu icon={rhyf} title='My Account'  divide />
                    <ItemTopMenu icon={inbox} title='Inbox' badge={2}   />
                    <ItemTopMenu icon={reqserv} title='Requested Services' badge={7}   />
                    <ItemTopMenu icon={postedserv} title='Posted Services' badge={23} divide   />
                    <button className="w-full" onClick={ e => setSelectedPage('login') } ><ItemTopMenu icon={shutdown} title='Signout'    /></button>
                </div>
            </div>
    )
}
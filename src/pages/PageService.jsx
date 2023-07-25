import React, { useEffect, useState } from "react";
import * as classes from "../helpers/class";
import provserv from '../assets/icons/provserv.png'
import lookserv from '../assets/icons/lookserv.png'
import otherserv from '../assets/icons/otherserv.png'
import search from '../assets/icons/search.png'
import reqserv from '../assets/icons/reqserv.png'
import email from '../assets/icons/email.png'
import phone from '../assets/icons/phone.png'
import '../App.css'
import MenuTopBar from "../comps/MenuTopBar";
import SectionTitle from '../comps/SectionTitle'
import ButtonHomeMenu from "../comps/ButtonHomeMenu";
import { SERVICES_TYPE } from '../helpers/fakeData';
import bin from '../assets/icons/bin.png';

function getRandomNumber() {
    // Generate a random number between 0 and 1
    const random = Math.random();
  
    // Scale the random number to be between 1 and 5
    const randomNumber = Math.floor(random * 5) + 1;
  
    return randomNumber;
  }
  
function ContactItem({icon, label, link}){
    return (
        <button className="flex gap-4" onClick={e => console.log(link)}>
            <img src={icon} width={30} height={30} alt={label} />
            <span className="underline text-sky-500 hover:text-sky-400">{label}</span>
        </button>
    )
}

export default function PageService(props){

    const { setSelectedPage } = props;

    const ar = new Array(8).fill(0);
    const link = `/diapo/p${getRandomNumber()}.jpg`
    const cl = `bg-red-500 bg-[url('/diapo/p3.jpg')] -mt-16 -mx-2 bg-im h-[280pt]`

    return (

        <section className={` p-2 ${classes.clPage}`}>
           
            <MenuTopBar setSelectedPage={setSelectedPage} transp title='Service' />

            <div className={cl} >

            </div>

            <div className="text-black rounded-t-[40pt] bg-white -mt-8 p-8">
                <section>
                    <SectionTitle label='About' />
                    <p>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                    </p>
                </section>

                <section>
                    <SectionTitle label='Contact' />
                    <div className="gap-4 flex flex-col mt-8">
                        <ContactItem icon={email} label={'maison@email.com'} link={''} />
                        <ContactItem icon={phone} label={'+243892125047'} link={''} />
                    </div>
                </section>
            </div>

        </section>
        
    )
}
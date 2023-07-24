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


export default function PageMyAccount(props){
    
    const { setSelectedPage } = props;

    const ar = new Array(8).fill(0);

    return(
        <section className={` p-2 ${classes.clPage}`}>
           
            <MenuTopBar setSelectedPage={setSelectedPage}  title='MY ACCOUNT' />

            My Accout

                <ButtonHomeMenu setSelectedPage={setSelectedPage} label='Confirm' icon={reqserv} route={'home'} />

                

            </div>
            
        </section>
    )
}
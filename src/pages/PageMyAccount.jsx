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
import docta from '../assets/docta.jpg'
import orange from '../assets/orange.png'
import mpesa from '../assets/mpesa.png'
import visa from '../assets/visa.png'
import airtel from '../assets/airtel.png'
import save from '../assets/icons/save.png'

const rhyf = 'https://pbs.twimg.com/profile_images/664701790537973760/PF7GvcBA_400x400.jpg'

const PaymentsMethods = [
    {name:'Visa', url:'', logo:visa},
    {name:'Orange Money', url:'', logo:orange},
    {name:'Airtel Money', url:'', logo:airtel},
    {name:'Vodacom M-Pesa', url:'', logo:mpesa}
]

const subsData = [
    {
        title:'Monthly', price:'$2 / Month', desc:'Pour un abonnement mensuel', oldPrice:''
    },
    {
        title:'Yearly', price:'$20 / year', desc:'Pour un abonnement annuel vous economisez deux mois.', oldPrice:'$24 / Year'
    }
]

function SubscriptionCard({data}) {

    const { title, price, oldPrice, desc } = data;
    const [checked, setChecked] = useState(false);
    
    function onChange(e){
        const v = e.target.value;
        setChecked(v)

        console.log(v)
    }

    return (
        <div className={`mb-4 bg-slate-100 text-black border ${ checked ? 'border-green-500' : '' } p-4 rounded-xl shadow-lg`} >
            <div className="flex justify-between">
                <div>{title}</div>
                <input type="radio" onChange={onChange}   name='sub'/>
            </div>
            <div>
               <span className="text-green-500"> {price} </span>
               { oldPrice && <span className="text-red-500 line-through">{oldPrice}</span> }
            </div>
            <div className="text-sm text-slate-400">
                {desc}
            </div>
        </div>
    )
}

export default function PageMyAccount(props){
    
    const imgSize = 120;
    const { setSelectedPage } = props;

    const ar = new Array(8).fill(0);

    function onSave(e){
        alert(e)
    }

    return(
        <section className={` p-2 ${classes.clPage}`}>
           
            <MenuTopBar setSelectedPage={setSelectedPage}  title='MY ACCOUNT' />

            <div className="body  flex flex-col">

                <div className="header text-sm flex  items-center justify-around mx-6">
                    <div className="flex flex-col justify-center items-center">
                        <img className="rounded-full" src={rhyf} width={imgSize} height={imgSize} />
                        <div className="font-bold">MUTUNDA KOJI Franvale</div>
                        <div className="text-black"> +243 893 092 849</div>
                    </div>
                    <div className="flex flex-row gap-4" >
                        <div className="flex flex-col justify-center items-center">
                            <div className="bg-green-500 p-2 px-4 text-sm rounded-full">
                               ACTIVE
                            </div>
                            <div>
                                ACCOUNT STATS.
                            </div>
                            
                        </div>

                        <div className="flex flex-col justify-center items-center">
                            <div className="p-2 text-sm">
                               Subscription End.
                            </div>
                            <div>
                                { new Date().toLocaleDateString() }
                            </div>
                            
                        </div>

                       
                    </div>
                </div>

                <div className="cont  bg-white shadow-xl rounded-t-[20pt] p-8 mt-8 mx-4 ">

                    <section className="section-forms">
                        <SectionTitle label={'PERSONAL INFO'} />
                        <input type="text" disabled placeholder="name" className={`${ classes.clInputText }`} />
                        <input type="text" disabled placeholder="name" className={`${ classes.clInputText }`} />
                        <input type="text" disabled placeholder="name" className={`${ classes.clInputText }`} />
                        <input type="text" disabled placeholder="name" className={`${ classes.clInputText }`} />
                        <input type="text" disabled placeholder="name" className={`${ classes.clInputText }`} />
                    </section>

                    <section className="section-forms">
                        <SectionTitle label={'SUBSCRIPTION'} />
                        {
                            subsData.map((sub, i) => <SubscriptionCard key={i} data={sub} />)
                        }
                        
                       
                    </section>

                    <section className="section-forms flex flex-col gap-8">
                        <SectionTitle label={'PAYMENT METHODS'} />

                        <div className="flex justify-around" >
                        {
                            PaymentsMethods.map((pay, i) => 
                                <button key={i}><img alt={pay.name} src={[pay.logo]} alt={i} /></button>
                            )
                        }
                        </div>

                        <ButtonHomeMenu  onClick={onSave}  label='Confirm' icon={save}  /> 
                        
                       
                    </section>

                </div>

                

            </div>

            

                

           
            
        </section>
    )
}
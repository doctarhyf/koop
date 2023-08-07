import React, { useEffect, useState } from "react"
import koop from '../assets/koop.png'
import { data } from "autoprefixer"
import { ROUTES, SOCIAL_CONNECT } from "../helpers/flow";
import * as classes from '../helpers/class'; 
import facebook from '../assets/facebook.png'
import google from '../assets/google.png'
import apple from '../assets/apple.png'
import insta from '../assets/insta.png'

const API = 'https://fakestoreapi.com/products/'
const SOCIAL_LOGOS = {
    facebook : facebook,
    google : google,
    apple : apple,
    insta : insta
}

export default function PageLogin(props){

    const [posts, setPosts] = useState([])

    const { setSelectedPage } = props;

    useEffect(() => {

        let data = false;

        async function fetchData() {

            setPosts([])
            const response = await fetch(API);
            data = await response.json();
            setPosts(data);
            console.log('data -> ', data);
        }

        fetchData();
       

    }, [])

    

    return(
        <div className="bg-koop-def min-h-screen">

            <div className="  head backdrop-blur-3xl fixed bg-sky-500/ w-full  flex flex-col justify-center items-center ">
                <button className="  w-[195px] h-[173px] " onClick={ setSelectedPage(ROUTES.HOME.name) } >
                    <img className=" w-[100%] h-[100%] " src={koop} />
                </button>
                <p className="text-center">+ 10000 des services a votre dispositions</p>

                <div>
                    <div className="flex gap-8" >
                        <button className=" border border-red-500 px-2 hover:bg-slate-500 hover:border-slate-500 rounded-full text-white" >Se connecter</button> 
                        <button className=" border border-gray-800 px-2 hover:bg-slate-500 hover:border-slate-500 text-white rounded-full " >S'enregister</button>
                    </div>

                    <div className="flex flex-col my-4 gap-2 justify-center">
                        <div className="text-center font-italic text-white text-sm bg-koop-def/50 rounded-full " >Se connecter avec</div>

                        <div className=" flex flex-row  justify-between " >
                        { Object.values(SOCIAL_CONNECT).map((it, i) => <div className="w-[32px] h-[32px]  " > <img  className=" bg-white rounded-full w-[100%] h-[100%] object-cover "  key={i} src={SOCIAL_LOGOS[it.icon]} alt={SOCIAL_LOGOS[it.icon]} /> </div> ) }
                        </div>
                    </div>

                </div>

            </div>

           

            <main className="main-diapo pt-[220px] w-full mx-auto" >

                <ul className='galery py-0 px-[14px] max-w-[1100px] mx-auto my-0 flex flex-wrap gap-[2vmin]' >
                   { posts && posts.map((it, i) => <li className=" grow-[1] list-none h-[250px] " ><img className=" w-[100%] h-[100%] object-cover " src={it.image} /></li> ) }
                </ul>

               {/*  <div className="flex flex-wrap justify-around" >
                { posts && posts.map((it, i) =>  <div className="max-w-[140px] max-h-[140px] bg-red-400 " ><img className="w-full object-fill"  src={it.image} /></div> )
                }
                </div> */}
            </main>

            cool

        </div>
    )
}